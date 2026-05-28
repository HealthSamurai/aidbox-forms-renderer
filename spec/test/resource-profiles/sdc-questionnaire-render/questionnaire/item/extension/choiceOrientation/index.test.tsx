import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { AnswerType, IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function getQuestion<T extends AnswerType>(
  form: FormStore,
  linkId: string,
): IQuestionNode<T> {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }
  return node as IQuestionNode<T>;
}

describe("choiceOrientation", () => {
  it("renders radio-button choices horizontally when orientation is horizontal", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "color",
          text: "Favorite color",
          type: "string",
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
            {
              url: EXT.CHOICE_ORIENTATION,
              valueCode: "horizontal",
            },
          ],
          answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
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
    const question = getQuestion(form, "color");

    render(<ListSelectRenderer node={question} />);

    expect(question.choiceOrientation).toBe("horizontal");
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("renders radio-button choices vertically when orientation is vertical", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "fruit",
          text: "Favorite fruit",
          type: "string",
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
            {
              url: EXT.CHOICE_ORIENTATION,
              valueCode: "vertical",
            },
          ],
          answerOption: [{ valueString: "Apple" }, { valueString: "Orange" }],
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
    const question = getQuestion(form, "fruit");

    render(<ListSelectRenderer node={question} />);

    expect(question.choiceOrientation).toBe("vertical");
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("renders check-box choices horizontally when orientation is horizontal", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "allergy",
          text: "Allergy",
          type: "string",
          repeats: true,
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: "http://hl7.org/fhir/questionnaire-item-control",
                    code: "check-box",
                  },
                ],
              },
            },
            {
              url: EXT.CHOICE_ORIENTATION,
              valueCode: "horizontal",
            },
          ],
          answerOption: [{ valueString: "Dust" }, { valueString: "Pollen" }],
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
    const question = getQuestion(form, "allergy");

    render(<ListSelectRenderer node={question} />);

    expect(question.choiceOrientation).toBe("horizontal");
    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });
});
