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
describe("item.linkId", () => {
  it("builds a QuestionnaireResponse with answered string questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/simple",
      status: "active",
      item: [
        {
          linkId: "first-name",
          text: "First name",
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
    const question = form.scope.lookupNode("first-name");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const firstNameAnswer = question.answers[0];
    assertDefined(firstNameAnswer);
    firstNameAnswer.setValueByUser("Alice");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/simple",
      item: [
        {
          linkId: "first-name",
          text: "First name",
          answer: [{ valueString: "Alice" }],
        },
      ],
    });
  });
});
