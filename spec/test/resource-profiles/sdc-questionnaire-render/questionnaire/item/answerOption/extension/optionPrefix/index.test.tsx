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

function getStringQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected string question for ${linkId}`);
  }
  return node as IQuestionNode<"string">;
}

describe("optionPrefix", () => {
  it("renders prefixes before direct answerOption labels", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "severity",
          type: "string",
          text: "Severity",
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
          ],
          answerOption: [
            {
              valueString: "Mild",
              extension: [
                {
                  url: EXT.OPTION_PREFIX,
                  valueString: "(a)",
                },
              ],
            },
            {
              valueString: "Moderate",
              extension: [
                {
                  url: EXT.OPTION_PREFIX,
                  valueString: "(b)",
                },
              ],
            },
            {
              valueString: "Severe",
            },
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getStringQuestion(form, "severity");

    expect(
      question.answerOption.inherentOptions.map((option) => option.prefix),
    ).toEqual(["(a)", "(b)", undefined]);

    render(<ListSelectRenderer node={question} />);

    expect(
      screen.getAllByText((_content, element) => {
        return element?.textContent?.replaceAll(/\s+/g, "") === "(a)Mild";
      }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText((_content, element) => {
        return element?.textContent?.replaceAll(/\s+/g, "") === "(b)Moderate";
      }).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Severe")).toBeInTheDocument();
  });
});
