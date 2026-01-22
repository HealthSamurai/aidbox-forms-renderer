import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import { makeMaxValueExpression } from "../../../../../../utilities.ts";

describe("maxValueCalculated", () => {
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
    assertQuestionNode(score);

    const answer = score.answers[0];
    assertDefined(answer);

    answer.setValueByUser(20);
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) => issue.diagnostics?.includes("15")),
    ).toBe(true);

    answer.setValueByUser(10);
    expect(answer.issues).toHaveLength(0);
  });
});
