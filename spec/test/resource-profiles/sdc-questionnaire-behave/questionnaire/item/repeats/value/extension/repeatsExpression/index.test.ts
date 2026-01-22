import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCqfExpression,
  makeVariable,
} from "../../../../../../../../utilities.ts";

describe("repeatsExpression", () => {
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

    assertQuestionNode(allow);
    assertQuestionNode(favorite);

    expect(favorite.expressionRegistry.repeats).toBeDefined();
    expect(favorite.expressionRegistry.repeats?.error).toBeUndefined();
    expect(favorite.repeats).toBe(false);
    expect(favorite.maxOccurs).toBe(1);
    expect(favorite.answers).toHaveLength(1);

    const favoriteAnswer = favorite.answers[0];
    assertDefined(favoriteAnswer);
    favoriteAnswer.setValueByUser("Blue");

    const allowAnswer = allow.answers[0];
    assertDefined(allowAnswer);
    allowAnswer.setValueByUser(true);
    expect(favorite.expressionRegistry.repeats?.error).toBeUndefined();
    expect(favorite.repeats).toBe(true);
    expect(favorite.maxOccurs).toBe(Number.POSITIVE_INFINITY);

    favorite.addAnswer("Green");
    expect(favorite.answers).toHaveLength(2);

    allowAnswer.setValueByUser(false);
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

    assertQuestionNode(item);

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
