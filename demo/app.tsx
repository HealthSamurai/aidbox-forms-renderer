import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { default as Renderer } from "../lib";

import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { demoSamples } from "./samples";

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

  const editorExtensions = useMemo(() => [json()], []);
  const responseViewerExtensions = editorExtensions;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("sample", selectedSampleId);
    window.history.replaceState(null, "", url);
  }, [selectedSampleId]);

  const hasPendingChanges =
    questionnaireSource !== canonicalQuestionnaireSource;

  const sampleOptions = useMemo(
    () =>
      demoSamples.map((sample) => ({
        id: sample.id,
        label: sample.label,
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
    <main className="grid min-h-screen grid-cols-[minmax(24rem,28rem)_minmax(40rem,1fr)_minmax(24rem,28rem)] items-start gap-8 p-8">
      <aside className="sticky top-8 flex h-[calc(100vh-4rem)] flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="py-1 text-lg font-medium">Questionnaire</h2>
          {hasPendingChanges ? (
            <button
              type="button"
              onClick={handleApplyQuestionnaire}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white transition hover:bg-blue-600 active:translate-y-px"
            >
              <span aria-hidden="true">✓</span>
              <span className="sr-only">Apply Questionnaire</span>
            </button>
          ) : null}
        </div>
        <select
          id="sample-select"
          value={selectedSampleId}
          onChange={handleSelectSample}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {sampleOptions.map((sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.label}
            </option>
          ))}
        </select>
        <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 flex">
          <CodeMirror
            aria-label="Questionnaire JSON"
            value={questionnaireSource}
            className="h-full"
            style={{ height: "100%", width: "100%" }}
            extensions={editorExtensions}
            onChange={(value) => setQuestionnaireSource(value)}
          />
        </div>
        {questionnaireError ? (
          <p className="rounded-lg bg-red-200 px-3 py-2 text-sm text-red-800">
            {questionnaireError}
          </p>
        ) : null}
      </aside>

      <section className="flex h-[calc(100vh-4rem)] flex-col overflow-auto rounded-xl border border-slate-200 bg-white">
        <Renderer
          questionnaire={questionnaire}
          onSubmit={setQuestionnaireResponse}
          onChange={setQuestionnaireResponse}
        />
      </section>

      <aside className="sticky top-8 flex h-[calc(100vh-4rem)] flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="py-1 text-lg font-medium">Questionnaire Response</h2>
        </div>
        <div className="flex-1 overflow-hidden rounded-lg border border-slate-200">
          <CodeMirror
            aria-label="Questionnaire Response JSON"
            value={JSON.stringify(questionnaireResponse ?? {}, null, 2)}
            className="h-full"
            extensions={responseViewerExtensions}
            readOnly
          />
        </div>
      </aside>
    </main>
  );
}
