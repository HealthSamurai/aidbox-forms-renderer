import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import {
  makeMaxQuantityExpression,
  makeMaxValueExpression,
  makeMinQuantityExpression,
  makeMinValueExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import { isQuestionNode } from "../nodes/questions/question-store.ts";

describe("min/max value expressions", () => {
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
    if (!score || !isQuestionNode(score)) {
      throw new Error("Expected question store");
    }

    const answer = score.answers[0];
    if (!answer) throw new Error("Expected answer instance");

    score.setAnswer(0, 5);
    expect(
      answer.issues.some((issue) => issue.diagnostics?.includes("10")),
    ).toBe(true);

    score.setAnswer(0, 15);
    expect(answer.issues).toHaveLength(0);
  });

  it("enforces a calculated maximum", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score",
          type: "integer",
          extension: [makeMaxValueExpression(undefined, "15")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const score = form.scope.lookupNode("score");
    if (!score || !isQuestionNode(score)) {
      throw new Error("Expected question store");
    }

    const answer = score.answers[0];
    if (!answer) throw new Error("Expected answer instance");

    score.setAnswer(0, 20);
    expect(
      answer.issues.some((issue) => issue.diagnostics?.includes("15")),
    ).toBe(true);

    score.setAnswer(0, 10);
    expect(answer.issues).toHaveLength(0);
  });

  it("enforces the quantity floor returned by the expression", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "minDose",
              "%context.item.where(linkId='limit').answer.valueQuantity.last()",
            ),
          ],
          item: [
            {
              linkId: "limit",
              type: "quantity",
            },
            {
              linkId: "dose",
              type: "quantity",
              extension: [
                makeMinQuantityExpression("%minDose", {
                  value: 0,
                  unit: "mg",
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                }),
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const limit = form.scope.lookupNode("limit");
    const dose = form.scope.lookupNode("dose");

    if (!isQuestionNode(limit) || !isQuestionNode(dose)) {
      throw new Error("Expected quantity questions");
    }

    const doseAnswer = dose.answers[0];
    if (!doseAnswer) {
      throw new Error("Expected dose answer");
    }

    limit.setAnswer(0, {
      value: 20,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    dose.setAnswer(0, {
      value: 10,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(
      doseAnswer.issues.some((issue) =>
        issue.diagnostics?.includes("greater than or equal to"),
      ),
    ).toBe(true);

    dose.setAnswer(0, {
      value: 25,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(doseAnswer.issues).toHaveLength(0);
  });

  it("enforces the quantity ceiling returned by the expression", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "maxDose",
              "%context.item.where(linkId='limit').answer.valueQuantity.last()",
            ),
          ],
          item: [
            {
              linkId: "limit",
              type: "quantity",
            },
            {
              linkId: "dose",
              type: "quantity",
              extension: [
                makeMaxQuantityExpression("%maxDose", {
                  value: 0,
                  unit: "mg",
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                }),
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const limit = form.scope.lookupNode("limit");
    const dose = form.scope.lookupNode("dose");

    if (!isQuestionNode(limit) || !isQuestionNode(dose)) {
      throw new Error("Expected quantity questions");
    }

    const doseAnswer = dose.answers[0];
    if (!doseAnswer) {
      throw new Error("Expected dose answer");
    }

    limit.setAnswer(0, {
      value: 50,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    dose.setAnswer(0, {
      value: 60,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(
      doseAnswer.issues.some((issue) =>
        issue.diagnostics?.includes("less than or equal to"),
      ),
    ).toBe(true);

    dose.setAnswer(0, {
      value: 40,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(doseAnswer.issues).toHaveLength(0);
  });

  it("records issues when a minQuantityExpression evaluation fails", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          item: [
            {
              linkId: "dose",
              type: "quantity",
              extension: [
                makeMinQuantityExpression("1.total()", {
                  value: 0,
                  unit: "mg",
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                }),
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const dose = form.scope.lookupNode("dose");

    if (!isQuestionNode(dose)) {
      throw new Error("Expected quantity question");
    }

    dose.setAnswer(0, {
      value: 15,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });

    void dose.answers[0]?.issues;

    expect(
      dose.issues.some((issue) =>
        issue.diagnostics?.includes(
          "Failed to evaluate min-quantity expression",
        ),
      ),
    ).toBe(true);
  });
});
