import { describe, expect, it } from "vitest";
import type {
  Coding,
  Questionnaire,
  QuestionnaireItemEnableWhen,
  Quantity,
  Reference,
} from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import type { AnswerType, EnableWhenAnswer } from "@formbox/renderer/types.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

function makeCondition(
  type: AnswerType,
  operator: QuestionnaireItemEnableWhen["operator"],
  expected: EnableWhenAnswer,
): QuestionnaireItemEnableWhen {
  const condition: QuestionnaireItemEnableWhen = {
    question: "control",
    operator,
  };

  switch (type) {
    case "boolean": {
      condition.answerBoolean = expected as boolean;
      break;
    }
    case "decimal": {
      condition.answerDecimal = expected as number;
      break;
    }
    case "integer": {
      condition.answerInteger = expected as number;
      break;
    }
    case "date": {
      condition.answerDate = expected as string;
      break;
    }
    case "dateTime": {
      condition.answerDateTime = expected as string;
      break;
    }
    case "time": {
      condition.answerTime = expected as string;
      break;
    }
    case "string":
    case "text":
    case "url": {
      condition.answerString = expected as string;
      break;
    }
    case "coding": {
      condition.answerCoding = expected as Coding;
      break;
    }
    case "reference": {
      condition.answerReference = expected as Reference;
      break;
    }
    case "quantity": {
      condition.answerQuantity = expected as Quantity;
      break;
    }
    case "attachment": {
      throw new Error("enableWhen does not support attachment answers");
    }
    default: {
      throw new Error("Unhandled type");
    }
  }

  return condition;
}

function createForm(
  controlType: AnswerType,
  condition: QuestionnaireItemEnableWhen,
  options?: { repeats?: boolean },
) {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "control",
        type: controlType,
        text: "Control",
        repeats: options?.repeats ?? false,
      },
      {
        linkId: "dependent",
        type: "display",
        text: "Dependent",
        enableWhen: [condition],
      },
    ],
  };

  const form = new FormStore(questionnaire);
  const control = form.scope.lookupNode("control");
  const dependent = form.scope.lookupNode("dependent");

  assertQuestionNode(control);
  assertDefined(dependent);

  return { control, dependent };
}

