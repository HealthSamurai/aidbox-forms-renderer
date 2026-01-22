import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

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

import {
  makeMaxOccursExpression,
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

describe("itemMaxOccurs", () => {
  it("caps additions when expression reduces maxOccurs", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "limitOne",
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
                makeMaxOccursExpression(
                  "iif(%limitOne.exists() and %limitOne, 1, 3)",
                ),
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

    expect(target.expressionRegistry.maxOccurs).toBeDefined();
    expect(target.expressionRegistry.maxOccurs?.error).toBeUndefined();
    expect(target.maxOccurs).toBe(3);

    target.addAnswer("first");
    target.addAnswer("second");
    target.addAnswer("third");
    expect(target.answers).toHaveLength(3);
    expect(target.canAdd).toBe(false);

    const gateAnswer = gate.answers[0];
    assertDefined(gateAnswer);
    gateAnswer.setValueByUser(true);
    expect(target.maxOccurs).toBe(1);
    expect(target.canAdd).toBe(false);

    const before = target.answers.length;
    target.addAnswer("fourth");
    expect(target.answers.length).toBe(before);

    const thirdAnswer = target.answers[2];
    assertDefined(thirdAnswer);
    target.removeAnswer(thirdAnswer);

    const secondAnswer = target.answers[1];
    assertDefined(secondAnswer);
    target.removeAnswer(secondAnswer);
    expect(target.answers).toHaveLength(1);
    expect(target.canAdd).toBe(false);

    const secondGateAnswer = gate.answers[0];
    assertDefined(secondGateAnswer);
    secondGateAnswer.setValueByUser(false);
    expect(target.maxOccurs).toBe(3);
    expect(target.canAdd).toBe(true);
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

    it("allows adding until reaching maxOccurs", () => {
      const group = getEmptyGroupList();
      assertGroupListStore(group);
      expect(group.canAdd).toBe(true);
    });
  });

  describe("when response reaches max occurrences", () => {
    const questionnaireAtMax: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "repeating-group",
          text: "Repeat section",
          type: "group",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(2)],
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

    const responseAtMax: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "repeating-group",
          item: [
            {
              linkId: "repeat-question",
              answer: [{ valueDate: "2024-03-01" }],
            },
          ],
        },
        {
          linkId: "repeating-group",
          item: [
            {
              linkId: "repeat-question",
              answer: [{ valueDate: "2024-04-01" }],
            },
          ],
        },
      ],
    };

    const createMaxGroupStore = () =>
      new FormStore(questionnaireAtMax, responseAtMax);

    it("prevents adding new nodes when maxOccurs reached", () => {
      const form = createMaxGroupStore();
      const group = form.scope.lookupNode("repeating-group");
      expect(group && isGroupListStore(group)).toBe(true);
      assertGroupListStore(group);
      expect(group.nodes).toHaveLength(2);
      expect(group.canAdd).toBe(false);
    });

    it("allows removing because above the minimum", () => {
      const form = createMaxGroupStore();
      const group = form.scope.lookupNode("repeating-group");
      assertGroupListStore(group);
      expect(group.canRemove).toBe(true);
    });
  });

  describe("repeating questions", () => {
    it("permits adding more answers while below maxOccurs", () => {
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

      const form = new FormStore(
        questionnaireMissingAnswers,
        responseMissingAnswers,
      );
      const question = form.scope.lookupNode("repeating-question");
      assertQuestionNode(question);
      expect(question.canAdd).toBe(true);
    });

    const questionnaireAtMax: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "repeating-question",
          text: "Top priorities",
          type: "string",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(2)],
        },
      ],
    };

    const responseAtMax: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "repeating-question",
          answer: [{ valueString: "Stability" }, { valueString: "Speed" }],
        },
      ],
    };

    const createAtMaxStore = () =>
      new FormStore(questionnaireAtMax, responseAtMax);

    it("prevents adding new answers beyond maxOccurs", () => {
      const form = createAtMaxStore();
      const question = form.scope.lookupNode("repeating-question");
      expect(question && isQuestionNode(question)).toBe(true);
      assertQuestionNode(question);
      expect(question.answers).toHaveLength(2);
      expect(question.canAdd).toBe(false);
    });

    it("permits removing when above minOccurs", () => {
      const form = createAtMaxStore();
      const question = form.scope.lookupNode("repeating-question");
      assertQuestionNode(question);
      expect(question.canRemove).toBe(true);
    });
  });
});
