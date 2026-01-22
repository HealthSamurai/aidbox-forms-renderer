import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";

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

  const createStore = () => new FormStore(questionnaire, response);

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
      new FormStore(questionnaireMissingAnswer, responseMissingAnswer);

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

    const form = new FormStore(questionnaire);
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
