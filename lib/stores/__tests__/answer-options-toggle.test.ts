import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireItemAnswerOption } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { isQuestionNode } from "../question-store.ts";
import { makeAnswerOptionToggle, makeVariable } from "./expression-fixtures.ts";

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

    if (
      !toggle ||
      !isQuestionNode(toggle) ||
      !color ||
      !isQuestionNode(color)
    ) {
      throw new Error("Expected toggle and color question nodes");
    }

    const [redOption, greenOption] = color.answerOptions;

    expect(color.isAnswerOptionEnabled(redOption)).toBe(false);
    expect(color.isAnswerOptionEnabled(greenOption)).toBe(true);

    toggle.setAnswer(0, true);
    expect(color.isAnswerOptionEnabled(redOption)).toBe(true);

    toggle.setAnswer(0, false);
    expect(color.isAnswerOptionEnabled(redOption)).toBe(false);
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

    if (!color || !isQuestionNode(color)) {
      throw new Error("Expected color question node");
    }

    const [redOption, greenOption] = color.answerOptions;

    expect(color.isAnswerOptionEnabled(redOption)).toBe(true);
    expect(color.isAnswerOptionEnabled(greenOption)).toBe(true);
  });
});
