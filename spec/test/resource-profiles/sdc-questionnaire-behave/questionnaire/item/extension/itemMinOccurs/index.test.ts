import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import type { IGroupNode } from "@formbox/renderer/types.ts";
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

import {
  makeMinOccursExpression,
  makeVariable,
} from "../../../../../../utilities.ts";

const minOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  valueInteger: value,
});

const maxOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  valueInteger: value,
});

describe("itemMinOccurs", () => {
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
          extension: [minOccurs(2), maxOccurs(3)],
          item: [
            {
              linkId: "repeat-question",
              text: "Visit date",
              type: "date",
              required: true,
            },
          ],
        },
      ],
    };

    const responseWithoutItems: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
    };

    const createEmptyGroupStore = () =>
      new FormStore(questionnaire, responseWithoutItems);

    const getEmptyGroupList = () => {
      const form = createEmptyGroupStore();
      const group = form.scope.lookupNode("repeating-group");
      assertGroupListStore(group);
      return group;
    };

    it("seeds the minimum number of empty nodes", () => {
      const group = getEmptyGroupList();
      expect(isGroupListStore(group)).toBe(true);
      assertGroupListStore(group);
      expect(group.nodes).toHaveLength(2);
      expect(
        group.nodes.every((node: IGroupNode) => node.nodes.length === 1),
      ).toBe(true);
      const firstQuestion = group.nodes.at(0)?.nodes.at(0);
      expect(firstQuestion && isQuestionNode(firstQuestion)).toBe(true);
      if (firstQuestion && isQuestionNode(firstQuestion)) {
        expect(firstQuestion.answers).toHaveLength(1);
        expect(firstQuestion.answers.at(0)?.value).toBeUndefined();
      }
    });

    it("disallows removing below the minimum", () => {
      const group = getEmptyGroupList();
      assertGroupListStore(group);
      expect(group.canRemove).toBe(false);
    });
  });

  describe("repeating questions", () => {
    const questionnaireMissingAnswers: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "repeating-question",
          text: "List attendees",
          type: "string",
          repeats: true,
          extension: [minOccurs(2), maxOccurs(4)],
        },
      ],
    };

    const responseMissingAnswers: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
    };

    const createMissingAnswersStore = () =>
      new FormStore(questionnaireMissingAnswers, responseMissingAnswers);

    it("seeds empty answers to meet minOccurs", () => {
      const form = createMissingAnswersStore();
      const question = form.scope.lookupNode("repeating-question");
      expect(question && isQuestionNode(question)).toBe(true);
      assertQuestionNode(question);
      expect(question.answers).toHaveLength(2);
      expect(
        question.answers.every((answer) => answer.value === undefined),
      ).toBe(true);
    });

    it("disallows removal until above the minimum", () => {
      const form = createMissingAnswersStore();
      const question = form.scope.lookupNode("repeating-question");
      assertQuestionNode(question);
      expect(question.canRemove).toBe(false);
    });
  });

  describe("validation", () => {
    it("updates question minOccurs when expression output changes", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "requireTwo",
                "%context.item.where(linkId='gate').answer.valueBoolean.last()",
              ),
            ],
            item: [
              {
                linkId: "gate",
                type: "boolean",
              },
              {
                linkId: "target",
                type: "string",
                repeats: true,
                extension: [
                  makeMinOccursExpression(
                    "iif(%requireTwo.exists() and %requireTwo, 2, 1)",
                  ),
                  {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
                    valueInteger: 5,
                  },
                ],
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const gate = form.scope.lookupNode("gate");
      const target = form.scope.lookupNode("target");

      assertQuestionNode(gate);
      assertQuestionNode(target);

      expect(target.minOccurs).toBe(1);
      expect(target.canRemove).toBe(false);
      expect(target.answers).toHaveLength(1);

      const gateAnswer = gate.answers[0];
      assertDefined(gateAnswer);
      gateAnswer.setValueByUser(true);
      expect(target.minOccurs).toBe(2);
      expect(target.canRemove).toBe(false);
      expect(target.answers).toHaveLength(2);

      target.addAnswer("extra");
      expect(target.answers).toHaveLength(3);
      expect(target.canRemove).toBe(true);

      const secondGateAnswer = gate.answers[0];
      assertDefined(secondGateAnswer);
      secondGateAnswer.setValueByUser(false);
      expect(target.minOccurs).toBe(1);
      expect(target.canRemove).toBe(true);
    });

    it("validates repeating question minOccurs across populated answers", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "symptom",
            text: "Symptoms",
            type: "string",
            repeats: true,
            extension: [minOccurs(2), maxOccurs(3)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = form.scope.lookupNode("symptom");
      assertQuestionNode(question);

      expect(form.validateAll()).toBe(false);
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);

      const firstAnswer = question.answers[0];
      assertDefined(firstAnswer);
      firstAnswer.setValueByUser("Cough");
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);

      question.answers[1]!.setValueByUser("Fever");
      expect(question.hasErrors).toBe(false);

      question.addAnswer();
      question.answers[2]!.setValueByUser("Fatigue");
      expect(question.canAdd).toBe(false);
      expect(question.hasErrors).toBe(false);

      question.answers[1]!.setValueByUser();
      question.answers[2]!.setValueByUser();
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);
    });

    it("validates repeating group occurs limits", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "family-history",
            text: "Family history",
            type: "group",
            repeats: true,
            extension: [minOccurs(1), maxOccurs(2)],
            item: [
              {
                linkId: "condition",
                text: "Condition",
                type: "string",
                required: true,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const group = form.scope.lookupNode("family-history");
      expect(group && isGroupListStore(group)).toBe(true);
      assertGroupListStore(group);

      expect(form.validateAll()).toBe(false);
      expect(group.issues).toHaveLength(1);
      expect(group.issues[0]?.diagnostics).toMatch(/occurrence/i);

      const firstNode = group.nodes.at(0);
      expect(firstNode).toBeDefined();
      assertDefined(firstNode);

      const question = firstNode.nodes.at(0);
      expect(question && isQuestionNode(question)).toBe(true);
      assertQuestionNode(question);

      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser("Diabetes");
      expect(group.issues).toHaveLength(0);
      expect(form.validateAll()).toBe(true);
    });

    it("validates group minOccurs when descendants empty", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "lifestyle",
            text: "Lifestyle",
            type: "group",
            extension: [minOccurs(1)],
            item: [
              {
                linkId: "exercise",
                text: "Exercise details",
                type: "string",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const group = form.scope.lookupNode("lifestyle");
      expect(group && isGroupNode(group)).toBe(true);
      assertGroupNode(group);

      expect(form.validateAll()).toBe(false);
      expect(group.issues.at(0)?.diagnostics).toMatch(/At least one answer/);

      const child = group.nodes.at(0);
      expect(child && isQuestionNode(child)).toBe(true);
      assertQuestionNode(child);
      const childAnswer = child.answers[0];
      assertDefined(childAnswer);
      childAnswer.setValueByUser("Runs daily");

      expect(form.validateAll()).toBe(true);
      expect(group.hasErrors).toBe(false);
    });
  });
});
