import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("item.text", () => {
  it("includes display items in the response", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/display",
      status: "active",
      item: [
        {
          linkId: "intro",
          text: "Introduction",
          type: "display",
        },
        {
          linkId: "ack",
          text: "Do you acknowledge?",
          type: "boolean",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("ack");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const ackAnswer = question.answers[0];
    assertDefined(ackAnswer);
    ackAnswer.setValueByUser(true);

    expect(form.response.item).toEqual([
      { linkId: "intro", text: "Introduction" },
      {
        linkId: "ack",
        text: "Do you acknowledge?",
        answer: [{ valueBoolean: true }],
      },
    ]);
  });
});
