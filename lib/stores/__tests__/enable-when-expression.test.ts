import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import {
  makeCalculatedExpression,
  makeEnableExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import { isQuestionNode } from "../question-store.ts";
import { isRepeatingGroupWrapper } from "../repeating-group-wrapper.ts";
import { isRepeatingGroupNode } from "../repeating-group-store.ts";

describe("enableWhenExpression", () => {
  it("toggles enablement using scoped variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            makeVariable(
              "controlValue",
              "%context.item.where(linkId='control').answer.valueInteger.last()",
            ),
          ],
          item: [
            {
              linkId: "control",
              text: "Control",
              type: "integer",
            },
            {
              linkId: "dependent",
              text: "Dependent",
              type: "string",
              extension: [makeEnableExpression(undefined, "%controlValue > 5")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    if (
      !control ||
      !dependent ||
      !isQuestionNode(control) ||
      !isQuestionNode(dependent)
    ) {
      throw new Error("Expected question stores");
    }

    expect(dependent.isEnabled).toBe(false);

    control.setAnswer(0, 6);
    expect(dependent.isEnabled).toBe(true);

    control.setAnswer(0, 3);
    expect(dependent.isEnabled).toBe(false);
  });

  it("allows named enableWhen expressions to populate variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            makeVariable(
              "controlFlag",
              "%context.item.where(linkId='control').answer.valueBoolean.last()",
            ),
          ],
          item: [
            {
              linkId: "control",
              type: "boolean",
            },
            {
              linkId: "dependent",
              type: "boolean",
              extension: [
                makeEnableExpression("dependentFlag", "%controlFlag"),
              ],
              item: [
                {
                  linkId: "mirror",
                  type: "boolean",
                  extension: [
                    makeCalculatedExpression(undefined, "%dependentFlag"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    if (!isQuestionNode(control) || !isQuestionNode(dependent)) {
      throw new Error("Expected question stores");
    }

    const mirror = dependent.answers[0]?.nodes.find(
      (child) => child.linkId === "mirror",
    );

    if (!mirror || !isQuestionNode(mirror)) {
      throw new Error("Expected descendant mirror question");
    }

    control.setAnswer(0, true);
    expect(mirror.answers[0]?.value).toBe(true);
  });

  it("records issues when enableWhen expression references unknown variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [makeEnableExpression(undefined, "%missingFlag")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestionNode(controlled)) {
      throw new Error("Expected question store");
    }

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry?.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it references unavailable data",
    );
  });

  it("records issues when enableWhen expression has syntax errors", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [makeEnableExpression(undefined, "1 +")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestionNode(controlled)) {
      throw new Error("Expected question store");
    }

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry?.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because the expression has a syntax error",
    );
  });

  it("records issues when enableWhen expression fails at runtime", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [makeEnableExpression(undefined, "1.total()")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestionNode(controlled)) {
      throw new Error("Expected question store");
    }

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry?.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it calls an unsupported function",
    );
  });

  it("treats ancestor->descendant enableWhen expression as unsatisfiable (no answers)", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "cyclic-expression",
      status: "active",
      item: [
        {
          linkId: "repeating-group",
          type: "group",
          repeats: true,
          extension: [
            makeEnableExpression(undefined, "%controlFlag"),
            makeVariable(
              "controlFlag",
              "%context.item.where(linkId='control').answer.valueBoolean.last()",
            ),
          ],
          item: [{ linkId: "control", type: "boolean" }],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const wrapper = form.scope.lookupNode("repeating-group");

    expect(wrapper && isRepeatingGroupWrapper(wrapper)).toBe(true);
    if (!wrapper || !isRepeatingGroupWrapper(wrapper)) return;

    wrapper.addInstance();
    expect(wrapper.nodes.length).toBe(1);

    const instance = wrapper.nodes.at(0);
    expect(instance && isRepeatingGroupNode(instance)).toBe(true);
    if (!instance || !isRepeatingGroupNode(instance)) return;

    expect(instance.isEnabled).toBe(false);
    expect(instance.hidden).toBe(true);
    expect(instance.responseItems).toHaveLength(0);

    const control = instance.nodes.find((node) => node.linkId === "control");
    expect(control && isQuestionNode(control)).toBe(true);
    if (!control || !isQuestionNode(control)) return;

    expect(control.isEnabled).toBe(false);
    expect(control.hidden).toBe(true);
    expect(control.responseItems).toHaveLength(0);

    expect(form.response.item ?? []).toHaveLength(0);
  });
});
