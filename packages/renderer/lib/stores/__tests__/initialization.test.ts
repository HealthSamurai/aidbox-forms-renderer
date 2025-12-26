import { describe, expect, it } from "vitest";

import type {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import {
  assertDisplayNode,
  isDisplayNode,
} from "../nodes/display/display-store.ts";
import {
  assertGroupWrapper,
  isGroupWrapper,
} from "../nodes/groups/group-wrapper.ts";
import { assertGroupNode, isGroupNode } from "../nodes/groups/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "../nodes/questions/question-store.ts";
import { makeInitialExpression } from "./expression-fixtures.ts";
import { assertDefined } from "../../utils.ts";

const minOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  valueInteger: value,
});

const maxOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  valueInteger: value,
});

describe("initialization", () => {
  describe("node indexing", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        { linkId: "intro", text: "Welcome", type: "display" },
        {
          linkId: "section",
          text: "Section",
          type: "group",
          item: [
            {
              linkId: "section-question",
              text: "Name",
              type: "string",
            },
          ],
        },
        { linkId: "standalone-question", text: "Ready?", type: "boolean" },
      ],
    };

    const createStore = () => new FormStore(questionnaire);

    it("creates node stores for each top-level item", () => {
      const form = createStore();
      expect(form.nodes).toHaveLength(3);
    });

    it("indexes linkIds for top-level and nested items", () => {
      const form = createStore();
      const expectedIds = [
        "intro",
        "section",
        "section-question",
        "standalone-question",
      ];
      expectedIds.forEach((linkId) => {
        expect(form.scope.lookupNode(linkId)).toBeDefined();
      });
    });
  });

  describe("display nodes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "intro", text: "Welcome", type: "display" }],
    };

    const createStore = () => new FormStore(questionnaire);

    it("creates a display store for the questionnaire item", () => {
      const form = createStore();
      const introStore = form.scope.lookupNode("intro");
      assertDisplayNode(introStore);
      expect(isDisplayNode(introStore)).toBe(true);
    });

    it("preserves the path key for the display store", () => {
      const form = createStore();
      const introStore = form.scope.lookupNode("intro");
      assertDisplayNode(introStore);
      expect(introStore.token).toBe("_/_intro");
    });
  });

  describe("support display children", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "lab-value",
          text: "Lab value",
          type: "integer",
          item: [
            {
              linkId: "lab-value-unit",
              text: "mg/dL",
              type: "display",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system:
                          "http://hl7.org/fhir/questionnaire-item-control",
                        code: "unit",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          linkId: "visit-notes",
          text: "Visit notes",
          type: "string",
          item: [
            {
              linkId: "visit-notes-help",
              text: "Summarize key observations from the encounter.",
              type: "display",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system:
                          "http://hl7.org/fhir/questionnaire-item-control",
                        code: "help",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);

    it("applies unit support display without creating child nodes", () => {
      const node = form.scope.lookupNode("lab-value");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);
      expect(node.unitDisplay).toBe("mg/dL");
      expect(node.answers.at(0)?.nodes).toHaveLength(0);
    });

    it("applies help support display without creating child nodes", () => {
      const node = form.scope.lookupNode("visit-notes");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);
      expect(node.help).toBe("Summarize key observations from the encounter.");
      expect(node.answers.at(0)?.nodes).toHaveLength(0);
    });
  });

  describe("non-repeating groups", () => {
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

    it("creates a group store with child nodes", () => {
      const singleGroupStore = getGroupStore();
      expect(isGroupNode(singleGroupStore)).toBe(true);
      assertGroupNode(singleGroupStore);
      expect(singleGroupStore.nodes).toHaveLength(2);
    });

    it("hydrates question answers within the group", () => {
      const singleGroupStore = getGroupStore();
      assertGroupNode(singleGroupStore);
      const groupQuestion = singleGroupStore.nodes.at(0);
      expect(groupQuestion?.token).toBe("_/_single-group_/_group-question");
      expect(groupQuestion && isQuestionNode(groupQuestion)).toBe(true);
      assertQuestionNode(groupQuestion);
      expect(groupQuestion.answers).toHaveLength(1);
      expect(groupQuestion.answers.at(0)?.value).toBe("Inside group");
    });

    it("retains display child content inside the group", () => {
      const singleGroupStore = getGroupStore();
      assertGroupNode(singleGroupStore);
      const groupNote = singleGroupStore.nodes.at(1);
      expect(groupNote && isDisplayNode(groupNote)).toBe(true);
      expect(groupNote?.token).toBe("_/_single-group_/_group-note");
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

      it("still materializes child nodes from the template", () => {
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
        expect(question.answers.at(0)?.value).toBeNull();
      });
    });
  });

  describe("repeating groups", () => {
    it("stays enabled even when its nodes are disabled", () => {
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
      const wrapper = form.scope.lookupNode("repeating-group");
      const toggle = form.scope.lookupNode("toggle");

      assertGroupWrapper(wrapper);
      assertQuestionNode(toggle);

      wrapper.addNode();
      const node = wrapper.nodes.at(0);
      assertGroupNode(node);

      expect(wrapper.isEnabled).toBe(true);
      expect(node.isEnabled).toBe(false);

      const toggleAnswer = toggle.answers[0];
      assertDefined(toggleAnswer);
      toggleAnswer.setValueByUser(true);

      expect(wrapper.isEnabled).toBe(true);
      expect(node.isEnabled).toBe(true);

      toggleAnswer.setValueByUser(false);

      expect(wrapper.isEnabled).toBe(true);
      expect(node.isEnabled).toBe(false);
    });

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

    const getGroupWrapper = () => {
      const form = createStore();
      const group = form.scope.lookupNode("repeating-group");
      assertGroupWrapper(group);
      return group;
    };

    it("creates one node per response item", () => {
      const groupWrapper = getGroupWrapper();
      expect(isGroupWrapper(groupWrapper)).toBe(true);
      assertGroupWrapper(groupWrapper);
      expect(groupWrapper.nodes).toHaveLength(2);
      expect(groupWrapper.nodes.at(0)?.nodes).toHaveLength(1);
      expect(groupWrapper.nodes.at(1)?.nodes).toHaveLength(1);
    });

    it("respects add/remove guards based on cardinality", () => {
      const groupWrapper = getGroupWrapper();
      assertGroupWrapper(groupWrapper);
      expect(groupWrapper.canAdd).toBe(true);
      expect(groupWrapper.canRemove).toBe(true);
    });

    it("hydrates repeating child question answers", () => {
      const groupWrapper = getGroupWrapper();
      assertGroupWrapper(groupWrapper);
      const [firstNode, secondNode] = groupWrapper.nodes;
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
      const groupWrapper = getGroupWrapper();
      assertGroupWrapper(groupWrapper);
      const childPaths = groupWrapper.nodes
        .map((node) => node.nodes.at(0)?.token)
        .filter((path): path is string => !!path);
      expect(childPaths).toHaveLength(2);
      childPaths.forEach((path) => {
        expect(path).toMatch(/^_\/_repeating-group_\/_\d+_\/_repeat-question$/);
      });
      expect(new Set(childPaths).size).toBe(childPaths.length);
    });

    it("indexes repeated children inside the node scope", () => {
      const form = createStore();
      expect(form.scope.lookupNode("repeat-question")).toBeUndefined();
      const group = form.scope.lookupNode("repeating-group");
      expect(group && isGroupWrapper(group)).toBe(true);
      assertGroupWrapper(group);
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

    describe("when response omits items", () => {
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

      const getEmptyGroupWrapper = () => {
        const form = createEmptyGroupStore();
        const group = form.scope.lookupNode("repeating-group");
        assertGroupWrapper(group);
        return group;
      };

      it("seeds the minimum number of empty nodes", () => {
        const group = getEmptyGroupWrapper();
        expect(isGroupWrapper(group)).toBe(true);
        assertGroupWrapper(group);
        expect(group.nodes).toHaveLength(2);
        expect(group.nodes.every((node) => node.nodes.length === 1)).toBe(true);
        const firstQuestion = group.nodes.at(0)?.nodes.at(0);
        expect(firstQuestion && isQuestionNode(firstQuestion)).toBe(true);
        if (firstQuestion && isQuestionNode(firstQuestion)) {
          expect(firstQuestion.answers).toHaveLength(1);
          expect(firstQuestion.answers.at(0)?.value).toBeNull();
        }
      });

      it("disallows removing below the minimum", () => {
        const group = getEmptyGroupWrapper();
        assertGroupWrapper(group);
        expect(group.canRemove).toBe(false);
      });

      it("still allows adding until reaching maxOccurs", () => {
        const group = getEmptyGroupWrapper();
        assertGroupWrapper(group);
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
        expect(group && isGroupWrapper(group)).toBe(true);
        assertGroupWrapper(group);
        expect(group.nodes).toHaveLength(2);
        expect(group.canAdd).toBe(false);
      });

      it("allows removing because above the minimum", () => {
        const form = createMaxGroupStore();
        const group = form.scope.lookupNode("repeating-group");
        assertGroupWrapper(group);
        expect(group.canRemove).toBe(true);
      });
    });
  });

  describe("single questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "single-question",
          text: "Do you agree?",
          type: "boolean",
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "single-question",
          answer: [{ valueBoolean: true }],
        },
      ],
    };

    const createStore = () => new FormStore(questionnaire, response);

    const getQuestionStore = () => {
      const form = createStore();
      const question = form.scope.lookupNode("single-question");
      assertQuestionNode(question);
      return question;
    };

    it("creates a question store for the questionnaire item", () => {
      const singleQuestionStore = getQuestionStore();
      expect(isQuestionNode(singleQuestionStore)).toBe(true);
    });

    it("hydrates a single answer from the response", () => {
      const singleQuestionStore = getQuestionStore();
      assertQuestionNode(singleQuestionStore);
      expect(singleQuestionStore.answers).toHaveLength(1);
      expect(singleQuestionStore.answers.at(0)?.value).toBe(true);
    });

    describe("when response omits the answer", () => {
      const questionnaireMissingAnswer: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "single-question",
            text: "Required field",
            type: "string",
            required: true,
          },
        ],
      };

      const responseMissingAnswer: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
      };

      const createMissingAnswerStore = () =>
        new FormStore(questionnaireMissingAnswer, responseMissingAnswer);

      it("ensures a placeholder answer exists", () => {
        const form = createMissingAnswerStore();
        const question = form.scope.lookupNode("single-question");
        expect(question && isQuestionNode(question)).toBe(true);
        assertQuestionNode(question);
        expect(question.answers).toHaveLength(1);
        expect(question.answers.at(0)?.value).toBeNull();
      });

      it("prevents removal when at minimum occurrences", () => {
        const form = createMissingAnswerStore();
        const question = form.scope.lookupNode("single-question");
        assertQuestionNode(question);
        expect(question.canRemove).toBe(false);
      });
    });
  });

  describe("answer value extraction", () => {
    const scenarios: Array<{
      title: string;
      linkId: string;
      type: QuestionnaireItem["type"];
      answer: QuestionnaireResponseItemAnswer;
      expected: unknown;
    }> = [
      {
        title: "decimal question",
        linkId: "decimal-question",
        type: "decimal",
        answer: { valueDecimal: 3.14 },
        expected: 3.14,
      },
      {
        title: "dateTime question",
        linkId: "datetime-question",
        type: "dateTime",
        answer: { valueDateTime: "2024-05-04T12:30:00Z" },
        expected: "2024-05-04T12:30:00Z",
      },
      {
        title: "time question",
        linkId: "time-question",
        type: "time",
        answer: { valueTime: "08:15:30" },
        expected: "08:15:30",
      },
      {
        title: "url question",
        linkId: "url-question",
        type: "url",
        answer: { valueUri: "https://example.org" },
        expected: "https://example.org",
      },
      {
        title: "coding question",
        linkId: "coding-question",
        type: "coding",
        answer: {
          valueCoding: { system: "http://loinc.org", code: "1234-5" },
        },
        expected: { system: "http://loinc.org", code: "1234-5" },
      },
      {
        title: "quantity question",
        linkId: "quantity-question",
        type: "quantity",
        answer: {
          valueQuantity: { value: 120, unit: "mmHg" },
        },
        expected: { value: 120, unit: "mmHg" },
      },
      {
        title: "reference question",
        linkId: "reference-question",
        type: "reference",
        answer: {
          valueReference: { reference: "Patient/123", display: "Alice" },
        },
        expected: { reference: "Patient/123", display: "Alice" },
      },
      {
        title: "attachment question",
        linkId: "attachment-question",
        type: "attachment",
        answer: {
          valueAttachment: { url: "https://example.org/file.pdf" },
        },
        expected: { url: "https://example.org/file.pdf" },
      },
    ];

    scenarios.forEach(({ title, linkId, type, answer, expected }) => {
      it(`hydrates ${title}`, () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId,
              text: "Target",
              type,
            },
          ],
        };

        const response: QuestionnaireResponse = {
          resourceType: "QuestionnaireResponse",
          questionnaire: "#questionnaire",
          status: "completed",
          item: [
            {
              linkId,
              answer: [answer],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = form.scope.lookupNode(linkId);
        expect(question && isQuestionNode(question)).toBe(true);
        assertQuestionNode(question);
        expect(question.answers).toHaveLength(1);
        expect(question.answers.at(0)?.value).toEqual(expected);
      });
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

    describe("with nested child items", () => {
      const nestedQuestionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "repeating-question",
            text: "Provide attendees",
            type: "string",
            repeats: true,
            item: [
              {
                linkId: "follow-up",
                text: "Contact info",
                type: "text",
                required: true,
              },
            ],
          },
        ],
      };

      const nestedResponse: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "completed",
        item: [
          {
            linkId: "repeating-question",
            answer: [
              {
                valueString: "Alice",
                item: [
                  {
                    linkId: "follow-up",
                    answer: [{ valueString: "alice@example.org" }],
                  },
                ],
              },
              {
                valueString: "Bob",
              },
            ],
          },
        ],
      };

      const createNestedStore = () =>
        new FormStore(nestedQuestionnaire, nestedResponse);

      it("keeps child nodes scoped per answer instance", () => {
        const form = createNestedStore();
        expect(form.scope.lookupNode("follow-up")).toBeUndefined();
        const question = form.scope.lookupNode("repeating-question");
        expect(question && isQuestionNode(question)).toBe(true);
        assertQuestionNode(question);
        const [firstAnswer, secondAnswer] = question.answers;
        const scopedFirst = firstAnswer.scope.lookupNode("follow-up");
        const scopedSecond = secondAnswer.scope.lookupNode("follow-up");
        expect(scopedFirst && isQuestionNode(scopedFirst)).toBe(true);
        expect(scopedSecond && isQuestionNode(scopedSecond)).toBe(true);
        assertQuestionNode(scopedFirst);
        assertQuestionNode(scopedSecond);
        expect(scopedFirst.token).toMatch(
          /^_\/_repeating-question_\/_\d+_\/_follow-up$/,
        );
        expect(scopedFirst.token).not.toBe(scopedSecond.token);
        expect(scopedFirst.answers.at(0)?.value).toBe("alice@example.org");
        expect(scopedSecond.answers.at(0)?.value).toBeNull();
      });
    });
    describe("when response omits answers", () => {
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
        expect(question.answers.every((answer) => answer.value === null)).toBe(
          true,
        );
      });

      it("disallows removal until above the minimum", () => {
        const form = createMissingAnswersStore();
        const question = form.scope.lookupNode("repeating-question");
        assertQuestionNode(question);
        expect(question.canRemove).toBe(false);
      });

      it("permits adding more answers while below maxOccurs", () => {
        const form = createMissingAnswersStore();
        const question = form.scope.lookupNode("repeating-question");
        assertQuestionNode(question);
        expect(question.canAdd).toBe(true);
      });
    });

    describe("when response hits maxOccurs", () => {
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

      it("still permits removing when above minOccurs", () => {
        const form = createAtMaxStore();
        const question = form.scope.lookupNode("repeating-question");
        assertQuestionNode(question);
        expect(question.canRemove).toBe(true);
      });
    });
  });

  describe("nested child answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "parent-question",
          text: "Provide details",
          type: "string",
          item: [
            {
              linkId: "child-follow-up",
              text: "Additional confirmation",
              type: "boolean",
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
          linkId: "parent-question",
          answer: [
            {
              valueString: "Top level answer",
              item: [
                {
                  linkId: "child-follow-up",
                  answer: [{ valueBoolean: false }],
                },
              ],
            },
          ],
        },
      ],
    };

    const createStore = () => new FormStore(questionnaire, response);

    const getParentStore = () => {
      const form = createStore();
      const parent = form.scope.lookupNode("parent-question");
      assertQuestionNode(parent);
      return parent;
    };

    it("creates parent question answers with nested children arrays", () => {
      const parentQuestionStore = getParentStore();
      expect(isQuestionNode(parentQuestionStore)).toBe(true);
      assertQuestionNode(parentQuestionStore);
      expect(parentQuestionStore.answers).toHaveLength(1);
      const answer = parentQuestionStore.answers.at(0);
      expect(answer?.value).toBe("Top level answer");
      expect(answer?.nodes).toBeDefined();
    });

    it("assigns child stores with composed path keys", () => {
      const parentQuestionStore = getParentStore();
      assertQuestionNode(parentQuestionStore);
      const childStore = parentQuestionStore.answers.at(0)?.nodes?.at(0);
      expect(childStore?.token).toBe(
        "_/_parent-question_/_0_/_child-follow-up",
      );
    });

    it("hydrates nested child answers", () => {
      const parentQuestionStore = getParentStore();
      assertQuestionNode(parentQuestionStore);
      const childStore = parentQuestionStore.answers.at(0)?.nodes?.at(0);
      expect(childStore && isQuestionNode(childStore)).toBe(true);
      assertQuestionNode(childStore);
      expect(childStore.answers.at(0)?.value).toBe(false);
    });

    describe("when response omits the parent answer", () => {
      const questionnaireNoParentAnswer: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "parent-question",
            text: "Provide details",
            type: "string",
            item: [
              {
                linkId: "child-question",
                text: "Confirm",
                type: "boolean",
                required: true,
              },
            ],
          },
        ],
      };

      const responseNoParentAnswer: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
      };

      const createNoParentAnswerStore = () =>
        new FormStore(questionnaireNoParentAnswer, responseNoParentAnswer);

      it("creates a placeholder answer with nested children", () => {
        const form = createNoParentAnswerStore();
        const parent = form.scope.lookupNode("parent-question");
        expect(parent && isQuestionNode(parent)).toBe(true);
        assertQuestionNode(parent);
        expect(parent.answers).toHaveLength(1);
        const childStore = parent.answers.at(0)?.nodes?.at(0);
        expect(childStore && isQuestionNode(childStore)).toBe(true);
        assertQuestionNode(childStore);
        expect(childStore.answers).toHaveLength(1);
        expect(childStore.answers.at(0)?.value).toBeNull();
      });
    });

    describe("with deeper nested items", () => {
      const questionnaireDeepNesting: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "parent-question",
            text: "Root",
            type: "string",
            item: [
              {
                linkId: "child-group",
                text: "Child group",
                type: "group",
                item: [
                  {
                    linkId: "grandchild-question",
                    text: "Leaf response",
                    type: "boolean",
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      const responseDeepNesting: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "completed",
        item: [
          {
            linkId: "parent-question",
            answer: [
              {
                valueString: "Value",
                item: [
                  {
                    linkId: "child-group",
                    item: [
                      {
                        linkId: "grandchild-question",
                        answer: [{ valueBoolean: true }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const createDeepStore = () =>
        new FormStore(questionnaireDeepNesting, responseDeepNesting);

      it("creates node stores for each nested level", () => {
        const form = createDeepStore();
        const parent = form.scope.lookupNode("parent-question");
        expect(parent && isQuestionNode(parent)).toBe(true);
        assertQuestionNode(parent);
        const group = parent.answers.at(0)?.nodes?.at(0);
        expect(group && isGroupNode(group)).toBe(true);
        assertGroupNode(group);
        const grandchild = group.nodes.at(0);
        expect(grandchild?.token).toBe(
          "_/_parent-question_/_0_/_child-group_/_grandchild-question",
        );
      });

      it("hydrates the grandchild answer value", () => {
        const form = createDeepStore();
        const parent = form.scope.lookupNode("parent-question");
        assertQuestionNode(parent);
        const group = parent.answers.at(0)?.nodes?.at(0);
        assertGroupNode(group);
        const grandchild = group.nodes.at(0);
        expect(grandchild && isQuestionNode(grandchild)).toBe(true);
        assertQuestionNode(grandchild);
        expect(grandchild.answers.at(0)?.value).toBe(true);
      });
    });
  });

  describe("template initial values", () => {
    it("seeds non-repeating questions from questionnaire initial values", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "greeting",
            text: "Greeting",
            type: "string",
            initial: [{ valueString: "Hello" }],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const node = form.scope.lookupNode("greeting");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers).toHaveLength(1);
      expect(node.answers[0]?.value).toBe("Hello");
    });

    it("materializes multiple initial values for repeating questions", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "symptom",
            text: "Symptoms",
            type: "string",
            repeats: true,
            initial: [{ valueString: "Cough" }, { valueString: "Fever" }],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const node = form.scope.lookupNode("symptom");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers.map((answer) => answer.value)).toEqual([
        "Cough",
        "Fever",
      ]);
    });

    it("preserves response answers over questionnaire initial values", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "nickname",
            text: "Nickname",
            type: "string",
            initial: [{ valueString: "Buddy" }],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "completed",
        item: [
          {
            linkId: "nickname",
            answer: [{ valueString: "Captain" }],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const node = form.scope.lookupNode("nickname");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers).toHaveLength(1);
      expect(node.answers[0]?.value).toBe("Captain");
    });

    it("pads answers to minOccurs when template initials underfill", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "symptom",
            text: "Symptoms",
            type: "string",
            repeats: true,
            extension: [minOccurs(3)],
            initial: [{ valueString: "Cough" }, { valueString: "Fever" }],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const node = form.scope.lookupNode("symptom");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers.map((answer) => answer.value)).toEqual([
        "Cough",
        "Fever",
        null,
      ]);
      expect(node.canRemove).toBe(false);
    });

    it("respects maxOccurs when template overflows repeated answers", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "meds",
            text: "Medications",
            type: "string",
            repeats: true,
            extension: [maxOccurs(2)],
            initial: [
              { valueString: "Aspirin" },
              { valueString: "Ibuprofen" },
              { valueString: "Naproxen" },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const node = form.scope.lookupNode("meds");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers.map((answer) => answer.value)).toEqual([
        "Aspirin",
        "Ibuprofen",
      ]);
      expect(node.canAdd).toBe(false);
    });

    it("allows initialExpression to override template defaults", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "favorite",
            text: "Favorite color",
            type: "string",
            initial: [{ valueString: "Template" }],
            extension: [makeInitialExpression(undefined, "'Expression'")],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const node = form.scope.lookupNode("favorite");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers.at(0)?.value).toBe("Expression");
    });
  });

  describe("read-only questions", () => {
    it("prefers response answers while remaining immutable", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "readonly",
            text: "Readonly field",
            type: "string",
            readOnly: true,
            initial: [{ valueString: "Template" }],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "completed",
        item: [
          {
            linkId: "readonly",
            answer: [{ valueString: "Server value" }],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const node = form.scope.lookupNode("readonly");
      expect(node && isQuestionNode(node)).toBe(true);
      assertQuestionNode(node);

      expect(node.answers.at(0)?.value).toBe("Server value");
      expect(node.canAdd).toBe(false);
      expect(node.canRemove).toBe(false);
    });
  });
});
