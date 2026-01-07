import { describe, expect, it } from "vitest";
import type {
  Coding,
  Questionnaire,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import { assertQuestionNode } from "../nodes/questions/question-store.ts";
import { makeAnswerOptionToggle, makeVariable } from "./expression-fixtures.ts";
import { assertDefined } from "../../utils.ts";

const RED_CODING: QuestionnaireItemAnswerOption = {
  valueCoding: {
    system: "http://example.org/colors",
    code: "red",
    display: "Red",
  },
};

const GREEN_CODING: QuestionnaireItemAnswerOption = {
  valueCoding: {
    system: "http://example.org/colors",
    code: "green",
    display: "Green",
  },
};

describe("answerOptionsToggleExpression", () => {
  it("disables referenced options until the toggle expression evaluates true", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "toggleValue",
              "%context.item.where(linkId='toggle').answer.valueBoolean",
            ),
          ],
          item: [
            {
              linkId: "toggle",
              type: "boolean",
              text: "Enable red answer option",
            },
            {
              linkId: "color",
              type: "coding",
              text: "Favorite color",
              answerOption: [
                structuredClone(RED_CODING),
                structuredClone(GREEN_CODING),
              ],
              extension: [
                makeAnswerOptionToggle(
                  structuredClone(RED_CODING),
                  "%toggleValue",
                ),
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const toggle = form.scope.lookupNode("toggle");
    const color = form.scope.lookupNode("color");

    assertQuestionNode(toggle);
    assertQuestionNode(color);

    const getEntry = (code: string) =>
      color.answerOption.inherentOptions.find((entry) => {
        const coding = entry.value as Coding | null;
        return coding?.code === code;
      });

    expect(getEntry("red")?.disabled).toBe(true);
    expect(getEntry("green")?.disabled).toBe(false);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);
    expect(getEntry("red")?.disabled).toBe(false);

    toggleAnswer.setValueByUser(false);
    expect(getEntry("red")?.disabled).toBe(true);
  });

  it("treats multiple toggle expressions for the same option as logical OR", () => {
    const redStringOption: QuestionnaireItemAnswerOption = {
      valueString: "Red",
    };

    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "color",
          type: "string",
          text: "Preferred color",
          answerOption: [
            structuredClone(redStringOption),
            { valueString: "Green" },
          ],
          extension: [
            makeAnswerOptionToggle(
              structuredClone(redStringOption),
              "false",
              "alwaysFalse",
            ),
            makeAnswerOptionToggle(
              structuredClone(redStringOption),
              "true",
              "alwaysTrue",
            ),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const color = form.scope.lookupNode("color");

    assertQuestionNode(color);

    const getEntry = (value: string) =>
      color.answerOption.inherentOptions.find((entry) => entry.value === value);

    expect(getEntry("Red")?.disabled).toBe(false);
    expect(getEntry("Green")?.disabled).toBe(false);
  });
});
