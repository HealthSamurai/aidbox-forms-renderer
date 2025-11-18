import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import { isQuestionNode } from "../nodes/questions/question-store.ts";
import { isGroupNode } from "../nodes/groups/group-store.ts";
import { makeCqfExpression, makeVariable } from "./expression-fixtures.ts";

describe("fhirpath metadata", () => {
  it("attaches hidden __path__ metadata to expression snapshot items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          text: "Group",
          item: [
            {
              linkId: "explain",
              type: "display",
              text: "Details",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const topItem = form.expressionResponse.item?.[0];
    expect(topItem).toBeDefined();
    if (!topItem) throw new Error("expected top-level item snapshot");

    const topDescriptor = Object.getOwnPropertyDescriptor(topItem, "__path__");
    expect(topDescriptor?.enumerable).toBe(false);
    const topMeta = (topItem as unknown as { __path__: { path: string } })[
      "__path__"
    ];
    expect(topMeta.path).toBe("QuestionnaireResponse.item");

    const childItem = topItem.item?.[0];
    expect(childItem).toBeDefined();
    if (!childItem) {
      throw new Error("expected nested item snapshot");
    }

    const childDescriptor = Object.getOwnPropertyDescriptor(
      childItem,
      "__path__",
    );
    expect(childDescriptor?.enumerable).toBe(false);
    const childMeta = (childItem as unknown as { __path__: { path: string } })[
      "__path__"
    ];
    expect(childMeta.path).toBe("QuestionnaireResponse.item");
  });
});

describe("dynamic item expressions", () => {
  describe("label expressions", () => {
    it("renders dynamic labels using expressions on _text", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "latestName",
                "%context.item.where(linkId='name').answer.valueString.last()",
              ),
            ],
            item: [
              {
                linkId: "name",
                text: "Respondent name",
                type: "string",
              },
              {
                linkId: "greeting",
                text: "Hello guest",
                _text: {
                  extension: [
                    makeCqfExpression(
                      "iif(%latestName.exists(), 'Hello ' & %latestName, 'Hello guest')",
                    ),
                  ],
                },
                type: "string",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const name = form.scope.lookupNode("name");
      const greeting = form.scope.lookupNode("greeting");

      if (!isQuestionNode(name) || !isQuestionNode(greeting)) {
        throw new Error("Expected question stores for name and greeting");
      }

      expect(greeting.text).toBe("Hello guest");

      name.setAnswer(0, "Ada");
      expect(greeting.text).toBe("Hello Ada");

      name.setAnswer(0, "Lin");
      expect(greeting.text).toBe("Hello Lin");
    });

    it("records issues when _text expressions reference unavailable data", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "detail",
            text: "Static label",
            type: "string",
            _text: {
              extension: [makeCqfExpression("%missingLabel")],
            },
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const detail = form.scope.lookupNode("detail");

      if (!isQuestionNode(detail)) {
        throw new Error("Expected question store for detail");
      }

      // Trigger evaluation so the slot captures the failure.
      void detail.text;

      const slot = detail.expressionRegistry.text;
      expect(slot).toBeDefined();
      expect(slot?.error?.diagnostics).toContain(
        "Failed to evaluate text expression",
      );
      expect(slot?.error?.diagnostics).toContain(
        "because it references unavailable data",
      );
    });
  });

  describe("readOnly expressions", () => {
    it("toggles question interactivity based on expressions on _readOnly", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "lockFlag",
                "%context.item.where(linkId='lock').answer.valueBoolean.last()",
              ),
            ],
            item: [
              {
                linkId: "lock",
                text: "Lock answers?",
                type: "boolean",
              },
              {
                linkId: "detail",
                text: "Details",
                type: "string",
                _readOnly: {
                  extension: [makeCqfExpression("%lockFlag")],
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const lock = form.scope.lookupNode("lock");
      const detail = form.scope.lookupNode("detail");

      if (!isQuestionNode(lock) || !isQuestionNode(detail)) {
        throw new Error("Expected question stores for lock and detail");
      }

      expect(detail.readOnly).toBe(false);
      expect(detail.expressionRegistry.readOnly).toBeDefined();
      expect(detail.expressionRegistry.readOnly?.error).toBeUndefined();

      lock.setAnswer(0, true);
      expect(detail.readOnly).toBe(true);
      expect(detail.expressionRegistry.readOnly?.error).toBeUndefined();

      lock.setAnswer(0, false);
      expect(detail.readOnly).toBe(false);
    });

    it("cascades computed group readOnly state to descendants", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "section",
            type: "group",
            extension: [
              makeVariable(
                "lockFlag",
                "%context.item.where(linkId='lock').answer.valueBoolean.last()",
              ),
            ],
            _readOnly: {
              extension: [makeCqfExpression("%lockFlag")],
            },
            item: [
              {
                linkId: "lock",
                text: "Lock section?",
                type: "boolean",
              },
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
      const section = form.scope.lookupNode("section");
      const lock = form.scope.lookupNode("lock");
      const child = form.scope.lookupNode("child");

      if (
        !isGroupNode(section) ||
        !isQuestionNode(lock) ||
        !isQuestionNode(child)
      ) {
        throw new Error("Expected group and question stores");
      }

      expect(section.readOnly).toBe(false);
      expect(child.readOnly).toBe(false);

      lock.setAnswer(0, true);
      expect(section.readOnly).toBe(true);
      expect(child.readOnly).toBe(true);

      lock.setAnswer(0, false);
      expect(section.readOnly).toBe(false);
      expect(child.readOnly).toBe(false);
    });

    it("keeps nodes interactive when _readOnly expressions fail", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "detail",
            text: "Detail",
            type: "string",
            _readOnly: {
              extension: [makeCqfExpression("%missingFlag")],
            },
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const detail = form.scope.lookupNode("detail");

      if (!isQuestionNode(detail)) {
        throw new Error("Expected detail question store");
      }

      expect(detail.readOnly).toBe(false);

      const slot = detail.expressionRegistry.readOnly;
      expect(slot).toBeDefined();
      expect(slot?.error?.diagnostics).toContain(
        "Failed to evaluate read-only expression",
      );
      expect(slot?.error?.diagnostics).toContain(
        "because it references unavailable data",
      );
    });
  });

  describe("repeats expressions", () => {
    it("switches question cardinality when expressions are attached to _repeats", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "allowMultiple",
                "%context.item.where(linkId='allow').answer.valueBoolean.last()",
              ),
            ],
            item: [
              {
                linkId: "allow",
                text: "Allow multiple?",
                type: "boolean",
              },
              {
                linkId: "favorite",
                text: "Favorite color",
                type: "string",
                _repeats: {
                  extension: [makeCqfExpression("%allowMultiple")],
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const allow = form.scope.lookupNode("allow");
      const favorite = form.scope.lookupNode("favorite");

      if (!isQuestionNode(allow) || !isQuestionNode(favorite)) {
        throw new Error("Expected question stores for allow and favorite");
      }

      expect(favorite.expressionRegistry.repeats).toBeDefined();
      expect(favorite.expressionRegistry.repeats?.error).toBeUndefined();
      expect(favorite.repeats).toBe(false);
      expect(favorite.maxOccurs).toBe(1);
      expect(favorite.answers).toHaveLength(1);

      favorite.setAnswer(0, "Blue");

      allow.setAnswer(0, true);
      expect(favorite.expressionRegistry.repeats?.error).toBeUndefined();
      expect(favorite.repeats).toBe(true);
      expect(favorite.maxOccurs).toBe(Number.POSITIVE_INFINITY);

      favorite.addAnswer("Green");
      expect(favorite.answers).toHaveLength(2);

      allow.setAnswer(0, false);
      expect(favorite.repeats).toBe(false);
      expect(favorite.maxOccurs).toBe(1);

      const beforeAdd = favorite.answers.length;
      favorite.addAnswer("Red");
      expect(favorite.answers.length).toBe(beforeAdd);

      const response = favorite.responseItems;
      expect(response).toHaveLength(1);
      expect(response[0]?.answer).toHaveLength(1);
      expect(response[0]?.answer?.[0]?.valueString).toBe("Blue");
    });

    it("reports errors when _repeats expressions fail and keeps single-answer behavior", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "item",
            text: "Item",
            type: "string",
            _repeats: {
              extension: [makeCqfExpression("%missingFlag")],
            },
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const item = form.scope.lookupNode("item");

      if (!isQuestionNode(item)) {
        throw new Error("Expected item question store");
      }

      expect(item.repeats).toBe(false);

      const before = item.answers.length;
      item.addAnswer("extra");
      expect(item.answers.length).toBe(before);

      const slot = item.expressionRegistry.repeats;
      expect(slot).toBeDefined();
      expect(slot?.error?.diagnostics).toContain(
        "Failed to evaluate repeats expression",
      );
      expect(slot?.error?.diagnostics).toContain(
        "because it references unavailable data",
      );
    });
  });
});
