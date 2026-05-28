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

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
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
