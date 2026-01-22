import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("hidden", () => {
  it("still serializes hidden items when they hold data", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/hidden",
      status: "active",
      item: [
        {
          linkId: "internal-flag",
          text: "Internal flag",
          type: "boolean",
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
              valueBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const flag = form.scope.lookupNode("internal-flag");
    expect(flag && isQuestionNode(flag)).toBe(true);
    assertQuestionNode(flag);

    const flagAnswer = flag.answers[0];
    assertDefined(flagAnswer);
    flagAnswer.setValueByUser(true);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden",
      item: [
        {
          linkId: "internal-flag",
          text: "Internal flag",
          answer: [{ valueBoolean: true }],
        },
      ],
    });
  });
});
