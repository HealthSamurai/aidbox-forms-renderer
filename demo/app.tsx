import { useCallback, useMemo, useState } from "react";

import { default as Renderer } from "../lib";

import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

const sampleQuestionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  id: "basic-intake",
  status: "active",
  title: "Basic Intake Form",
  description:
    "A primitive rendering of a FHIR Questionnaire supporting core item types.",
  item: [
    {
      linkId: "1",
      text: "Patient Details",
      prefix: "A",
      type: "group",
      item: [
        {
          linkId: "1.1",
          text: "First name",
          type: "string",
          required: true,
        },
        {
          linkId: "1.2",
          text: "Last name",
          type: "string",
          required: true,
        },
        {
          linkId: "1.3",
          text: "Birth date",
          type: "date",
        },
        {
          linkId: "1.4",
          text: "Contact email",
          type: "string",
        },
      ],
    },
    {
      linkId: "2",
      text: "How often do you exercise?",
      type: "coding",
      answerOption: [
        { valueCoding: { code: "daily", display: "Daily" } },
        { valueCoding: { code: "weekly", display: "A few times a week" } },
        { valueCoding: { code: "rarely", display: "Rarely" } },
      ],
    },
    {
      linkId: "3",
      text: "Do you have any dietary restrictions?",
      type: "text",
    },
    {
      linkId: "4",
      text: "Height (cm)",
      type: "integer",
    },
    {
      linkId: "5",
      text: "Most recent lab value",
      type: "decimal",
    },
    {
      linkId: "6",
      text: "Do you currently smoke?",
      type: "boolean",
    },
    {
      linkId: "7",
      text: "Double-check your information before submitting.",
      type: "display",
    },
    {
      linkId: "8",
      text: "Preferred appointment time",
      type: "time",
    },
    {
      linkId: "9",
      text: "Preferred follow-up date and time",
      type: "dateTime",
    },
    {
      linkId: "10",
      text: "Household members",
      prefix: "B",
      type: "group",
      repeats: true,
      item: [
        {
          linkId: "10.1",
          text: "Member name",
          type: "string",
          required: true,
        },
        {
          linkId: "10.2",
          text: "Relationship to patient",
          type: "coding",
          answerOption: [
            { valueCoding: { code: "spouse", display: "Spouse/Partner" } },
            { valueCoding: { code: "child", display: "Child" } },
            { valueCoding: { code: "parent", display: "Parent/Guardian" } },
            { valueCoding: { code: "other", display: "Other" } },
          ],
        },
        {
          linkId: "10.3",
          text: "Contact details",
          type: "group",
          item: [
            {
              linkId: "10.3.1",
              text: "Phone number",
              type: "string",
            },
            {
              linkId: "10.3.2",
              text: "Preferred contact time",
              type: "time",
            },
          ],
        },
      ],
    },
    {
      linkId: "11",
      text: "Current medications",
      type: "group",
      item: [
        {
          linkId: "11.1",
          text: "Do you regularly take any prescribed medication?",
          type: "boolean",
          item: [
            {
              linkId: "11.1.1",
              text: "Medication details",
              type: "group",
              repeats: true,
              item: [
                {
                  linkId: "11.1.1.1",
                  text: "Medication name",
                  type: "string",
                  required: true,
                },
                {
                  linkId: "11.1.1.2",
                  text: "Dosage",
                  type: "quantity",
                },
                {
                  linkId: "11.1.1.3",
                  text: "Notes",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      linkId: "12",
      text: "Known allergies",
      type: "string",
      repeats: true,
      item: [
        {
          linkId: "12.1",
          text: "Describe the reaction",
          type: "text",
        },
      ],
    },
  ],
};

export function App() {
  const [questionnaire, setQuestionnaire] =
    useState<Questionnaire>(sampleQuestionnaire);
  const [questionnaireSource, setQuestionnaireSource] = useState(() =>
    JSON.stringify(sampleQuestionnaire, null, 2),
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

  const hasPendingChanges =
    questionnaireSource !== canonicalQuestionnaireSource;

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
        <textarea
          aria-label="Questionnaire JSON"
          value={questionnaireSource}
          onChange={(event) => setQuestionnaireSource(event.target.value)}
          className="flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm leading-6 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
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
        <textarea
          aria-label="Questionnaire Response JSON"
          value={JSON.stringify(questionnaireResponse ?? {}, null, 2)}
          readOnly
          className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm leading-6 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </aside>
    </main>
  );
}
