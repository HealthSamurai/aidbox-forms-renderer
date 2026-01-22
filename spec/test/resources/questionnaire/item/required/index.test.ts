import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { isDisplayNode } from "@formbox/renderer/store/display/display-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("required", () => {
  it("defers validation until submit for untouched required questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "first-name",
          text: "First name",
          type: "string",
          required: true,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("first-name");
    assertQuestionNode(question);

    expect(question.hasErrors).toBe(false);
    expect(question.issues).toHaveLength(0);

    expect(form.validateAll()).toBe(false);
    expect(question.hasErrors).toBe(true);
    expect(question.issues.at(0)?.diagnostics).toMatch(/required/i);

    const answer1 = question.answers[0];
    assertDefined(answer1);
    answer1.setValueByUser();
    expect(question.issues).toHaveLength(1);

    const answer2 = question.answers[0];
    assertDefined(answer2);
    answer2.setValueByUser("Alice");
    expect(form.validateAll()).toBe(true);
    expect(question.hasErrors).toBe(false);
  });

  it("clears submit state after successful validation", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "email",
          text: "Email",
          type: "string",
          required: true,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("email");
    assertQuestionNode(question);

    expect(form.validateAll()).toBe(false);
    expect(form.isSubmitAttempted).toBe(true);

    const answer = question.answers[0];
    assertDefined(answer);
    answer.setValueByUser("user@example.com");
    expect(form.validateAll()).toBe(true);
    expect(form.isSubmitAttempted).toBe(false);
    expect(question.hasErrors).toBe(false);
  });

  it("ignores required on display items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "intro",
          text: "Intro",
          type: "display",
          required: true,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const display = form.scope.lookupNode("intro");
    expect(display && isDisplayNode(display)).toBe(true);

    expect(form.validateAll()).toBe(true);
  });

  it("applies required only when enableWhen conditions are met", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "toggle",
          text: "Toggle",
          type: "boolean",
        },
        {
          linkId: "details",
          text: "Details",
          type: "string",
          required: true,
          enableWhen: [
            {
              question: "toggle",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const toggle = form.scope.lookupNode("toggle");
    const details = form.scope.lookupNode("details");
    assertQuestionNode(toggle);
    assertQuestionNode(details);

    expect(details.isEnabled).toBe(false);
    expect(form.validateAll()).toBe(true);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);
    expect(details.isEnabled).toBe(true);
    expect(form.validateAll()).toBe(false);

    const detailsAnswer = details.answers[0];
    assertDefined(detailsAnswer);
    detailsAnswer.setValueByUser("Filled");
    expect(form.validateAll()).toBe(true);
  });

  it("requires at least one child answer in required groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          text: "Group",
          type: "group",
          required: true,
          item: [
            {
              linkId: "child",
              text: "Child",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("group");
    const child = form.scope.lookupNode("child");
    assertGroupNode(group);
    assertQuestionNode(child);

    expect(form.validateAll()).toBe(false);
    expect(group.issues.at(0)?.diagnostics).toMatch(/least one/i);

    const childAnswer = child.answers[0];
    assertDefined(childAnswer);
    childAnswer.setValueByUser("Value");
    expect(form.validateAll()).toBe(true);
  });
});
