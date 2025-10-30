import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { makeMinValueExpression } from "./expression-fixtures.ts";
import { isQuestionNode } from "../question-store.ts";

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

    score.setAnswer(0, 5);
    expect(
      score.issues.some((issue) => issue.diagnostics?.includes("10")),
    ).toBe(true);

    score.setAnswer(0, 15);
    expect(score.issues).toHaveLength(0);
  });

  it("records issues when multiple min-value expressions are declared", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score",
          type: "integer",
          extension: [
            makeMinValueExpression(undefined, "5"),
            makeMinValueExpression(undefined, "15"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const score = form.scope.lookupNode("score");
    if (!score || !isQuestionNode(score)) {
      throw new Error("Expected question store");
    }

    expect(
      score.issues.some((issue) =>
        issue.diagnostics?.includes(
          "Only one min-value extension is supported per item.",
        ),
      ),
    ).toBe(true);

    score.setAnswer(0, 4);
    expect(score.issues.some((issue) => issue.diagnostics?.includes("5"))).toBe(
      true,
    );
  });
});
