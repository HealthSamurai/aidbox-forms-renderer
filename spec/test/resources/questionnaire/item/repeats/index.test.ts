import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import type { IGroupNode } from "@formbox/renderer/types.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "@formbox/renderer/store/group/group-list-store.ts";
import { assertGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const minOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  valueInteger: value,
});

const maxOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  valueInteger: value,
});

describe("repeats", () => {
  it("keeps repeating group lists enabled while child nodes toggle", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "toggle",
          type: "boolean",
        },
        {
          linkId: "repeating-group",
          type: "group",
          repeats: true,
          enableWhen: [
            {
              question: "toggle",
              operator: "=",
              answerBoolean: true,
            },
          ],
          item: [
            {
              linkId: "question",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const list = form.scope.lookupNode("repeating-group");
    const toggle = form.scope.lookupNode("toggle");

    assertGroupListStore(list);
    assertQuestionNode(toggle);

    list.addNode();
    const node = list.nodes.at(0);
    assertGroupNode(node);

    expect(list.isEnabled).toBe(true);
    expect(node.isEnabled).toBe(false);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);

    expect(list.isEnabled).toBe(true);
    expect(node.isEnabled).toBe(true);

    toggleAnswer.setValueByUser(false);

    expect(list.isEnabled).toBe(true);
    expect(node.isEnabled).toBe(false);
  });

  describe("repeating groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "repeating-group",
          text: "Repeat section",
          type: "group",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(3)],
          item: [
            {
              linkId: "repeat-question",
              text: "Visit date",
              type: "date",
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
          linkId: "repeating-group",
          item: [
            {
              linkId: "repeat-question",
              answer: [{ valueDate: "2024-01-01" }],
            },
          ],
        },
        {
          linkId: "repeating-group",
          item: [
            {
              linkId: "repeat-question",
              answer: [{ valueDate: "2024-02-01" }],
            },
          ],
        },
      ],
    };

    const createStore = () => new FormStore(questionnaire, response);

    const getGroupList = () => {
      const form = createStore();
      const group = form.scope.lookupNode("repeating-group");
      assertGroupListStore(group);
      return group;
    };

    it("creates one node per response item", () => {
      const groupList = getGroupList();
      expect(isGroupListStore(groupList)).toBe(true);
      assertGroupListStore(groupList);
      expect(groupList.nodes).toHaveLength(2);
      expect(groupList.nodes.at(0)?.nodes).toHaveLength(1);
      expect(groupList.nodes.at(1)?.nodes).toHaveLength(1);
    });

    it("respects add/remove guards based on cardinality", () => {
      const groupList = getGroupList();
      assertGroupListStore(groupList);
      expect(groupList.canAdd).toBe(true);
      expect(groupList.canRemove).toBe(true);
    });

    it("hydrates repeating child question answers", () => {
      const groupList = getGroupList();
      assertGroupListStore(groupList);
      const [firstNode, secondNode] = groupList.nodes;
      const firstRepeat = firstNode?.nodes.at(0);
      const secondRepeat = secondNode?.nodes.at(0);
      expect(firstRepeat && isQuestionNode(firstRepeat)).toBe(true);
      expect(secondRepeat && isQuestionNode(secondRepeat)).toBe(true);
      assertDefined(firstRepeat);
      assertQuestionNode(firstRepeat);
      assertDefined(secondRepeat);
      assertQuestionNode(secondRepeat);
      expect(firstRepeat.answers.at(0)?.value).toBe("2024-01-01");
      expect(secondRepeat.answers.at(0)?.value).toBe("2024-02-01");
    });

    it("assigns unique path keys per node child", () => {
      const groupList = getGroupList();
      assertGroupListStore(groupList);
      const childPaths = groupList.nodes
        .map((node: IGroupNode) => node.nodes.at(0)?.token)
        .filter((path): path is string => !!path);
      expect(childPaths).toHaveLength(2);
      childPaths.forEach((path) => {
        expect(path).toMatch(/^__repeating-group__\d+__repeat-question$/);
      });
      expect(new Set(childPaths).size).toBe(childPaths.length);
    });

    it("indexes repeated children inside the node scope", () => {
      const form = createStore();
      expect(form.scope.lookupNode("repeat-question")).toBeUndefined();
      const group = form.scope.lookupNode("repeating-group");
      expect(group && isGroupListStore(group)).toBe(true);
      assertGroupListStore(group);
      const [firstNode, secondNode] = group.nodes;
      const firstChild = firstNode?.scope.lookupNode("repeat-question");
      const secondChild = secondNode?.scope.lookupNode("repeat-question");
      expect(firstChild && isQuestionNode(firstChild)).toBe(true);
      expect(secondChild && isQuestionNode(secondChild)).toBe(true);
      assertDefined(firstChild);
      assertQuestionNode(firstChild);
      assertDefined(secondChild);
      assertQuestionNode(secondChild);
      expect(firstChild.token).not.toBe(secondChild.token);
    });
  });

  describe("repeating questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "repeating-question",
          text: "List your favorite numbers",
          type: "integer",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(4)],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "repeating-question",
          answer: [{ valueInteger: 1 }, { valueInteger: 42 }],
        },
      ],
    };

    const createStore = () => new FormStore(questionnaire, response);

    const getQuestionStore = () => {
      const form = createStore();
      const question = form.scope.lookupNode("repeating-question");
      assertQuestionNode(question);
      return question;
    };

    it("creates a repeating question store", () => {
      const repeatingQuestionStore = getQuestionStore();
      expect(isQuestionNode(repeatingQuestionStore)).toBe(true);
      assertQuestionNode(repeatingQuestionStore);
      expect(repeatingQuestionStore.repeats).toBe(true);
    });

    it("hydrates all response answers", () => {
      const repeatingQuestionStore = getQuestionStore();
      assertQuestionNode(repeatingQuestionStore);
      expect(repeatingQuestionStore.answers.map((a) => a.value)).toEqual([
        1, 42,
      ]);
    });

    it("allows additional answers within cardinality bounds", () => {
      const repeatingQuestionStore = getQuestionStore();
      assertQuestionNode(repeatingQuestionStore);
      expect(repeatingQuestionStore.canAdd).toBe(true);
      expect(repeatingQuestionStore.canRemove).toBe(true);
    });
  });
});
