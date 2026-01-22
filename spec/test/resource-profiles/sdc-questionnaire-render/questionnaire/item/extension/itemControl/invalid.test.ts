import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT, ITEM_CONTROL_SYSTEM } from "@formbox/renderer/utilities.ts";

describe("itemControl invalid configurations", () => {
  it("ignores itemControl extensions with an unexpected code system", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "color",
          text: "Favorite color",
          type: "string",
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: "http://example.com/controls",
                    code: "radio-button",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("color");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) {
      throw new Error("Expected question node");
    }

    expect(node.control).toBeUndefined();
  });

  it("ignores group-only controls on question items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "question",
          text: "Question",
          type: "string",
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "header",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("question");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) {
      throw new Error("Expected question node");
    }

    expect(node.control).toBeUndefined();
  });

  it("ignores question controls on group items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "section",
          text: "Section",
          type: "group",
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "radio-button",
                  },
                ],
              },
            },
          ],
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
    const node = form.scope.lookupNode("section");
    expect(node && isGroupNode(node)).toBe(true);
    if (!node || !isGroupNode(node)) {
      throw new Error("Expected group node");
    }

    expect(node.control).toBeUndefined();
  });
});
