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
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
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
) {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "control",
        type: controlType,
        text: "Control",
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

describe("enableWhen answer[x]", () => {
  it("returns false when no matching answer property is provided", () => {
    const condition: QuestionnaireItemEnableWhen = {
      question: "control",
      operator: "=",
      answerInteger: 5,
    };

    const { control, dependent } = createForm("string", condition);
    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser("hello");

    expect(dependent.isEnabled).toBe(false);
  });

  const equalityCases: Array<{
    type: AnswerType;
    match: EnableWhenAnswer;
    mismatch: EnableWhenAnswer;
  }> = [
    { type: "boolean", match: true, mismatch: false },
    { type: "decimal", match: 4.5, mismatch: 7.1 },
    { type: "integer", match: 7, mismatch: 5 },
    { type: "date", match: "2024-01-01", mismatch: "2023-12-31" },
    {
      type: "dateTime",
      match: "2024-01-01T12:00:00Z",
      mismatch: "2024-01-01T08:00:00Z",
    },
    { type: "time", match: "10:15:00", mismatch: "08:30:00" },
    { type: "string", match: "alpha", mismatch: "beta" },
    { type: "text", match: "longer text", mismatch: "other text" },
    {
      type: "coding",
      match: { system: "urn:test", code: "A" },
      mismatch: { system: "urn:test", code: "B" },
    },
    {
      type: "reference",
      match: { reference: "Patient/1" },
      mismatch: { reference: "Patient/2" },
    },
    {
      type: "quantity",
      match: {
        system: "http://unitsofmeasure.org",
        code: "mg",
        unit: "mg",
        value: 5,
      },
      mismatch: {
        system: "http://unitsofmeasure.org",
        code: "mg",
        unit: "mg",
        value: 6,
      },
    },
  ];

  it.each(equalityCases)(
    "evaluates equality for $type answers",
    ({ type, match, mismatch }) => {
      const condition = makeCondition(type, "=", match);
      const { control, dependent } = createForm(type, condition);

      const firstAnswer = control.answers[0];
      assertDefined(firstAnswer);
      firstAnswer.setValueByUser(match);
      expect(dependent.isEnabled).toBe(true);

      firstAnswer.setValueByUser(mismatch);
      expect(dependent.isEnabled).toBe(false);
    },
  );
});
