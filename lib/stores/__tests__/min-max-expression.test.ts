import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { isQuestion } from "../../utils.ts";
import { makeMinValueExpression } from "./expression-fixtures.ts";

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
    

    score.setAnswer(0, 5);
    console.log("score answer issues: ", score.answerIssues);
    expect(
      score.answerIssues.flat().some((issue) => issue.diagnostics?.includes("10")),
    ).toBe(true);

    score.setAnswer(0, 15);
    expect(score.answerIssues.some((issues) => issues.length > 0)).toBe(false);
  });
});
