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
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("item.answer.item", () => {
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

    it("creates parent answers with nested children arrays", () => {
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
      expect(childStore?.token).toBe("__parent-question__0__child-follow-up");
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
        expect(childStore.answers.at(0)?.value).toBeUndefined();
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
          "__parent-question__0__child-group__grandchild-question",
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

  it("scopes child nodes per repeating answer instance", () => {
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

    const form = new FormStore(nestedQuestionnaire, nestedResponse);
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
    expect(scopedFirst.token).toMatch(/^__repeating-question__\d+__follow-up$/);
    expect(scopedFirst.token).not.toBe(scopedSecond.token);
    expect(scopedFirst.answers.at(0)?.value).toBe("alice@example.org");
    expect(scopedSecond.answers.at(0)?.value).toBeUndefined();
  });

  it("serializes child items on an answer even when the primitive value is absent", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/follow-up",
      status: "active",
      item: [
        {
          linkId: "follow-up",
          text: "Provide follow-up detail",
          type: "string",
          item: [
            {
              linkId: "detail",
              text: "Detail",
              type: "text",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("follow-up");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const answer = question.answers.at(0);
    expect(answer).toBeDefined();
    assertDefined(answer);

    const child = answer.nodes.find((child) => child.linkId === "detail");
    expect(child && isQuestionNode(child)).toBe(true);
    assertQuestionNode(child);

    const detailAnswer = child.answers[0];
    assertDefined(detailAnswer);
    detailAnswer.setValueByUser("Allergies reviewed and no issues noted.");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/follow-up",
      item: [
        {
          linkId: "follow-up",
          text: "Provide follow-up detail",
          answer: [
            {
              item: [
                {
                  linkId: "detail",
                  text: "Detail",
                  answer: [
                    {
                      valueString: "Allergies reviewed and no issues noted.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
