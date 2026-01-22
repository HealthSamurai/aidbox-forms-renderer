import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "@formbox/renderer/store/group/group-list-store.ts";
import {
  assertGroupNode,
  isGroupNode,
} from "@formbox/renderer/store/group/group-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCalculatedExpression,
  makeEnableExpression,
  makeVariable,
} from "../../../../../../utilities.ts";

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

    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);

    const controlAnswer0 = control.answers[0];
    assertDefined(controlAnswer0);
    controlAnswer0.setValueByUser(6);
    expect(dependent.isEnabled).toBe(true);

    const controlAnswerAgain = control.answers[0];
    assertDefined(controlAnswerAgain);
    controlAnswerAgain.setValueByUser(3);
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

    assertQuestionNode(control);
    assertQuestionNode(dependent);

    const mirror = dependent.answers[0]?.nodes.find(
      (child) => child.linkId === "mirror",
    );

    assertQuestionNode(mirror);

    const controlAnswerFinal = control.answers[0];
    assertDefined(controlAnswerFinal);
    controlAnswerFinal.setValueByUser(true);
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

    assertQuestionNode(controlled);

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry.enableWhen;
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

    assertQuestionNode(controlled);

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry.enableWhen;
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

    assertQuestionNode(controlled);

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it calls an unsupported function",
    );
  });

  it("treats ancestor->descendant enableWhen expression as unsatisfiable", () => {
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
    const list = form.scope.lookupNode("repeating-group");

    expect(list && isGroupListStore(list)).toBe(true);
    assertGroupListStore(list);

    list.addNode();
    expect(list.nodes.length).toBe(1);

    const node = list.nodes.at(0);
    expect(node && isGroupNode(node)).toBe(true);
    assertGroupNode(node);

    expect(node.isEnabled).toBe(false);
    expect(node.hidden).toBe(true);
    expect(node.responseItems).toHaveLength(0);

    const control = node.nodes.find((item) => item.linkId === "control");
    expect(control && isQuestionNode(control)).toBe(true);
    assertQuestionNode(control);

    expect(control.isEnabled).toBe(false);
    expect(control.hidden).toBe(true);
    expect(control.responseItems).toHaveLength(0);

    expect(form.response.item ?? []).toHaveLength(0);
  });
});
