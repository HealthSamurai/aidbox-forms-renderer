import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";

describe("readOnly", () => {
  it("prefers response answers while remaining immutable", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "readonly",
          text: "Readonly field",
          type: "string",
          readOnly: true,
          initial: [{ valueString: "Template" }],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "readonly",
          answer: [{ valueString: "Server value" }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const node = form.scope.lookupNode("readonly");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers.at(0)?.value).toBe("Server value");
    expect(node.canAdd).toBe(false);
    expect(node.canRemove).toBe(false);
  });

  it("ignores readOnly questions during validation", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "readonly-question",
          text: "Read only value",
          type: "string",
          required: true,
          readOnly: true,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    expect(form.validateAll()).toBe(true);
    const question = form.scope.lookupNode("readonly-question");
    assertQuestionNode(question);
    expect(question.hasErrors).toBe(false);
  });
});
