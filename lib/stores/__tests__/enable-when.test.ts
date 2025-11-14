import { describe, expect, it } from "vitest";

import type {
  Coding,
  Questionnaire,
  QuestionnaireItemEnableWhen,
  Quantity,
  Reference,
} from "fhir/r5";

import { FormStore } from "../form-store.ts";
import type { AnswerType, IQuestionNode } from "../types.ts";
import { isNonRepeatingGroupNode } from "../non-repeating-group-store.ts";
import { isQuestionNode } from "../question-store.ts";
import { isRepeatingGroupWrapper } from "../repeating-group-wrapper.ts";
import { isRepeatingGroupNode } from "../repeating-group-store.ts";

type EnableWhenAnswer =
  | boolean
  | number
  | string
  | Coding
  | Quantity
  | Reference
  | null;

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
      const exhaustiveCheck: never = type;
      void exhaustiveCheck;
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

  if (!control || !isQuestionNode(control)) {
    throw new Error("Control item is not a question");
  }
  if (!dependent) {
    throw new Error("Dependent item not found");
  }

  return { control, dependent };
}

function setQuestionAnswer(
  question: IQuestionNode,
  index: number,
  value: EnableWhenAnswer,
) {
  while (question.answers.length <= index) {
    if (!question.repeats) {
      throw new Error(
        "Non-repeating question cannot create additional answers",
      );
    }
    question.addAnswer(null);
  }
  question.setAnswer(index, value as never);
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
      setQuestionAnswer(control, 0, true);

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
      setQuestionAnswer(controlTrue, 0, "   ");
      expect(dependentTrue.isEnabled).toBe(false);

      const { control: controlFalse, dependent: dependentFalse } = createForm(
        "string",
        {
          question: "control",
          operator: "exists",
          answerBoolean: false,
        },
      );
      setQuestionAnswer(controlFalse, 0, "   ");
      expect(dependentFalse.isEnabled).toBe(true);
    });

    it("returns false when no matching answer property is provided", () => {
      const condition: QuestionnaireItemEnableWhen = {
        question: "control",
        operator: "=",
        answerInteger: 5,
      };

      const { control, dependent } = createForm("string", condition);
      setQuestionAnswer(control, 0, "hello");

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

        setQuestionAnswer(control, 0, match);
        expect(dependent.isEnabled).toBe(true);

        setQuestionAnswer(control, 0, mismatch);
        expect(dependent.isEnabled).toBe(false);
      },
    );

    it("handles equality across multiple answers", () => {
      const condition = makeCondition("string", "=", "target");
      const { control, dependent } = createForm("string", condition, {
        repeats: true,
      });

      setQuestionAnswer(control, 0, "first");
      setQuestionAnswer(control, 1, "target");

      expect(dependent.isEnabled).toBe(true);
    });

    it("evaluates inequality by requiring a comparable value", () => {
      const condition = makeCondition("string", "!=", "match");
      const { control, dependent } = createForm("string", condition);

      setQuestionAnswer(control, 0, "different");
      expect(dependent.isEnabled).toBe(true);

      setQuestionAnswer(control, 0, "match");
      expect(dependent.isEnabled).toBe(false);

      setQuestionAnswer(control, 0, "");
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

      setQuestionAnswer(control, 0, {
        system: "http://unitsofmeasure.org",
        code: "mg",
        unit: "mg",
      });
      setQuestionAnswer(control, 1, {
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

        values.forEach((value, index) => {
          setQuestionAnswer(control, index, value);
        });

        expect(dependent.isEnabled).toBe(result);
      },
    );

    it("returns false for comparison operators on unsupported types", () => {
      const condition = makeCondition("boolean", ">", true);
      const { control, dependent } = createForm("boolean", condition);

      setQuestionAnswer(control, 0, true);
      expect(dependent.isEnabled).toBe(false);
    });

    it("ignores answers that cannot be parsed for comparison", () => {
      const condition = makeCondition("date", ">", "2024-01-01");
      const { control, dependent } = createForm("date", condition);

      setQuestionAnswer(control, 0, "not-a-date");
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

    if (
      !control ||
      !dependent ||
      !isQuestionNode(control) ||
      !isQuestionNode(dependent)
    ) {
      throw new Error("Expected question stores");
    }

    expect(dependent.isEnabled).toBe(false);
    expect(form.validateAll()).toBe(true);
    expect(dependent.issues).toHaveLength(0);

    control.setAnswer(0, true);
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

      if (!control || !isQuestionNode(control)) {
        throw new Error("Control item is not a question");
      }
      if (!dependent || !isQuestionNode(dependent)) {
        throw new Error("Dependent item is not a question");
      }

      expect(dependent.isEnabled).toBe(false);
      expect(dependent.hidden).toBe(true);

      setQuestionAnswer(control, 0, true);

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

      if (!control || !isQuestionNode(control)) {
        throw new Error("Control item is not a question");
      }
      if (!dependent || !isQuestionNode(dependent)) {
        throw new Error("Dependent item is not a question");
      }

      expect(dependent.isEnabled).toBe(false);
      expect(dependent.hidden).toBe(false);

      setQuestionAnswer(control, 0, true);

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

    if (
      !gate ||
      !control ||
      !dependent ||
      !isQuestionNode(gate) ||
      !isQuestionNode(control) ||
      !isQuestionNode(dependent)
    ) {
      throw new Error("Expected question stores");
    }

    expect(control.isEnabled).toBe(false);
    expect(dependent.isEnabled).toBe(false);

    gate.setAnswer(0, true);
    expect(control.isEnabled).toBe(true);

    control.setAnswer(0, 5);
    expect(dependent.isEnabled).toBe(true);

    gate.setAnswer(0, false);
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
      if (
        !control ||
        !dependent ||
        !isQuestionNode(control) ||
        !isQuestionNode(dependent)
      )
        return;

      expect(dependent.isEnabled).toBe(false);

      control.setAnswer(0, true);
      expect(dependent.isEnabled).toBe(true);

      control.setAnswer(0, false);
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
      if (
        !control ||
        !dependent ||
        !isQuestionNode(control) ||
        !isQuestionNode(dependent)
      )
        return;

      expect(dependent.isEnabled).toBe(false);

      const child = control.answers.at(0)?.nodes.at(0);
      expect(child && isQuestionNode(child)).toBe(true);
      if (!child || !isQuestionNode(child)) return;

      child.setAnswer(0, "child value");
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
      if (
        !flag ||
        !score ||
        !dependent ||
        !isQuestionNode(flag) ||
        !isQuestionNode(score)
      )
        return;

      expect(dependent.isEnabled).toBe(false);

      flag.setAnswer(0, true);
      expect(dependent.isEnabled).toBe(true);

      flag.setAnswer(0, false);
      expect(dependent.isEnabled).toBe(false);

      score.setAnswer(0, 10);
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
      if (
        !text ||
        !count ||
        !dependent ||
        !isQuestionNode(text) ||
        !isQuestionNode(count) ||
        !isQuestionNode(dependent)
      )
        return;

      expect(dependent.isEnabled).toBe(false);

      text.setAnswer(0, "not yet");
      count.setAnswer(0, 5);
      expect(dependent.isEnabled).toBe(false);

      text.setAnswer(0, "ok");
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
      expect(group && isNonRepeatingGroupNode(group)).toBe(true);
      expect(child && isQuestionNode(child)).toBe(true);
      if (
        !toggle ||
        !group ||
        !child ||
        !isQuestionNode(toggle) ||
        !isNonRepeatingGroupNode(group) ||
        !isQuestionNode(child)
      )
        return;

      expect(group.isEnabled).toBe(false);
      expect(child.isEnabled).toBe(false);

      toggle.setAnswer(0, true);
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
      if (!text || !dependent || !isQuestionNode(text)) return;

      expect(dependent.isEnabled).toBe(false);

      text.setAnswer(0, "show-me");
      expect(dependent.isEnabled).toBe(true);

      text.setAnswer(0, "hide-me");
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
      const wrapper = form.scope.lookupNode("repeating-group");

      expect(wrapper && isRepeatingGroupWrapper(wrapper)).toBe(true);
      if (!wrapper || !isRepeatingGroupWrapper(wrapper)) return;

      wrapper.addInstance();
      expect(wrapper.nodes.length).toBe(1);

      const instance = wrapper.nodes.at(0);
      expect(instance && isRepeatingGroupNode(instance)).toBe(true);
      if (!instance || !isRepeatingGroupNode(instance)) return;

      expect(instance.isEnabled).toBe(false);
      expect(instance.hidden).toBe(true);
      expect(instance.responseItems).toHaveLength(0);

      const control = instance.nodes.find((node) => node.linkId === "control");
      expect(control && isQuestionNode(control)).toBe(true);
      if (!control || !isQuestionNode(control)) return;

      expect(control.isEnabled).toBe(false);
      expect(control.hidden).toBe(true);
      expect(control.responseItems).toHaveLength(0);

      expect(form.response.item ?? []).toHaveLength(0);
    });
  });
});
