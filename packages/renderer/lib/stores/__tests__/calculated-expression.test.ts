import { describe, expect, it } from "vitest";
import { runInAction } from "mobx";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import {
  makeCalculatedExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import { assertQuestionNode } from "../nodes/questions/question-store.ts";
import { assertDefined } from "../../utilities.ts";

const bmiQuestionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  status: "active",
  item: [
    {
      linkId: "metrics",
      type: "group",
      extension: [
        makeVariable(
          "heightValue",
          "%context.item.where(linkId='height').answer.valueDecimal.last()",
        ),
        makeVariable(
          "weightValue",
          "%context.item.where(linkId='weight').answer.valueDecimal.last()",
        ),
      ],
      item: [
        {
          linkId: "height",
          type: "decimal",
        },
        {
          linkId: "weight",
          type: "decimal",
        },
        {
          linkId: "bmi",
          type: "decimal",
          extension: [
            makeCalculatedExpression(
              "bmiCalc",
              "%weightValue / ((%heightValue / 100) * (%heightValue / 100))",
            ),
          ],
        },
      ],
    },
  ],
};

describe("calculatedExpression", () => {
  it("updates until user override", () => {
    const form = new FormStore(bmiQuestionnaire);
    const heightStore = form.scope.lookupNode("height");
    const weightStore = form.scope.lookupNode("weight");
    const bmiStore = form.scope.lookupNode("bmi");

    assertQuestionNode(heightStore);
    assertQuestionNode(weightStore);
    assertQuestionNode(bmiStore);

    const height = heightStore;
    const weight = weightStore;
    const bmi = bmiStore;

    const heightAnswer = height.answers[0];
    assertDefined(heightAnswer);
    heightAnswer.setValueByUser(180);

    const weightAnswer = weight.answers[0];
    assertDefined(weightAnswer);
    weightAnswer.setValueByUser(80);
    expect(bmi.answers[0]?.value).toBeCloseTo(24.69, 2);

    const bmiAnswer = bmi.answers[0];
    assertDefined(bmiAnswer);
    bmiAnswer.setValueByUser(999);

    const weightUpdateAnswer = weight.answers[0];
    assertDefined(weightUpdateAnswer);
    weightUpdateAnswer.setValueByUser(90);
    expect(bmi.answers[0]?.value).toBe(999);
  });

  it("preserves existing answers when initial response differs", () => {
    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/bmi",
      status: "completed",
      item: [
        {
          linkId: "metrics",
          item: [
            { linkId: "height", answer: [{ valueDecimal: 175 }] },
            { linkId: "weight", answer: [{ valueDecimal: 70 }] },
            { linkId: "bmi", answer: [{ valueDecimal: 42 }] },
          ],
        },
      ],
    };

    const form = new FormStore(bmiQuestionnaire, response);
    const heightStore = form.scope.lookupNode("height");
    const weightStore = form.scope.lookupNode("weight");
    const bmiStore = form.scope.lookupNode("bmi");

    assertQuestionNode(heightStore);
    assertQuestionNode(weightStore);
    assertQuestionNode(bmiStore);

    const height = heightStore;
    const weight = weightStore;
    const bmi = bmiStore;

    expect(bmi.answers[0]?.value).toBe(42);

    const heightAnswer = height.answers[0];
    assertDefined(heightAnswer);
    heightAnswer.setValueByUser(180);

    const weightAnswer = weight.answers[0];
    assertDefined(weightAnswer);
    weightAnswer.setValueByUser(90);

    expect(bmi.answers[0]?.value).toBe(42);
  });

  it("identifies circular dependencies", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "loop",
          type: "group",
          extension: [
            makeVariable(
              "aAnswer",
              "%context.item.where(linkId='a').answer.valueDecimal.last()",
            ),
            makeVariable(
              "bAnswer",
              "%context.item.where(linkId='b').answer.valueDecimal.last()",
            ),
          ],
          item: [
            {
              linkId: "a",
              type: "decimal",
              extension: [makeCalculatedExpression(undefined, "%bAnswer + 1")],
            },
            {
              linkId: "b",
              type: "decimal",
              extension: [makeCalculatedExpression(undefined, "%aAnswer + 1")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const aStore = form.scope.lookupNode("a");
    const bStore = form.scope.lookupNode("b");

    assertQuestionNode(aStore);
    assertQuestionNode(bStore);

    const a = aStore;
    const b = bStore;

    runInAction(() => {
      // Seed as system writes (not user) so lifecycle stays non-manual and the
      // calculated-expression cycle detector can flag the loop.
      a.answers[0].setValueBySystem(0);
      b.answers[0].setValueBySystem(0);
    });

    expect(a.issues.some((issue) => issue.code === "business-rule")).toBe(true);
    expect(b.issues.some((issue) => issue.code === "business-rule")).toBe(true);
  });

  it("supports repeating-question multi-value results", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "multi",
          type: "string",
          repeats: true,
          extension: [makeCalculatedExpression(undefined, "'A' | 'B' | 'C'")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const multiStore = form.scope.lookupNode("multi");

    assertQuestionNode(multiStore);

    expect(multiStore.answers.map((answer) => answer.value)).toEqual([
      "A",
      "B",
      "C",
    ]);
  });

  it("overwrites template initial values when calculated expressions run", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "result",
          type: "decimal",
          initial: [{ valueDecimal: 5 }],
          extension: [makeCalculatedExpression(undefined, "10")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("result");

    assertQuestionNode(node);

    expect(node.answers[0]?.value).toBe(10);
  });

  it("allows named calculated expressions to be reused", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            makeVariable(
              "baseValue",
              "%context.item.where(linkId='base').answer.valueDecimal.last()",
            ),
          ],
          item: [
            {
              linkId: "base",
              type: "decimal",
            },
            {
              linkId: "derived",
              type: "decimal",
              extension: [
                makeCalculatedExpression("basePlusOne", "%baseValue + 1"),
              ],
              item: [
                {
                  linkId: "mirror",
                  type: "decimal",
                  extension: [
                    makeCalculatedExpression(undefined, "%basePlusOne"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const base = form.scope.lookupNode("base");
    const derived = form.scope.lookupNode("derived");

    assertQuestionNode(base);
    assertQuestionNode(derived);

    const mirror = derived.answers[0]?.nodes.find(
      (child) => child.linkId === "mirror",
    );

    assertQuestionNode(mirror);

    const baseAnswer = base.answers[0];
    assertDefined(baseAnswer);
    baseAnswer.setValueByUser(5);
    expect(mirror.answers[0]?.value).toBe(6);
  });

  it("surfaces syntax errors from calculated expressions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "source",
          type: "decimal",
        },
        {
          linkId: "result",
          type: "decimal",
          extension: [makeCalculatedExpression(undefined, "1 +")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const resultStore = form.scope.lookupNode("result");

    assertQuestionNode(resultStore);

    const issue = resultStore.issues[0];
    expect(issue?.code).toBe("invalid");
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate calculated expression",
    );
    expect(issue?.diagnostics).toContain(
      "because the expression has a syntax error",
    );
    expect(resultStore.answers[0]?.value).toBeUndefined();
  });

  it("surfaces runtime errors from calculated expressions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "source",
          type: "decimal",
        },
        {
          linkId: "result",
          type: "decimal",
          extension: [makeCalculatedExpression(undefined, "1.total()")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const resultStore = form.scope.lookupNode("result");

    assertQuestionNode(resultStore);

    const issue = resultStore.issues[0];
    expect(issue?.code).toBe("invalid");
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate calculated expression",
    );
    expect(issue?.diagnostics).toContain(
      "because it calls an unsupported function",
    );
    expect(resultStore.answers[0]?.value).toBeUndefined();
  });

  it("overwrites read-only answers with calculated results", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "metrics",
          type: "group",
          extension: [
            makeVariable(
              "heightValue",
              "%context.item.where(linkId='height').answer.valueDecimal.last()",
            ),
            makeVariable(
              "weightValue",
              "%context.item.where(linkId='weight').answer.valueDecimal.last()",
            ),
          ],
          item: [
            {
              linkId: "height",
              type: "decimal",
            },
            {
              linkId: "weight",
              type: "decimal",
            },
            {
              linkId: "bmi",
              type: "decimal",
              readOnly: true,
              extension: [
                makeCalculatedExpression(
                  "bmiCalc",
                  "%weightValue / ((%heightValue / 100) * (%heightValue / 100))",
                ),
              ],
            },
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/bmi-readonly",
      status: "in-progress",
      item: [
        {
          linkId: "metrics",
          item: [
            { linkId: "height", answer: [{ valueDecimal: 160 }] },
            { linkId: "weight", answer: [{ valueDecimal: 70 }] },
            { linkId: "bmi", answer: [{ valueDecimal: 42 }] },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const heightStore = form.scope.lookupNode("height");
    const weightStore = form.scope.lookupNode("weight");
    const bmiStore = form.scope.lookupNode("bmi");

    assertQuestionNode(heightStore);
    assertQuestionNode(weightStore);
    assertQuestionNode(bmiStore);

    const height = heightStore;
    const weight = weightStore;
    const bmi = bmiStore;

    expect(bmi.answers[0]?.value).toBeCloseTo(27.34, 2);

    const heightAnswer = height.answers[0];
    assertDefined(heightAnswer);
    heightAnswer.setValueByUser(180);

    const weightAnswer = weight.answers[0];
    assertDefined(weightAnswer);
    weightAnswer.setValueByUser(90);

    expect(bmi.answers[0]?.value).toBeCloseTo(27.8, 1);
  });
});
