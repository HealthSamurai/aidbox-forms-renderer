import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCqfExpression,
  makeVariable,
} from "../../../../../../../../utilities.ts";

describe("requiredExpression", () => {
  it("makes questions required only when the guard expression is true", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "gateFlag",
              "%context.item.where(linkId='gate').answer.valueBoolean.last()",
            ),
          ],
          item: [
            {
              linkId: "gate",
              type: "boolean",
            },
            {
              linkId: "detail",
              type: "string",
              _required: {
                extension: [makeCqfExpression("%gateFlag")],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const gate = form.scope.lookupNode("gate");
    const detail = form.scope.lookupNode("detail");

    assertQuestionNode(gate);
    assertQuestionNode(detail);

    expect(form.validateAll()).toBe(true);
    expect(detail.required).toBe(false);

    const gateAnswer = gate.answers[0];
    assertDefined(gateAnswer);
    gateAnswer.setValueByUser(true);
    expect(detail.required).toBe(true);
    expect(form.validateAll()).toBe(false);

    expect(detail.issues.some((issue) => issue.code === "required")).toBe(true);

    const detailAnswer = detail.answers[0];
    assertDefined(detailAnswer);
    detailAnswer.setValueByUser("value");
    expect(form.validateAll()).toBe(true);
  });
});
