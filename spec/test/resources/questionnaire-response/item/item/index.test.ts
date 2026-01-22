import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertGroupNode,
  isGroupNode,
} from "@formbox/renderer/store/group/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { isDisplayNode } from "@formbox/renderer/store/display/display-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("item.item", () => {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "single-group",
        text: "One-off section",
        type: "group",
        item: [
          {
            linkId: "group-question",
            text: "Group string question",
            type: "string",
          },
          {
            linkId: "group-note",
            text: "Reminder",
            type: "display",
          },
        ],
      },
    ],
  };

  const response: QuestionnaireResponse = {
    resourceType: "QuestionnaireResponse",
    questionnaire: "#questionnaire",
    status: "completed",
    item: [
      {
        linkId: "single-group",
        item: [
          {
            linkId: "group-question",
            answer: [{ valueString: "Inside group" }],
          },
        ],
      },
    ],
  };

  const createStore = () => new FormStore(questionnaire, response);

  const getGroupStore = () => {
    const form = createStore();
    const group = form.scope.lookupNode("single-group");
    assertGroupNode(group);
    return group;
  };

  it("creates group nodes with child items", () => {
    const singleGroupStore = getGroupStore();
    expect(isGroupNode(singleGroupStore)).toBe(true);
    assertGroupNode(singleGroupStore);
    expect(singleGroupStore.nodes).toHaveLength(2);
  });

  it("hydrates answers within group responses", () => {
    const singleGroupStore = getGroupStore();
    assertGroupNode(singleGroupStore);
    const groupQuestion = singleGroupStore.nodes.at(0);
    expect(groupQuestion?.token).toBe("__single-group__group-question");
    expect(groupQuestion && isQuestionNode(groupQuestion)).toBe(true);
    assertQuestionNode(groupQuestion);
    expect(groupQuestion.answers).toHaveLength(1);
    expect(groupQuestion.answers.at(0)?.value).toBe("Inside group");
  });

  it("retains display child content inside groups", () => {
    const singleGroupStore = getGroupStore();
    assertGroupNode(singleGroupStore);
    const groupNote = singleGroupStore.nodes.at(1);
    expect(groupNote && isDisplayNode(groupNote)).toBe(true);
    expect(groupNote?.token).toBe("__single-group__group-note");
  });

  it("nests question answers under group items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/grouped",
      status: "active",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          type: "group",
          item: [
            {
              linkId: "consent",
              text: "Consent to share data",
              type: "boolean",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("demographics");
    expect(group && isGroupNode(group)).toBe(true);
    assertGroupNode(group);
    const question = group.nodes.at(0);
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const consentAnswer = question.answers[0];
    assertDefined(consentAnswer);
    consentAnswer.setValueByUser(true);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/grouped",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          item: [
            {
              linkId: "consent",
              text: "Consent to share data",
              answer: [{ valueBoolean: true }],
            },
          ],
        },
      ],
    });
  });

  describe("when response omits the group", () => {
    const questionnaireMissingResponse: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "single-group",
          type: "group",
          item: [
            {
              linkId: "required-question",
              text: "Mandatory value",
              type: "string",
              required: true,
            },
          ],
        },
      ],
    };

    const responseMissingGroup: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
    };

    const createMissingGroupStore = () =>
      new FormStore(questionnaireMissingResponse, responseMissingGroup);

    it("materializes child nodes from the template", () => {
      const form = createMissingGroupStore();
      const group = form.scope.lookupNode("single-group");
      expect(group && isGroupNode(group)).toBe(true);
      assertGroupNode(group);
      const childIds = group.nodes.map((child) => child.linkId);
      expect(childIds).toEqual(["required-question"]);
    });

    it("seeds required questions with empty answers", () => {
      const form = createMissingGroupStore();
      const group = form.scope.lookupNode("single-group");
      assertGroupNode(group);
      const question = group.nodes.at(0);
      expect(question && isQuestionNode(question)).toBe(true);
      assertQuestionNode(question);
      expect(question.answers).toHaveLength(1);
      expect(question.answers.at(0)?.value).toBeUndefined();
    });
  });
});
