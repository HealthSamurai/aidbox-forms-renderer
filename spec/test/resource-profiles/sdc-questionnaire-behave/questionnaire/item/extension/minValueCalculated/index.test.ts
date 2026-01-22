import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import { makeMinValueExpression } from "../../../../../../utilities.ts";

const minValueInteger = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueInteger: value,
});

const minQuantityExtension = (value: number, unit = "kg") => ({
  url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity",
  valueQuantity: {
    value,
    unit,
    system: "http://unitsofmeasure.org",
    code: unit,
  },
});

const mlQuantity = (value: number) => ({
  value,
  unit: "ml",
  system: "http://unitsofmeasure.org",
  code: "ml",
});

describe("minValueCalculated", () => {
  it("enforces a calculated minimum", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score",
          type: "integer",
          extension: [makeMinValueExpression(undefined, "10")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const score = form.scope.lookupNode("score");
    assertQuestionNode(score);

    const answer = score.answers[0];
    assertDefined(answer);

    answer.setValueByUser(5);
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) => issue.diagnostics?.includes("10")),
    ).toBe(true);

    answer.setValueByUser(15);
    expect(answer.issues).toHaveLength(0);
  });

  it("prefers expression-based quantity bounds over static values", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "fluid",
          text: "Fluid intake",
          type: "quantity",
          extension: [minQuantityExtension(5, "ml")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("fluid");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const registry = question.expressionRegistry;

    Object.defineProperty(registry, "minValue", {
      configurable: true,
      value: {
        value: [
          {
            value: 20,
            unit: "ml",
            system: "http://unitsofmeasure.org",
            code: "ml",
          },
        ],
      },
    });

    {
      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser(mlQuantity(15));
    }
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/greater than or equal to 20/),
      ),
    ).toBe(true);

    {
      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser(mlQuantity(22));
    }
    expect(answer.issues).toHaveLength(0);
  });

  it("ignores static numeric bounds when expression slot is invalid", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [minValueInteger(10)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("score");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const registry = question.expressionRegistry;
    Object.defineProperty(registry, "minValue", {
      configurable: true,
      value: {
        value: [true],
      },
    });

    const lowAnswer = question.answers[0];
    assertDefined(lowAnswer);
    lowAnswer.setValueByUser(3);
    expect(answer.issues).toHaveLength(0);

    const okAnswer = question.answers[0];
    assertDefined(okAnswer);
    okAnswer.setValueByUser(12);
    expect(answer.issues).toHaveLength(0);
  });

  it("enforces numeric bounds from expression slot results", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [minValueInteger(10)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("score");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const registry = question.expressionRegistry;
    Object.defineProperty(registry, "minValue", {
      configurable: true,
      value: {
        value: [25],
      },
    });

    const lowAnswer = question.answers[0];
    assertDefined(lowAnswer);
    lowAnswer.setValueByUser(20);
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/greater than or equal to 25/),
      ),
    ).toBe(true);

    const okAnswer = question.answers[0];
    assertDefined(okAnswer);
    okAnswer.setValueByUser(30);
    expect(answer.issues).toHaveLength(0);
  });

  it("considers only the first entry from expression result arrays", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [minValueInteger(10)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("score");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const registry = question.expressionRegistry;
    Object.defineProperty(registry, "minValue", {
      configurable: true,
      value: {
        value: [true, 40],
      },
    });

    const lowAnswer = question.answers[0];
    assertDefined(lowAnswer);
    lowAnswer.setValueByUser(5);
    expect(answer.issues).toHaveLength(0);

    const okAnswer = question.answers[0];
    assertDefined(okAnswer);
    okAnswer.setValueByUser(45);
    expect(answer.issues).toHaveLength(0);
  });
});
