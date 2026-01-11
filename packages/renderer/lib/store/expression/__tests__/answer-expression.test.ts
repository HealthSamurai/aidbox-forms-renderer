import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../form/form-store.ts";
import { assertQuestionNode } from "../../question/question-store.ts";
import {
  makeAnswerExpression,
  makeVariable,
} from "../../../__tests__/utilities.ts";
import { assertDefined } from "../../../utilities.ts";

describe("answerExpression", () => {
  it("builds answer options from expression output", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "color",
          text: "Preferred color",
          type: "string",
          extension: [makeAnswerExpression("('Red' | 'Green' | 'Blue')")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const color = form.scope.lookupNode("color");

    assertQuestionNode(color);

    const slot = color.expressionRegistry.answer;
    expect(slot).toBeDefined();
    expect(slot?.error).toBeUndefined();
    expect(slot?.value).toEqual(["Red", "Green", "Blue"]);

    expect(color.answerOption.inherentOptions).toHaveLength(3);
    expect(
      color.answerOption.inherentOptions.map((entry) => entry.value),
    ).toEqual(["Red", "Green", "Blue"]);
  });

  it("reacts when referenced answers change", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "sourceValues",
              "%context.item.where(linkId='source').answer.valueString",
            ),
          ],
          item: [
            {
              linkId: "source",
              text: "Source value",
              type: "string",
            },
            {
              linkId: "mirror",
              text: "Mirror",
              type: "string",
              extension: [makeAnswerExpression("%sourceValues")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const source = form.scope.lookupNode("source");
    const mirror = form.scope.lookupNode("mirror");

    assertQuestionNode(source);
    assertQuestionNode(mirror);

    const slot = mirror.expressionRegistry.answer;
    expect(slot).toBeDefined();
    expect(slot?.error).toBeUndefined();
    expect(slot?.value).toEqual([]);

    expect(mirror.answerOption.inherentOptions).toHaveLength(0);

    const sourceAnswer = source.answers[0];
    assertDefined(sourceAnswer);
    sourceAnswer.setValueByUser("Alpha");
    expect(slot?.value).toEqual(["Alpha"]);
    expect(
      mirror.answerOption.inherentOptions.map((entry) => entry.value),
    ).toEqual(["Alpha"]);

    const updatedSourceAnswer = source.answers[0];
    assertDefined(updatedSourceAnswer);
    updatedSourceAnswer.setValueByUser("Beta");
    expect(slot?.value).toEqual(["Beta"]);
    expect(
      mirror.answerOption.inherentOptions.map((entry) => entry.value),
    ).toEqual(["Beta"]);
  });
});
