import { describe, expect, it } from "vitest";
import type { Extension, Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const targetConstraint = (config: {
  key?: string | undefined;
  severity?: "error" | "warning" | undefined;
  human?: string | undefined;
  expression: string;
  location?: string | undefined;
}): Extension => {
  const result: Extension = {
    url: "http://hl7.org/fhir/StructureDefinition/targetConstraint",
    extension: [
      {
        url: "severity",
        valueCode: config.severity ?? "error",
      },
      {
        url: "expression",
        valueExpression: {
          language: "text/fhirpath",
          expression: config.expression,
        },
      },
    ],
  };

  if (config.key) {
    result.extension?.push({ url: "key", valueId: config.key });
  }
  if (config.human) {
    result.extension?.push({ url: "human", valueString: config.human });
  }
  if (config.location) {
    result.extension?.push({ url: "location", valueString: config.location });
  }

  return result;
};

describe("questionnaire constraint extension", () => {
  it("collects questionnaire-level constraint issues", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "consent",
          text: "Do you consent?",
          type: "boolean",
        },
      ],
      extension: [
        targetConstraint({
          key: "consent-required",
          human: "Consent answer is required.",
          expression:
            "item.where(linkId='consent').answer.valueBoolean.exists()",
        }),
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("consent");
    assertQuestionNode(question);

    expect(form.issues).toHaveLength(0);
    expect(form.validateAll()).toBe(false);
    expect(form.issues.at(0)?.diagnostics).toContain("Consent answer");

    const consentAnswer = question.answers[0];
    assertDefined(consentAnswer);
    consentAnswer.setValueByUser(true);

    expect(form.validateAll()).toBe(true);
    expect(form.issues).toHaveLength(0);
  });
});