describe("enableWhen operator", () => {
  it("returns false for exists when expected is not boolean", () => {
    const condition: QuestionnaireItemEnableWhen = {
      question: "control",
      operator: "exists",
      answerInteger: 1,
    };

    const { control, dependent } = createForm("boolean", condition);
    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(true);

    expect(dependent.isEnabled).toBe(false);
  });

  it("treats whitespace-only string answers as missing for exists", () => {
    const { control: controlTrue, dependent: dependentTrue } = createForm(
      "string",
      {
        question: "control",
        operator: "exists",
        answerBoolean: true,
      },
    );
    const controlTrueAnswer = controlTrue.answers[0];
    assertDefined(controlTrueAnswer);
    controlTrueAnswer.setValueByUser("   ");
    expect(dependentTrue.isEnabled).toBe(false);

    const { control: controlFalse, dependent: dependentFalse } = createForm(
      "string",
      {
        question: "control",
        operator: "exists",
        answerBoolean: false,
      },
    );
    const controlFalseAnswer = controlFalse.answers[0];
    assertDefined(controlFalseAnswer);
    controlFalseAnswer.setValueByUser("   ");
    expect(dependentFalse.isEnabled).toBe(true);
  });

  it("handles equality across multiple answers", () => {
    const condition = makeCondition("string", "=", "target");
    const { control, dependent } = createForm("string", condition, {
      repeats: true,
    });

    const firstAnswer = control.addAnswer();
    assertDefined(firstAnswer);
    firstAnswer.setValueByUser("first");

    const secondAnswer = control.addAnswer();
    assertDefined(secondAnswer);
    secondAnswer.setValueByUser("target");

    expect(dependent.isEnabled).toBe(true);
  });

  it("evaluates inequality by requiring a comparable value", () => {
    const condition = makeCondition("string", "!=", "match");
    const { control, dependent } = createForm("string", condition);

    const inequalityAnswer = control.answers[0];
    assertDefined(inequalityAnswer);
    inequalityAnswer.setValueByUser("different");
    expect(dependent.isEnabled).toBe(true);

    inequalityAnswer.setValueByUser("match");
    expect(dependent.isEnabled).toBe(false);

    inequalityAnswer.setValueByUser("");
    expect(dependent.isEnabled).toBe(false);
  });

  it("skips non-comparable answers when evaluating inequality", () => {
    const condition = makeCondition("quantity", "!=", {
      system: "http://unitsofmeasure.org",
      code: "mg",
      unit: "mg",
      value: 5,
    });
    const { control, dependent } = createForm("quantity", condition, {
      repeats: true,
    });

    const firstQuantity = control.addAnswer();
    assertDefined(firstQuantity);
    firstQuantity.setValueByUser({
      system: "http://unitsofmeasure.org",
      code: "mg",
      unit: "mg",
    });
    const secondQuantity = control.addAnswer();
    assertDefined(secondQuantity);
    secondQuantity.setValueByUser({
      system: "http://unitsofmeasure.org",
      code: "mg",
      unit: "mg",
      value: 6,
    });

    expect(dependent.isEnabled).toBe(true);
  });

  const comparisonCases: Array<{
    type: AnswerType;
    operator: ">" | ">=" | "<" | "<=";
    expected: EnableWhenAnswer;
    values: EnableWhenAnswer[];
    result: boolean;
    description: string;
  }> = [
    {
      type: "integer",
      operator: ">",
      expected: 5,
      values: [4, 10],
      result: true,
      description: "uses later integer answers when earlier ones are smaller",
    },
    {
      type: "integer",
      operator: "<=",
      expected: 10,
      values: [12],
      result: false,
      description: "fails when integer exceeds threshold",
    },
    {
      type: "decimal",
      operator: ">=",
      expected: 2.5,
      values: [2.5],
      result: true,
      description: "matches decimal threshold inclusively",
    },
    {
      type: "date",
      operator: "<",
      expected: "2024-01-10",
      values: ["2024-01-05"],
      result: true,
      description: "compares dates by chronology",
    },
    {
      type: "dateTime",
      operator: ">",
      expected: "2024-02-01T12:00:00Z",
      values: ["2024-02-01T15:00:00Z"],
      result: true,
      description: "compares dateTimes in UTC",
    },
    {
      type: "time",
      operator: "<",
      expected: "10:30:00",
      values: ["09:30:00"],
      result: true,
      description: "compares FHIR times",
    },
    {
      type: "string",
      operator: ">",
      expected: "beta",
      values: ["alpha", "gamma"],
      result: true,
      description: "uses localeCompare for strings",
    },
    {
      type: "quantity",
      operator: ">",
      expected: {
        system: "http://unitsofmeasure.org",
        code: "mg",
        unit: "mg",
        value: 5,
      },
      values: [
        {
          system: "http://unitsofmeasure.org",
          code: "mg",
          unit: "mg",
          value: 5,
        },
        {
          system: "http://unitsofmeasure.org",
          code: "mg",
          unit: "mg",
          value: 6,
        },
      ],
      result: true,
      description: "compares quantities when units match",
    },
    {
      type: "quantity",
      operator: ">",
      expected: {
        system: "http://unitsofmeasure.org",
        code: "mg",
        unit: "mg",
        value: 5,
      },
      values: [
        {
          system: "http://unitsofmeasure.org",
          code: "mgplus",
          unit: "mgplus",
          value: 6,
        },
      ],
      result: false,
      description: "returns false when quantity units differ",
    },
  ];

  it.each(comparisonCases)(
    "evaluates $description",
    ({ type, operator, expected, values, result }) => {
      const condition = makeCondition(type, operator, expected);
      const { control, dependent } = createForm(type, condition, {
        repeats: values.length > 1,
      });

      const [firstValue, ...additionalValues] = values;

      const firstAnswer = control.answers[0] ?? control.addAnswer();
      assertDefined(firstAnswer);
      firstAnswer.setValueByUser(firstValue);

      additionalValues.forEach((value) => {
        const answer = control.addAnswer();
        assertDefined(answer);
        answer.setValueByUser(value);
      });

      expect(dependent.isEnabled).toBe(result);
    },
  );

  it("returns false for comparison operators on unsupported types", () => {
    const condition = makeCondition("boolean", ">", true);
    const { control, dependent } = createForm("boolean", condition);

    const comparisonAnswer = control.answers[0];
    assertDefined(comparisonAnswer);
    comparisonAnswer.setValueByUser(true);
    expect(dependent.isEnabled).toBe(false);
  });

  it("ignores answers that cannot be parsed for comparison", () => {
    const condition = makeCondition("date", ">", "2024-01-01");
    const { control, dependent } = createForm("date", condition);

    const comparisonAnswer = control.answers[0];
    assertDefined(comparisonAnswer);
    comparisonAnswer.setValueByUser("not-a-date");
    expect(dependent.isEnabled).toBe(false);
  });

  it("ignores child-only answers when evaluating exists", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "control",
          type: "string",
          text: "Control",
          item: [
            {
              linkId: "control-child",
              type: "string",
              text: "Child question",
            },
          ],
        },
        {
          linkId: "dependent",
          type: "string",
          text: "Dependent",
          enableWhen: [
            {
              question: "control",
              operator: "exists",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    expect(control && isQuestionNode(control)).toBe(true);
    expect(dependent && isQuestionNode(dependent)).toBe(true);
    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);

    const child = control.answers.at(0)?.nodes.at(0);
    expect(child && isQuestionNode(child)).toBe(true);
    assertQuestionNode(child);

    const childAnswer = child.answers[0];
    assertDefined(childAnswer);
    childAnswer.setValueByUser("child value");
    expect(dependent.isEnabled).toBe(false);
  });
});
