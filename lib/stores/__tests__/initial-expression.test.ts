import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import {
  makeCalculatedExpression,
  makeInitialExpression,
} from "./expression-fixtures.ts";
import { isQuestionNode } from "../question-store.ts";

describe("initialExpression", () => {
  it("runs once when the item first becomes enabled", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "gate",
          text: "Gate",
          type: "boolean",
        },
        {
          linkId: "name",
          text: "Name",
          type: "string",
          extension: [makeInitialExpression("namePrefill", "'prefill'")],
          enableWhen: [
            {
              question: "gate",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const gate = form.scope.lookupNode("gate");
    const name = form.scope.lookupNode("name");

    if (!gate || !name || !isQuestionNode(gate) || !isQuestionNode(name)) {
      throw new Error("Expected question stores");
    }

    expect(name.isEnabled).toBe(false);
    expect(name.answers[0]?.value).toBeNull();

    gate.setAnswer(0, true);
    expect(name.isEnabled).toBe(true);
    expect(name.answers[0]?.value).toBe("prefill");

    name.setAnswer(0, "custom");
    gate.setAnswer(0, false);
    gate.setAnswer(0, true);
    expect(name.answers[0]?.value).toBe("custom");
  });

  it("exposes named initial expressions for descendants", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "parent",
          type: "group",
          item: [
            {
              linkId: "answer",
              type: "string",
              extension: [makeInitialExpression("baseInit", "'value'")],
              item: [
                {
                  linkId: "mirror",
                  type: "string",
                  extension: [makeCalculatedExpression(undefined, "%baseInit")],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const answer = form.scope.lookupNode("answer");

    if (!isQuestionNode(answer)) {
      throw new Error("Expected question store");
    }

    const mirror = answer.answers[0]?.nodes.find(
      (child) => child.linkId === "mirror",
    );

    if (!mirror || !isQuestionNode(mirror)) {
      throw new Error("Expected mirror descendant question");
    }

    expect(mirror.answers[0]?.value).toBe("value");
  });

  it("captures errors from initial expressions that reference unknown variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "target",
          type: "string",
          extension: [makeInitialExpression(undefined, "%missingInit")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const target = form.scope.lookupNode("target");

    if (!target || !isQuestionNode(target)) {
      throw new Error("Expected question store");
    }

    const issue = target.issues.find((entry) => entry.code === "invalid");
    expect(issue).toBeTruthy();
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate initial expression",
    );
    expect(issue?.diagnostics).toContain(
      "because it references unavailable data",
    );
    expect(target.answers[0]?.value).toBeNull();
  });

  it("captures syntax errors from initial expressions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "target",
          type: "string",
          extension: [makeInitialExpression(undefined, "1 +")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const target = form.scope.lookupNode("target");

    if (!target || !isQuestionNode(target)) {
      throw new Error("Expected question store");
    }

    const issue = target.issues.find((entry) => entry.code === "invalid");
    expect(issue).toBeTruthy();
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate initial expression",
    );
    expect(issue?.diagnostics).toContain(
      "because the expression has a syntax error",
    );
    expect(target.answers[0]?.value).toBeNull();
  });

  it("records issues when multiple initial expressions are declared", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "target",
          type: "string",
          extension: [
            makeInitialExpression(undefined, "'first'"),
            makeInitialExpression(undefined, "'second'"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const target = form.scope.lookupNode("target");

    if (!target || !isQuestionNode(target)) {
      throw new Error("Expected target question");
    }

    expect(
      target.issues.some((issue) =>
        issue.diagnostics?.includes(
          "Only one initial extension is supported per item.",
        ),
      ),
    ).toBe(true);
    expect(target.answers[0]?.value).toBe("first");
  });
});
