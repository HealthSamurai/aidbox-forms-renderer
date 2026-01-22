import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("enableBehavior", () => {
  it("respects enableBehavior 'all' across multiple conditions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        { linkId: "text", type: "string", text: "Text" },
        { linkId: "count", type: "integer", text: "Count" },
        {
          linkId: "dependent-all",
          type: "boolean",
          text: "All enabled",
          enableBehavior: "all",
          enableWhen: [
            {
              question: "text",
              operator: "=",
              answerString: "ok",
            },
            {
              question: "count",
              operator: ">=",
              answerInteger: 3,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const text = form.scope.lookupNode("text");
    const count = form.scope.lookupNode("count");
    const dependent = form.scope.lookupNode("dependent-all");

    expect(text && isQuestionNode(text)).toBe(true);
    expect(count && isQuestionNode(count)).toBe(true);
    expect(dependent && isQuestionNode(dependent)).toBe(true);
    assertQuestionNode(text);
    assertQuestionNode(count);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);

    const textAnswer = text.answers[0];
    assertDefined(textAnswer);
    textAnswer.setValueByUser("not yet");

    const countAnswer = count.answers[0];
    assertDefined(countAnswer);
    countAnswer.setValueByUser(5);
    expect(dependent.isEnabled).toBe(false);

    textAnswer.setValueByUser("ok");
    expect(dependent.isEnabled).toBe(true);
  });
});
