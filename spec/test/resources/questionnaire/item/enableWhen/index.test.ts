import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "@formbox/renderer/store/group/group-list-store.ts";
import {
  assertGroupNode,
  isGroupNode,
} from "@formbox/renderer/store/group/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("enableWhen", () => {
  it("enables a dependent item when equality condition is met", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        { linkId: "control", type: "boolean", text: "Control" },
        {
          linkId: "dependent",
          type: "string",
          text: "Dependent",
          enableWhen: [
            {
              question: "control",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    expect(control && isQuestionNode(control)).toBe(true);
    expect(dependent && isQuestionNode(dependent)).toBe(true);
    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);

    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(true);
    expect(dependent.isEnabled).toBe(true);

    controlAnswer.setValueByUser(false);
    expect(dependent.isEnabled).toBe(false);
  });

  it("treats enableWhen arrays as 'any' when behavior is unspecified", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        { linkId: "flag", type: "boolean", text: "Flag" },
        { linkId: "score", type: "integer", text: "Score" },
        {
          linkId: "dependent-any",
          type: "display",
          text: "Any enabled",
          enableWhen: [
            {
              question: "flag",
              operator: "=",
              answerBoolean: true,
            },
            {
              question: "score",
              operator: ">",
              answerInteger: 5,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const flag = form.scope.lookupNode("flag");
    const score = form.scope.lookupNode("score");
    const dependent = form.scope.lookupNode("dependent-any");

    expect(flag && isQuestionNode(flag)).toBe(true);
    expect(score && isQuestionNode(score)).toBe(true);
    expect(dependent).toBeDefined();
    assertQuestionNode(flag);
    assertQuestionNode(score);
    assertDefined(dependent);

    expect(dependent.isEnabled).toBe(false);

    const flagAnswer = flag.answers[0];
    assertDefined(flagAnswer);
    flagAnswer.setValueByUser(true);
    expect(dependent.isEnabled).toBe(true);

    flagAnswer.setValueByUser(false);
    expect(dependent.isEnabled).toBe(false);

    const scoreAnswer = score.answers[0];
    assertDefined(scoreAnswer);
    scoreAnswer.setValueByUser(10);
    expect(dependent.isEnabled).toBe(true);
  });

  it("disables descendants when an ancestor is disabled", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        { linkId: "toggle", type: "boolean", text: "Toggle" },
        {
          linkId: "group",
          type: "group",
          text: "Conditional group",
          enableWhen: [
            {
              question: "toggle",
              operator: "=",
              answerBoolean: true,
            },
          ],
          item: [
            {
              linkId: "child",
              type: "string",
              text: "Child question",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const toggle = form.scope.lookupNode("toggle");
    const group = form.scope.lookupNode("group");
    const child = form.scope.lookupNode("child");

    expect(toggle && isQuestionNode(toggle)).toBe(true);
    expect(group && isGroupNode(group)).toBe(true);
    expect(child && isQuestionNode(child)).toBe(true);
    assertQuestionNode(toggle);
    assertGroupNode(group);
    assertQuestionNode(child);

    expect(group.isEnabled).toBe(false);
    expect(child.isEnabled).toBe(false);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);
    expect(group.isEnabled).toBe(true);
    expect(child.isEnabled).toBe(true);
  });

  it("treats disabled dependencies as having no answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "gate",
          type: "boolean",
        },
        {
          linkId: "control",
          type: "integer",
          enableWhen: [
            {
              question: "gate",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
        {
          linkId: "dependent",
          type: "string",
          enableWhen: [
            {
              question: "control",
              operator: "=",
              answerInteger: 5,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const gate = form.scope.lookupNode("gate");
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    assertQuestionNode(gate);
    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(control.isEnabled).toBe(false);
    expect(dependent.isEnabled).toBe(false);

    const gateAnswer = gate.answers[0];
    assertDefined(gateAnswer);
    gateAnswer.setValueByUser(true);
    expect(control.isEnabled).toBe(true);

    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(5);
    expect(dependent.isEnabled).toBe(true);

    gateAnswer.setValueByUser(false);
    expect(control.isEnabled).toBe(false);
    expect(dependent.isEnabled).toBe(false);
  });

  it("treats descendant nodes' enableWhen as unsatisfiable", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "cyclic",
      status: "active",
      item: [
        {
          linkId: "repeating-group",
          type: "group",
          repeats: true,
          enableWhen: [
            { question: "control", operator: "=", answerBoolean: true },
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
