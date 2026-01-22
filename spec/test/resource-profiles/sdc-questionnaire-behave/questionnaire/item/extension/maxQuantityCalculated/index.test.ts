import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeMaxQuantityExpression,
  makeVariable,
} from "../../../../../../utilities.ts";

describe("maxQuantityCalculated", () => {
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

    assertQuestionNode(limit);
    assertQuestionNode(dose);

    const limitAnswer = limit.answers[0];
    assertDefined(limitAnswer);

    const doseAnswer = dose.answers[0];
    assertDefined(doseAnswer);

    limitAnswer.setValueByUser({
      value: 50,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    doseAnswer.setValueByUser({
      value: 60,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(form.validateAll()).toBe(false);
    expect(
      doseAnswer.issues.some((issue) =>
        issue.diagnostics?.includes("less than or equal to"),
      ),
    ).toBe(true);

    doseAnswer.setValueByUser({
      value: 40,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(doseAnswer.issues).toHaveLength(0);
  });
});
