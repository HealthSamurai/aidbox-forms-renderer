import classNames from "classnames";
import type { ChangeEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Renderer from "../lib";

import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { demoSamples } from "./samples";

type DensePanelProps = {
  title: string;
  children: ReactNode;
  defaultSize: number;
  minSize: number;
  minWidthClass?: string;
  headerAction?: ReactNode;
};

type ApplyQuestionnaireButtonProps = {
  onClick: () => void;
};

function ApplyQuestionnaireButton({ onClick }: ApplyQuestionnaireButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-blue-700 text-white text-xs transition hover:bg-blue-600 active:translate-y-px"
    >
      <span aria-hidden="true">✓</span>
      <span className="sr-only">Apply Questionnaire</span>
    </button>
  );
}

function DensePanel({
  title,
  headerAction,
  children,
  defaultSize,
  minSize,
  minWidthClass,
}: DensePanelProps) {
  const actionSlot = headerAction ?? (
    <span className="block h-6 w-6 flex-shrink-0" aria-hidden="true" />
  );

  return (
    <Panel
      defaultSize={defaultSize}
      minSize={minSize}
      className={classNames(
        "flex h-full flex-col border rounded border-slate-200 bg-white",
        minWidthClass,
      )}
    >
      <div className="flex items-center justify-between gap-1 border-b border-slate-200 bg-slate-100 pl-2 pr-3">
        <h2 className="py-2.5 flex-1 min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-700 whitespace-nowrap">
          {title}
        </h2>
        {actionSlot}
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-3">
        {children}
      </div>
    </Panel>
  );
}

const cloneQuestionnaire = (input: Questionnaire): Questionnaire =>
  JSON.parse(JSON.stringify(input)) as Questionnaire;

export function App() {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(() => {
    if (typeof window === "undefined") {
      return demoSamples[0]!.id;
    }
    const params = new URLSearchParams(window.location.search);
    const candidate = params.get("sample");
    return demoSamples.some((sample) => sample.id === candidate)
      ? (candidate as string)
      : demoSamples[0]!.id;
  });
  const selectedSample = useMemo(
    () => demoSamples.find((sample) => sample.id === selectedSampleId),
    [selectedSampleId],
  );
  const initialQuestionnaire = useMemo(
    () =>
      selectedSample
        ? cloneQuestionnaire(selectedSample.questionnaire)
        : ({} as Questionnaire),
    [selectedSample],
  );
  const [questionnaire, setQuestionnaire] =
    useState<Questionnaire>(initialQuestionnaire);
  const [questionnaireSource, setQuestionnaireSource] = useState(() =>
    JSON.stringify(initialQuestionnaire, null, 2),
  );
  const [questionnaireError, setQuestionnaireError] = useState<string | null>(
    null,
  );
  const [questionnaireResponse, setQuestionnaireResponse] =
    useState<QuestionnaireResponse | null>(null);

  const canonicalQuestionnaireSource = useMemo(
    () => JSON.stringify(questionnaire, null, 2),
    [questionnaire],
  );

  const terminologyServerUrl = "https://tx.fhir.org/r5";

  const editorExtensions = useMemo(() => [json()], []);
  const responseViewerExtensions = editorExtensions;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("sample", selectedSampleId);
    window.history.pushState(null, "", url);
  }, [selectedSampleId]);

  const hasPendingChanges =
    questionnaireSource !== canonicalQuestionnaireSource;

  const sampleOptions = useMemo(
    () =>
      demoSamples.map((sample, index) => ({
        id: sample.id,
        label: `${index + 1}. ${sample.label}`,
      })),
    [],
  );

  const handleSelectSample = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextId = event.target.value;
      setSelectedSampleId(nextId);

      const nextSample = demoSamples.find((sample) => sample.id === nextId);
      if (!nextSample) {
        return;
      }

      const cloned = cloneQuestionnaire(nextSample.questionnaire);

      setQuestionnaire(cloned);
      setQuestionnaireResponse(null);
      const encoded = JSON.stringify(cloned, null, 2);
      setQuestionnaireSource(encoded);
      setQuestionnaireError(null);
    },
    [],
  );

  const handleApplyQuestionnaire = useCallback(() => {
    try {
      const parsed = JSON.parse(questionnaireSource) as Questionnaire;

      if (parsed.resourceType !== "Questionnaire") {
        throw new Error("JSON is not a Questionnaire resource");
      }

      setQuestionnaire(parsed);
      setQuestionnaireResponse(null);
      setQuestionnaireSource(JSON.stringify(parsed, null, 2));
      setQuestionnaireError(null);
    } catch (error) {
      setQuestionnaireError(
        error instanceof Error ? error.message : String(error),
      );
    }
  }, [questionnaireSource]);

  return (
    <main className="h-screen w-screen bg-slate-50 p-3">
      <PanelGroup
        direction="horizontal"
        autoSaveId="demo-panel-layout"
        className="flex h-full w-full"
      >
        <DensePanel
          title="Questionnaire"
          defaultSize={26}
          minSize={18}
          minWidthClass="min-w-[16rem]"
          headerAction={
            hasPendingChanges ? (
              <ApplyQuestionnaireButton onClick={handleApplyQuestionnaire} />
            ) : undefined
          }
        >
          <select
            id="sample-select"
            value={selectedSampleId}
            onChange={handleSelectSample}
            className="w-full rounded border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {sampleOptions.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>
          <div className="flex flex-1 overflow-hidden border border-slate-200">
            <CodeMirror
              aria-label="Questionnaire JSON"
              value={questionnaireSource}
              className="h-full text-xs"
              style={{ height: "100%", width: "100%" }}
              extensions={editorExtensions}
              basicSetup={{ lineNumbers: false, foldGutter: false }}
              onChange={(value) => setQuestionnaireSource(value)}
            />
          </div>
          {questionnaireError ? (
            <p className="w-full rounded bg-red-200 px-2 py-2 text-xs text-red-800">
              {questionnaireError}
            </p>
          ) : null}
        </DensePanel>
        <PanelResizeHandle className="w-3 cursor-col-resize bg-transparent" />
        <DensePanel
          title="Form"
          defaultSize={48}
          minSize={30}
          minWidthClass="min-w-[24rem]"
        >
          <div className="h-full flex-1 overflow-auto">
            <Renderer
              questionnaire={questionnaire}
              terminologyServerUrl={terminologyServerUrl}
              onSubmit={setQuestionnaireResponse}
              onChange={setQuestionnaireResponse}
            />
          </div>
        </DensePanel>
        <PanelResizeHandle className="w-3 cursor-col-resize bg-transparent" />
        <DensePanel
          title="Questionnaire Response"
          defaultSize={26}
          minSize={18}
          minWidthClass="min-w-[16rem]"
        >
          <div className="flex flex-1 overflow-hidden border border-slate-200">
            <CodeMirror
              aria-label="Questionnaire Response JSON"
              value={JSON.stringify(questionnaireResponse ?? {}, null, 2)}
              className="h-full text-xs"
              style={{ height: "100%", width: "100%" }}
              extensions={responseViewerExtensions}
              basicSetup={{ lineNumbers: false, foldGutter: false }}
              readOnly
            />
          </div>
        </DensePanel>
      </PanelGroup>
    </main>
  );
}
