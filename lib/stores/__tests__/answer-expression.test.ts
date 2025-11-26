import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import { assertQuestionNode } from "../nodes/questions/question-store.ts";
import { makeAnswerExpression, makeVariable } from "./expression-fixtures.ts";
import { assertDefined } from "../../utils.ts";

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

    expect(color.options.entries).toHaveLength(3);
    expect(
      color.options.entries.map((entry) => entry.option.valueString),
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

    expect(mirror.options.entries).toHaveLength(0);

    const sourceAnswer = source.answers[0];
    assertDefined(sourceAnswer);
    sourceAnswer.setValueByUser("Alpha");
    expect(slot?.value).toEqual(["Alpha"]);
    expect(
      mirror.options.entries.map((entry) => entry.option.valueString),
    ).toEqual(["Alpha"]);

    const updatedSourceAnswer = source.answers[0];
    assertDefined(updatedSourceAnswer);
    updatedSourceAnswer.setValueByUser("Beta");
    expect(slot?.value).toEqual(["Beta"]);
    expect(
      mirror.options.entries.map((entry) => entry.option.valueString),
    ).toEqual(["Beta"]);
  });
});
