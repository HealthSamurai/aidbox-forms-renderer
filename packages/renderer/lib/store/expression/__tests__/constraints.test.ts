import { describe, expect, it } from "vitest";
import type { Extension, Questionnaire } from "fhir/r5";

import { FormStore } from "../../form/form-store.ts";
import { assertQuestionNode } from "../../question/question-store.ts";
import { assertDefined } from "../../../utilities.ts";

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

describe("targetConstraint extensions", () => {
  it("enforces item-level constraints on submit", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Preferred nickname",
          type: "string",
          extension: [
            targetConstraint({
              key: "nickname-required",
              human: "Provide a nickname.",
              expression: "answer.exists()",
              location: "QuestionnaireResponse.item.where(linkId='nickname')",
            }),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("nickname");
    assertQuestionNode(question);

    expect(question.issues).toHaveLength(0);

    expect(form.validateAll()).toBe(false);
    expect(question.issues.at(0)?.diagnostics).toContain("nickname");
    expect(question.issues.at(0)?.severity).toBe("error");

    const nicknameAnswer = question.answers[0];
    assertDefined(nicknameAnswer);
    nicknameAnswer.setValueByUser("Sam");

    expect(question.hasErrors).toBe(false);
    expect(form.validateAll()).toBe(true);
  });

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

  it("treats warning constraints as non-blocking", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "optional-note",
          text: "Optional note",
          type: "string",
          extension: [
            targetConstraint({
              key: "note-warning",
              severity: "warning",
              human: "Consider adding a note.",
              expression: "answer.exists()",
            }),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("optional-note");
    assertQuestionNode(question);

    const optionalNoteAnswer = question.answers[0];
    assertDefined(optionalNoteAnswer);
    optionalNoteAnswer.setValueByUser();

    expect(question.issues.at(0)?.severity).toBe("warning");
    expect(question.issues.at(0)?.diagnostics).toContain("Consider adding");
    expect(form.validateAll()).toBe(true);
    expect(question.issues.at(0)?.severity).toBe("warning");
  });

  it("validates uppercase initial using custom expressions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "given-name",
          text: "Given name",
          type: "string",
          extension: [
            targetConstraint({
              key: "given-name-uppercase",
              human: "Start the given name with a capital letter.",
              expression:
                "answer.valueString.all($this = '' or $this.substring(0, 1) = $this.substring(0, 1).upper())",
            }),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("given-name");
    assertQuestionNode(question);

    const givenNameAnswer = question.answers[0];
    assertDefined(givenNameAnswer);
    givenNameAnswer.setValueByUser("maria");

    expect(form.validateAll()).toBe(false);
    expect(question.issues.at(0)?.diagnostics).toContain("capital letter");

    givenNameAnswer.setValueByUser("Maria");

    expect(form.validateAll()).toBe(true);
    expect(question.hasErrors).toBe(false);
  });
});
