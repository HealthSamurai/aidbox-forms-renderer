import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
describe("questionnaire", () => {
  it("falls back to a local Questionnaire reference when canonical URL is absent", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "local-form",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          type: "string",
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
    const question = form.scope.lookupNode("nickname");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const nicknameAnswer = question.answers[0];
    assertDefined(nicknameAnswer);
    nicknameAnswer.setValueByUser("Oli");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/local-form",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          answer: [{ valueString: "Oli" }],
        },
      ],
    });
  });
});
