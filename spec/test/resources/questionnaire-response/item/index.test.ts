import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "@formbox/renderer/store/group/group-list-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("item", () => {
  it("omits disabled items from the QuestionnaireResponse", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/conditional",
      status: "active",
      item: [
        {
          linkId: "toggle",
          type: "boolean",
          text: "Enable extra details",
        },
        {
          linkId: "extra",
          type: "string",
          text: "Extra details",
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
    const extra = form.scope.lookupNode("extra");
    expect(
      toggle && extra && isQuestionNode(toggle) && isQuestionNode(extra),
    ).toBe(true);
    assertQuestionNode(toggle);
    assertQuestionNode(extra);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);

    const extraAnswer = extra.answers[0];
    assertDefined(extraAnswer);
    extraAnswer.setValueByUser("Hello");

    expect(form.response?.item?.some((item) => item.linkId === "extra")).toBe(
      true,
    );

    toggleAnswer.setValueByUser(false);

    expect(extra.hidden).toBe(true);
    expect(form.response?.item?.some((item) => item.linkId === "extra")).toBe(
      false,
    );
  });

  it("omits QuestionnaireResponse.item when no answerable content is populated", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/empty",
      status: "active",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("notes");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/empty",
    });
  });

  it("drops empty repeating group nodes from the response", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/empty-group",
      status: "active",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "condition",
              text: "Condition",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("family-history");
    expect(group && isGroupListStore(group)).toBe(true);
    assertGroupListStore(group);

    group.addNode();

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/empty-group",
    });
  });

  it("serializes multiple repeating group node with their nested answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/family-history",
      status: "active",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "condition",
              text: "Condition",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("family-history");
    expect(group && isGroupListStore(group)).toBe(true);
    assertGroupListStore(group);

    group.addNode();
    group.addNode();

    const [firstNode, secondNode] = group.nodes;
    expect(firstNode).toBeDefined();
    expect(secondNode).toBeDefined();
    assertDefined(firstNode);
    assertDefined(secondNode);

    const firstQuestion = firstNode.nodes.at(0);
    const secondQuestion = secondNode.nodes.at(0);
    expect(firstQuestion && isQuestionNode(firstQuestion)).toBe(true);
    expect(secondQuestion && isQuestionNode(secondQuestion)).toBe(true);
    assertQuestionNode(firstQuestion);
    assertQuestionNode(secondQuestion);

    const firstConditionAnswer = firstQuestion.answers[0];
    assertDefined(firstConditionAnswer);
    firstConditionAnswer.setValueByUser("Asthma");

    const secondConditionAnswer = secondQuestion.answers[0];
    assertDefined(secondConditionAnswer);
    secondConditionAnswer.setValueByUser("Diabetes");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/family-history",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          item: [
            {
              linkId: "condition",
              text: "Condition",
              answer: [{ valueString: "Asthma" }],
            },
          ],
        },
        {
          linkId: "family-history",
          text: "Family history",
          item: [
            {
              linkId: "condition",
              text: "Condition",
              answer: [{ valueString: "Diabetes" }],
            },
          ],
        },
      ],
    });
  });
});
