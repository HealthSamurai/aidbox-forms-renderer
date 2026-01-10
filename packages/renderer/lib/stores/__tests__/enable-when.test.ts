import { describe, expect, it } from "vitest";

import type {
  Coding,
  Questionnaire,
  QuestionnaireItemEnableWhen,
  Quantity,
  Reference,
} from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import type { AnswerType, EnableWhenAnswer } from "../../types.ts";
import { assertGroupNode, isGroupNode } from "../nodes/groups/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "../nodes/questions/question-store.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "../nodes/groups/group-list-store.ts";
import { assertDefined } from "../../utils.ts";

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
    case "boolean":
      condition.answerBoolean = expected as boolean;
      break;
    case "decimal":
      condition.answerDecimal = expected as number;
      break;
    case "integer":
      condition.answerInteger = expected as number;
      break;
    case "date":
      condition.answerDate = expected as string;
      break;
    case "dateTime":
      condition.answerDateTime = expected as string;
      break;
    case "time":
      condition.answerTime = expected as string;
      break;
    case "string":
    case "text":
    case "url":
      // url answers are represented as strings in enableWhen
      condition.answerString = expected as string;
      break;
    case "coding":
      condition.answerCoding = expected as Coding;
      break;
    case "reference":
      condition.answerReference = expected as Reference;
      break;
    case "quantity":
      condition.answerQuantity = expected as Quantity;
      break;
    case "attachment":
      throw new Error("enableWhen does not support attachment answers");
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

