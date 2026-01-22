import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const minValueInteger = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueInteger: value,
});

const maxValueInteger = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxValue",
  valueInteger: value,
});

const minValueQuantity = (value: { value: number; unit?: string }) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueQuantity: value,
});

const maxValueQuantity = (value: { value: number; unit?: string }) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxValue",
  valueQuantity: value,
});

describe("minValue", () => {
  it("checks numeric boundaries", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "age",
          text: "Age",
          type: "integer",
          extension: [minValueInteger(0), maxValueInteger(120)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("age");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const ageAnswerMin = question.answers[0];
    assertDefined(ageAnswerMin);
    ageAnswerMin.setValueByUser(-1);
    expect(form.validateAll()).toBe(false);
    const minIssues = answer.issues ?? [];
    expect(minIssues).toHaveLength(1);
    expect(minIssues[0]?.diagnostics).toMatch(/greater than or equal to/i);

    const ageAnswerMax = question.answers[0];
    assertDefined(ageAnswerMax);
    ageAnswerMax.setValueByUser(130);
    const maxIssues = answer.issues ?? [];
    expect(maxIssues).toHaveLength(1);
    expect(maxIssues[0]?.diagnostics).toMatch(/less than or equal to/i);

    const ageAnswerOk = question.answers[0];
    assertDefined(ageAnswerOk);
    ageAnswerOk.setValueByUser(35);
    expect(question.hasErrors).toBe(false);
  });

  it("enforces quantity limits", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "weight",
          text: "Weight",
          type: "quantity",
          extension: [
            minValueQuantity({ value: 10, unit: "kg" }),
            maxValueQuantity({ value: 200, unit: "kg" }),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("weight");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const lowAnswer = question.answers[0];
    assertDefined(lowAnswer);
    lowAnswer.setValueByUser({ value: 5, unit: "kg" });
    expect(form.validateAll()).toBe(false);
    expect(answer.issues.at(0)?.diagnostics).toMatch(
      /greater than or equal to/i,
    );

    const highAnswer = question.answers[0];
    assertDefined(highAnswer);
    highAnswer.setValueByUser({ value: 250, unit: "kg" });
    expect(answer.issues.at(0)?.diagnostics).toMatch(/less than or equal to/i);

    const okAnswer = question.answers[0];
    assertDefined(okAnswer);
    okAnswer.setValueByUser({ value: 75, unit: "kg" });
    expect(answer.issues).toHaveLength(0);
  });

  it("ignores min/max conflicts for integer bounds", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "priority",
          text: "Priority",
          type: "integer",
          extension: [minValueInteger(5), maxValueInteger(3)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("priority");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);
  });
});
