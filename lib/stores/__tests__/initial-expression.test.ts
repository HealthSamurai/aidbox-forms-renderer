import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

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

  describe("readOnly propagation", () => {
    it("cascades group readOnly to descendants", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "group",
            type: "group",
            readOnly: true,
            item: [
              {
                linkId: "child",
                type: "string",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const group = form.scope.lookupNode("group");
      const child = form.scope.lookupNode("child");

      if (!group || !child || !isQuestionNode(child)) {
        throw new Error("Expected group and child question stores");
      }

      expect(group.readOnly).toBe(true);
      expect(child.readOnly).toBe(true);
    });

    it("does not cascade question readOnly to nested items", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "parent",
            type: "string",
            readOnly: true,
            item: [
              {
                linkId: "detail",
                type: "string",
              },
            ],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        questionnaire: "Questionnaire/readonly",
        item: [
          {
            linkId: "parent",
            answer: [
              {
                valueString: "value",
                item: [
                  {
                    linkId: "detail",
                    answer: [{ valueString: "child" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const parent = form.scope.lookupNode("parent");

      if (!parent || !isQuestionNode(parent)) {
        throw new Error("Expected parent question store");
      }

      const detail = parent.answers[0]?.nodes.find(
        (child) => child.linkId === "detail",
      );

      if (!detail || !isQuestionNode(detail)) {
        throw new Error("Expected nested detail question");
      }

      expect(parent.readOnly).toBe(true);
      expect(detail.readOnly).toBe(false);
    });
  });
});