describe("enableWhen", () => {
  describe("operator semantics", () => {
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

    it("handles equality across multiple answers", () => {
      const condition = makeCondition("string", "=", "target");
      const { control, dependent } = createForm("string", condition, {
        repeats: true,
      });

      const firstAnswer = control.addAnswer(null);
      assertDefined(firstAnswer);
      firstAnswer.setValueByUser("first");

      const secondAnswer = control.addAnswer(null);
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

      const firstQuantity = control.addAnswer(null);
      assertDefined(firstQuantity);
      firstQuantity.setValueByUser({
        system: "http://unitsofmeasure.org",
        code: "mg",
        unit: "mg",
      });
      const secondQuantity = control.addAnswer(null);
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

        const firstAnswer = control.answers[0] ?? control.addAnswer(null);
        assertDefined(firstAnswer);
        firstAnswer.setValueByUser(firstValue);

        additionalValues.forEach((value) => {
          const answer = control.addAnswer(null);
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
  });

  it("ignores required validation when dependent item is disabled", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "control",
          type: "boolean",
        },
        {
          linkId: "dependent",
          type: "string",
          required: true,
          enableWhen: [
            {
              question: "control",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);
    expect(form.validateAll()).toBe(true);
    expect(dependent.issues).toHaveLength(0);

    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(true);
    expect(dependent.isEnabled).toBe(true);
    expect(form.validateAll()).toBe(false);
    const diagnostics = dependent.issues.at(0)?.diagnostics ?? "";
    expect(diagnostics).toMatch(/required/i);
  });

  describe("disabledDisplay", () => {
    it("treats disabled items as hidden when disabledDisplay is hidden", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "control",
            type: "boolean",
            text: "Control",
          },
          {
            linkId: "dependent",
            type: "string",
            text: "Dependent",
            enableWhen: [
              {
                question: "control",
                operator: "=",
                answerBoolean: true,
              },
            ],
            disabledDisplay: "hidden",
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const control = form.scope.lookupNode("control");
      const dependent = form.scope.lookupNode("dependent");

      assertQuestionNode(control);
      assertQuestionNode(dependent);

      expect(dependent.isEnabled).toBe(false);
      expect(dependent.hidden).toBe(true);

      const controlAnswer = control.answers[0];
      assertDefined(controlAnswer);
      controlAnswer.setValueByUser(true);

      expect(dependent.isEnabled).toBe(true);
      expect(dependent.hidden).toBe(false);
    });

    it("does not hide disabled items when disabledDisplay is protected", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "control",
            type: "boolean",
            text: "Control",
          },
          {
            linkId: "dependent",
            type: "string",
            text: "Dependent",
            enableWhen: [
              {
                question: "control",
                operator: "=",
                answerBoolean: true,
              },
            ],
            disabledDisplay: "protected",
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const control = form.scope.lookupNode("control");
      const dependent = form.scope.lookupNode("dependent");

      assertQuestionNode(control);
      assertQuestionNode(dependent);

      expect(dependent.isEnabled).toBe(false);
      expect(dependent.hidden).toBe(false);

      const controlAnswer = control.answers[0];
      assertDefined(controlAnswer);
      controlAnswer.setValueByUser(true);

      expect(dependent.isEnabled).toBe(true);
      expect(dependent.hidden).toBe(false);
    });
  });

  it("treats disabled dependencies as having no answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "gate",
          type: "boolean",
        },
        {
          linkId: "control",
          type: "integer",
          enableWhen: [
            {
              question: "gate",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
        {
          linkId: "dependent",
          type: "string",
          enableWhen: [
            {
              question: "control",
              operator: "=",
              answerInteger: 5,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const gate = form.scope.lookupNode("gate");
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    assertQuestionNode(gate);
    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(control.isEnabled).toBe(false);
    expect(dependent.isEnabled).toBe(false);

    const gateAnswer = gate.answers[0];
    assertDefined(gateAnswer);
    gateAnswer.setValueByUser(true);
    expect(control.isEnabled).toBe(true);

    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(5);
    expect(dependent.isEnabled).toBe(true);

    gateAnswer.setValueByUser(false);
    expect(control.isEnabled).toBe(false);
    expect(dependent.isEnabled).toBe(false);
  });

  describe("form workflows", () => {
    it("enables a dependent item when equality condition is met", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          { linkId: "control", type: "boolean", text: "Control" },
          {
            linkId: "dependent",
            type: "string",
            text: "Dependent",
            enableWhen: [
              {
                question: "control",
                operator: "=",
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

      const controlAnswer = control.answers[0];
      assertDefined(controlAnswer);
      controlAnswer.setValueByUser(true);
      expect(dependent.isEnabled).toBe(true);

      controlAnswer.setValueByUser(false);
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

    it("treats enableWhen arrays as 'any' when behavior is unspecified", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          { linkId: "flag", type: "boolean", text: "Flag" },
          { linkId: "score", type: "integer", text: "Score" },
          {
            linkId: "dependent-any",
            type: "display",
            text: "Any enabled",
            enableWhen: [
              {
                question: "flag",
                operator: "=",
                answerBoolean: true,
              },
              {
                question: "score",
                operator: ">",
                answerInteger: 5,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const flag = form.scope.lookupNode("flag");
      const score = form.scope.lookupNode("score");
      const dependent = form.scope.lookupNode("dependent-any");

      expect(flag && isQuestionNode(flag)).toBe(true);
      expect(score && isQuestionNode(score)).toBe(true);
      expect(dependent).toBeDefined();
      assertQuestionNode(flag);
      assertQuestionNode(score);
      assertDefined(dependent);

      expect(dependent.isEnabled).toBe(false);

      const flagAnswer = flag.answers[0];
      assertDefined(flagAnswer);
      flagAnswer.setValueByUser(true);
      expect(dependent.isEnabled).toBe(true);

      flagAnswer.setValueByUser(false);
      expect(dependent.isEnabled).toBe(false);

      const scoreAnswer = score.answers[0];
      assertDefined(scoreAnswer);
      scoreAnswer.setValueByUser(10);
      expect(dependent.isEnabled).toBe(true);
    });

    it("respects enableBehavior 'all' across multiple conditions", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          { linkId: "text", type: "string", text: "Text" },
          { linkId: "count", type: "integer", text: "Count" },
          {
            linkId: "dependent-all",
            type: "boolean",
            text: "All enabled",
            enableBehavior: "all",
            enableWhen: [
              {
                question: "text",
                operator: "=",
                answerString: "ok",
              },
              {
                question: "count",
                operator: ">=",
                answerInteger: 3,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const text = form.scope.lookupNode("text");
      const count = form.scope.lookupNode("count");
      const dependent = form.scope.lookupNode("dependent-all");

      expect(text && isQuestionNode(text)).toBe(true);
      expect(count && isQuestionNode(count)).toBe(true);
      expect(dependent && isQuestionNode(dependent)).toBe(true);
      assertQuestionNode(text);
      assertQuestionNode(count);
      assertQuestionNode(dependent);

      expect(dependent.isEnabled).toBe(false);

      const textAnswer = text.answers[0];
      assertDefined(textAnswer);
      textAnswer.setValueByUser("not yet");

      const countAnswer = count.answers[0];
      assertDefined(countAnswer);
      countAnswer.setValueByUser(5);
      expect(dependent.isEnabled).toBe(false);

      textAnswer.setValueByUser("ok");
      expect(dependent.isEnabled).toBe(true);
    });

    it("disables descendants when an ancestor is disabled", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          { linkId: "toggle", type: "boolean", text: "Toggle" },
          {
            linkId: "group",
            type: "group",
            text: "Conditional group",
            enableWhen: [
              {
                question: "toggle",
                operator: "=",
                answerBoolean: true,
              },
            ],
            item: [
              {
                linkId: "child",
                type: "string",
                text: "Child question",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const toggle = form.scope.lookupNode("toggle");
      const group = form.scope.lookupNode("group");
      const child = form.scope.lookupNode("child");

      expect(toggle && isQuestionNode(toggle)).toBe(true);
      expect(group && isGroupNode(group)).toBe(true);
      expect(child && isQuestionNode(child)).toBe(true);
      assertQuestionNode(toggle);
      assertGroupNode(group);
      assertQuestionNode(child);

      expect(group.isEnabled).toBe(false);
      expect(child.isEnabled).toBe(false);

      const toggleAnswer = toggle.answers[0];
      assertDefined(toggleAnswer);
      toggleAnswer.setValueByUser(true);
      expect(group.isEnabled).toBe(true);
      expect(child.isEnabled).toBe(true);
    });

    it("evaluates inequality by requiring an actual answer", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          { linkId: "text", type: "string", text: "Text" },
          {
            linkId: "dependent-neq",
            type: "display",
            text: "Visible when text differs",
            enableWhen: [
              {
                question: "text",
                operator: "!=",
                answerString: "hide-me",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const text = form.scope.lookupNode("text");
      const dependent = form.scope.lookupNode("dependent-neq");

      expect(text && isQuestionNode(text)).toBe(true);
      expect(dependent).toBeDefined();
      assertQuestionNode(text);
      assertDefined(dependent);

      expect(dependent.isEnabled).toBe(false);

      const textAnswer = text.answers[0];
      assertDefined(textAnswer);
      textAnswer.setValueByUser("show-me");
      expect(dependent.isEnabled).toBe(true);

      textAnswer.setValueByUser("hide-me");
      expect(dependent.isEnabled).toBe(false);
    });
  });

  describe("cyclic dependencies", () => {
    it("treats descendant nodes' enableWhen as unsatisfiable (no answers)", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        id: "cyclic",
        status: "active",
        item: [
          {
            linkId: "repeating-group",
            type: "group",
            repeats: true,
            enableWhen: [
              { question: "control", operator: "=", answerBoolean: true },
            ],
            item: [{ linkId: "control", type: "boolean" }],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const list = form.scope.lookupNode("repeating-group");

      expect(list && isGroupListStore(list)).toBe(true);
      assertGroupListStore(list);

      list.addNode();
      expect(list.nodes.length).toBe(1);

      const node = list.nodes.at(0);
      expect(node && isGroupNode(node)).toBe(true);
      assertGroupNode(node);

      expect(node.isEnabled).toBe(false);
      expect(node.hidden).toBe(true);
      expect(node.responseItems).toHaveLength(0);

      const control = node.nodes.find((node) => node.linkId === "control");
      expect(control && isQuestionNode(control)).toBe(true);
      assertQuestionNode(control);

      expect(control.isEnabled).toBe(false);
      expect(control.hidden).toBe(true);
      expect(control.responseItems).toHaveLength(0);

      expect(form.response.item ?? []).toHaveLength(0);
    });
  });
});
