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
describe("item.answer", () => {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "single-question",
        text: "Do you agree?",
        type: "boolean",
      },
    ],
  };

  const response: QuestionnaireResponse = {
    resourceType: "QuestionnaireResponse",
    questionnaire: "#questionnaire",
    status: "completed",
    item: [
      {
        linkId: "single-question",
        answer: [{ valueBoolean: true }],
      },
    ],
  };

  const createStore = () =>
    new FormStore(en, "r5", "form", questionnaire, response, undefined);

  const getQuestionStore = () => {
    const form = createStore();
    const question = form.scope.lookupNode("single-question");
    assertQuestionNode(question);
    return question;
  };

  it("creates a question store for the questionnaire item", () => {
    const singleQuestionStore = getQuestionStore();
    expect(isQuestionNode(singleQuestionStore)).toBe(true);
  });

  it("hydrates a single answer from the response", () => {
    const singleQuestionStore = getQuestionStore();
    assertQuestionNode(singleQuestionStore);
    expect(singleQuestionStore.answers).toHaveLength(1);
    expect(singleQuestionStore.answers.at(0)?.value).toBe(true);
  });

  describe("when response omits the answer", () => {
    const questionnaireMissingAnswer: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "single-question",
          text: "Required field",
          type: "string",
          required: true,
        },
      ],
    };

    const responseMissingAnswer: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
    };

    const createMissingAnswerStore = () =>
      new FormStore(
        en,
        "r5",
        "form",
        questionnaireMissingAnswer,
        responseMissingAnswer,
        undefined,
      );

    it("ensures a placeholder answer exists", () => {
      const form = createMissingAnswerStore();
      const question = form.scope.lookupNode("single-question");
      expect(question && isQuestionNode(question)).toBe(true);
      assertQuestionNode(question);
      expect(question.answers).toHaveLength(1);
      expect(question.answers.at(0)?.value).toBeUndefined();
    });

    it("prevents removal when at minimum occurrences", () => {
      const form = createMissingAnswerStore();
      const question = form.scope.lookupNode("single-question");
      assertQuestionNode(question);
      expect(question.canRemove).toBe(false);
    });
  });

  it("omits empty repeating answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/repeating",
      status: "active",
      item: [
        {
          linkId: "allergies",
          text: "Document allergies",
          type: "string",
          repeats: true,
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
    const question = form.scope.lookupNode("allergies");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    question.addAnswer("Peanuts");
    question.addAnswer("Dust");
    question.addAnswer();

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/repeating",
      item: [
        {
          linkId: "allergies",
          text: "Document allergies",
          answer: [{ valueString: "Peanuts" }, { valueString: "Dust" }],
        },
      ],
    });
  });
});
