import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeMinQuantityExpression,
  makeVariable,
} from "../../../../../../utilities.ts";

describe("minQuantityCalculated", () => {
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

    assertQuestionNode(limit);
    assertQuestionNode(dose);

    const limitAnswer = limit.answers[0];
    assertDefined(limitAnswer);

    const doseAnswer = dose.answers[0];
    assertDefined(doseAnswer);

    limitAnswer.setValueByUser({
      value: 20,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    doseAnswer.setValueByUser({
      value: 10,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(form.validateAll()).toBe(false);
    expect(
      doseAnswer.issues.some((issue) =>
        issue.diagnostics?.includes("greater than or equal to"),
      ),
    ).toBe(true);

    doseAnswer.setValueByUser({
      value: 25,
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

    assertQuestionNode(dose);

    const doseAnswer = dose.answers[0];
    assertDefined(doseAnswer);
    doseAnswer.setValueByUser({
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
