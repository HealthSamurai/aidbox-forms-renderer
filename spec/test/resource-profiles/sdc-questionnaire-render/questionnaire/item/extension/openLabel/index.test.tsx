import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function getCodingQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected coding question for ${linkId}`);
  }
  return node as IQuestionNode<"coding">;
}

function buildQuestionnaire(openLabel?: string): Questionnaire {
  const openLabelExtension =
    openLabel == undefined
      ? []
      : [
          {
            url: EXT.SDC_OPEN_LABEL,
            valueString: openLabel,
          },
        ];

  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "symptom",
        text: "Primary symptom",
        type: "coding",
        answerConstraint: "optionsOrString",
        extension: [
          {
            url: EXT.ITEM_CONTROL,
            valueCodeableConcept: {
              coding: [
                {
                  system: "http://hl7.org/fhir/questionnaire-item-control",
                  code: "radio-button",
                },
              ],
            },
          },
          ...openLabelExtension,
        ],
        answerOption: [
          {
            valueCoding: {
              system: "http://snomed.info/sct",
              code: "25064002",
              display: "Headache",
            },
          },
          {
            valueCoding: {
              system: "http://snomed.info/sct",
              code: "386661006",
              display: "Fever",
            },
          },
        ],
      },
    ],
  };
}

describe("openLabel", () => {
  it("uses openLabel for unrestricted entry option", () => {
    const questionnaire = buildQuestionnaire("Other, please specify");

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getCodingQuestion(form, "symptom");

    render(<ListSelectRenderer node={question} />);

    expect(screen.getByText("Other, please specify")).toBeInTheDocument();
    expect(screen.queryByText("Specify other")).toBeNull();
  });

  it("falls back to default unrestricted entry label when openLabel is absent", () => {
    const questionnaire = buildQuestionnaire();

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getCodingQuestion(form, "symptom");

    render(<ListSelectRenderer node={question} />);

    expect(screen.getByText("Specify other")).toBeInTheDocument();
  });
});
