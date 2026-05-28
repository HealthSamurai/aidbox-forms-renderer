import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";

import type {
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/renderer";

type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

describe("answerOption.initialSelected", () => {
  it("applies initially selected options for non-repeating questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerOption: [
            { valueString: "red" },
            { valueString: "green", initialSelected: true },
            { valueString: "blue" },
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
    const node = form.scope.lookupNode("color");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers).toHaveLength(1);
    expect(node.answers[0]?.value).toBe("green");
  });

  it("applies all initially selected options for repeating questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          answerOption: [
            { valueString: "cough", initialSelected: true },
            { valueString: "fever" },
            { valueString: "fatigue", initialSelected: true },
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
    const node = form.scope.lookupNode("symptoms");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers.map((answer) => answer.value)).toEqual([
      "cough",
      "fatigue",
    ]);
  });

  it("preserves response answers over initially selected options", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "food",
          text: "Food",
          type: "string",
          answerOption: [
            { valueString: "pizza", initialSelected: true },
            { valueString: "sushi" },
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "food",
          answer: [{ valueString: "sushi" }],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      response,
      undefined,
    );
    const node = form.scope.lookupNode("food");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers).toHaveLength(1);
    expect(node.answers[0]?.value).toBe("sushi");
  });

  it("uses answerOption.initialSelected instead of item.initial when options exist", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "pet",
          text: "Pet",
          type: "string",
          initial: [{ valueString: "cat" }],
          answerOption: [
            { valueString: "dog", initialSelected: true },
            { valueString: "cat" },
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
    const node = form.scope.lookupNode("pet");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers).toHaveLength(1);
    expect(node.answers[0]?.value).toBe("dog");
  });
});
