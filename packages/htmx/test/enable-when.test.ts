import { describe, expect, it } from "vitest";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { countName, valueName } from "../lib/template.ts";
import { nativeTemplates } from "./native-templates.ts";

import type {
  CodingOf,
  QuestionnaireItemEnableWhenOf,
  QuestionnaireOf,
  QuantityOf,
  ReferenceOf,
} from "@formbox/fhir";
import type { AnswerType } from "@formbox/renderer";

type Coding = CodingOf<"r5">;
type Quantity = QuantityOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireItem = NonNullable<Questionnaire["item"]>[number];
type QuestionnaireItemEnableWhen = QuestionnaireItemEnableWhenOf<"r5">;
type Reference = ReferenceOf<"r5">;

type SubmittedField = readonly [
  field: "value" | "system" | "code" | "display" | "unit",
  value: string,
];

async function processAndRender(
  questionnaire: Questionnaire,
  formData: FormData,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    await renderer.process(formData);
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function processResponse(
  questionnaire: Questionnaire,
  formData: FormData,
) {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

function formDataFor(
  linkId: string,
  fields: readonly SubmittedField[],
): FormData {
  const formData = new FormData();
  for (const [field, value] of fields) {
    formData.append(valueName([{ linkId }], field), value);
  }
  return formData;
}

function repeatedFormData(linkId: string, values: readonly string[]): FormData {
  const formData = new FormData();
  formData.append(countName([{ linkId }]), String(values.length));
  values.forEach((value, index) => {
    formData.append(valueName([{ linkId, index }], "value"), value);
  });
  return formData;
}

function isVisible(html: string, linkId: string): boolean {
  return html.includes(`data-fb-question="${linkId}"`);
}

function questionnaireFor(
  control: QuestionnaireItem,
  enableWhen: QuestionnaireItemEnableWhen[],
  enableBehavior?: "all" | "any",
): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "active",
    url: `Questionnaire/htmx-enable-when-${control.linkId}`,
    item: [
      control,
      {
        linkId: "dependent",
        text: "Dependent",
        type: "string",
        enableWhen,
        ...(enableBehavior === undefined ? {} : { enableBehavior }),
      },
    ],
  };
}

function conditionFor(
  type: Exclude<AnswerType, "attachment">,
  value: boolean | number | string | Coding | Quantity | Reference,
): QuestionnaireItemEnableWhen {
  const condition: QuestionnaireItemEnableWhen = {
    question: "control",
    operator: "=",
  };

  switch (type) {
    case "boolean": {
      condition.answerBoolean = value as boolean;
      return condition;
    }
    case "decimal": {
      condition.answerDecimal = value as number;
      return condition;
    }
    case "integer": {
      condition.answerInteger = value as number;
      return condition;
    }
    case "date": {
      condition.answerDate = value as string;
      return condition;
    }
    case "dateTime": {
      condition.answerDateTime = value as string;
      return condition;
    }
    case "time": {
      condition.answerTime = value as string;
      return condition;
    }
    case "string":
    case "text": {
      condition.answerString = value as string;
      return condition;
    }
    case "url": {
      condition.answerString = value as string;
      return condition;
    }
    case "coding": {
      condition.answerCoding = value as Coding;
      return condition;
    }
    case "quantity": {
      condition.answerQuantity = value as Quantity;
      return condition;
    }
    case "reference": {
      condition.answerReference = value as Reference;
      return condition;
    }
  }
}

describe("@formbox/htmx enableWhen parity", () => {
  const codingMatch: Coding = { system: "urn:test", code: "A" };
  const quantityMatch: Quantity = {
    system: "http://unitsofmeasure.org",
    code: "mg",
    unit: "mg",
    value: 5,
  };
  const referenceMatch: Reference = { reference: "Patient/1" };

  const equalityCases: Array<{
    readonly type: Exclude<AnswerType, "attachment">;
    readonly match: boolean | number | string | Coding | Quantity | Reference;
    readonly matchingFields: readonly SubmittedField[];
    readonly mismatchingFields: readonly SubmittedField[];
  }> = [
    {
      type: "boolean",
      match: true,
      matchingFields: [["value", "true"]],
      mismatchingFields: [["value", "false"]],
    },
    {
      type: "decimal",
      match: 4.5,
      matchingFields: [["value", "4.5"]],
      mismatchingFields: [["value", "7.1"]],
    },
    {
      type: "integer",
      match: 7,
      matchingFields: [["value", "7"]],
      mismatchingFields: [["value", "5"]],
    },
    {
      type: "date",
      match: "2024-01-01",
      matchingFields: [["value", "2024-01-01"]],
      mismatchingFields: [["value", "2023-12-31"]],
    },
    {
      type: "dateTime",
      match: "2024-01-01T12:00:00Z",
      matchingFields: [["value", "2024-01-01T12:00:00Z"]],
      mismatchingFields: [["value", "2024-01-01T08:00:00Z"]],
    },
    {
      type: "time",
      match: "10:15:00",
      matchingFields: [["value", "10:15:00"]],
      mismatchingFields: [["value", "08:30:00"]],
    },
    {
      type: "string",
      match: "alpha",
      matchingFields: [["value", "alpha"]],
      mismatchingFields: [["value", "beta"]],
    },
    {
      type: "text",
      match: "longer text",
      matchingFields: [["value", "longer text"]],
      mismatchingFields: [["value", "other text"]],
    },
    {
      type: "url",
      match: "https://example.org/target",
      matchingFields: [["value", "https://example.org/target"]],
      mismatchingFields: [["value", "https://example.org/other"]],
    },
    {
      type: "coding",
      match: codingMatch,
      matchingFields: [
        ["value", "A"],
        ["system", "urn:test"],
      ],
      mismatchingFields: [
        ["value", "B"],
        ["system", "urn:test"],
      ],
    },
    {
      type: "reference",
      match: referenceMatch,
      matchingFields: [["value", "Patient/1"]],
      mismatchingFields: [["value", "Patient/2"]],
    },
    {
      type: "quantity",
      match: quantityMatch,
      matchingFields: [
        ["value", "5"],
        ["unit", "mg"],
        ["system", "http://unitsofmeasure.org"],
        ["code", "mg"],
      ],
      mismatchingFields: [
        ["value", "6"],
        ["unit", "mg"],
        ["system", "http://unitsofmeasure.org"],
        ["code", "mg"],
      ],
    },
  ];

  it.each(equalityCases)(
    "evaluates equality for submitted $type answers",
    async ({ type, match, matchingFields, mismatchingFields }) => {
      const questionnaire = questionnaireFor(
        {
          linkId: "control",
          text: "Control",
          type,
        },
        [conditionFor(type, match)],
      );

      const matchingHtml = await processAndRender(
        questionnaire,
        formDataFor("control", matchingFields),
      );
      const mismatchingHtml = await processAndRender(
        questionnaire,
        formDataFor("control", mismatchingFields),
      );

      expect(isVisible(matchingHtml, "dependent")).toBe(true);
      expect(isVisible(mismatchingHtml, "dependent")).toBe(false);
    },
  );

  it("respects enableBehavior all across submitted controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-enable-when-all",
      item: [
        { linkId: "text", type: "string", text: "Text" },
        { linkId: "count", type: "integer", text: "Count" },
        {
          linkId: "dependent",
          type: "string",
          text: "Dependent",
          enableBehavior: "all",
          enableWhen: [
            { question: "text", operator: "=", answerString: "ok" },
            { question: "count", operator: ">=", answerInteger: 3 },
          ],
        },
      ],
    };
    const partial = new FormData();
    partial.append(valueName([{ linkId: "text" }], "value"), "not yet");
    partial.append(valueName([{ linkId: "count" }], "value"), "5");

    const complete = new FormData();
    complete.append(valueName([{ linkId: "text" }], "value"), "ok");
    complete.append(valueName([{ linkId: "count" }], "value"), "5");

    expect(
      isVisible(await processAndRender(questionnaire, partial), "dependent"),
    ).toBe(false);
    expect(
      isVisible(await processAndRender(questionnaire, complete), "dependent"),
    ).toBe(true);
  });

  it("treats disabled dependencies as having no submitted answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-disabled-dependency",
      item: [
        { linkId: "gate", type: "boolean", text: "Gate" },
        {
          linkId: "control",
          type: "integer",
          text: "Control",
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
        {
          linkId: "dependent",
          type: "string",
          text: "Dependent",
          enableWhen: [
            { question: "control", operator: "=", answerInteger: 5 },
          ],
        },
      ],
    };
    const formData = new FormData();
    formData.append(valueName([{ linkId: "gate" }], "value"), "false");
    formData.append(valueName([{ linkId: "control" }], "value"), "5");
    formData.append(valueName([{ linkId: "dependent" }], "value"), "tampered");
    const html = await processAndRender(questionnaire, formData);
    const response = await processResponse(questionnaire, formData);

    expect(isVisible(html, "control")).toBe(false);
    expect(isVisible(html, "dependent")).toBe(false);
    expect(response.item).toEqual([
      { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
    ]);
  });

  it("treats descendant enableWhen references as unsatisfiable", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-descendant-enable-when",
      item: [
        {
          linkId: "repeating-group",
          type: "group",
          repeats: true,
          enableWhen: [
            { question: "control", operator: "=", answerBoolean: true },
          ],
          item: [{ linkId: "control", type: "boolean", text: "Control" }],
        },
      ],
    };
    const formData = new FormData();
    formData.append(countName([{ linkId: "repeating-group" }]), "1");
    formData.append(
      valueName(
        [{ linkId: "repeating-group", index: 0 }, { linkId: "control" }],
        "value",
      ),
      "true",
    );
    const html = await processAndRender(questionnaire, formData);
    const response = await processResponse(questionnaire, formData);

    expect(isVisible(html, "control")).toBe(false);
    expect(response.item).toBeUndefined();
  });

  it("applies disabledDisplay hidden after full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-enable-when-disabled-display-hidden",
      item: [
        { linkId: "control", type: "boolean", text: "Control" },
        {
          linkId: "dependent",
          type: "string",
          text: "Dependent",
          disabledDisplay: "hidden",
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

    expect(
      isVisible(
        await processAndRender(
          questionnaire,
          formDataFor("control", [["value", "false"]]),
        ),
        "dependent",
      ),
    ).toBe(false);
    expect(
      isVisible(
        await processAndRender(
          questionnaire,
          formDataFor("control", [["value", "true"]]),
        ),
        "dependent",
      ),
    ).toBe(true);
  });

  it("evaluates repeated equality and inequality after full-form posts", async () => {
    const repeatedQuestionnaire = questionnaireFor(
      {
        linkId: "control",
        text: "Control",
        type: "string",
        repeats: true,
      },
      [{ question: "control", operator: "=", answerString: "target" }],
    );
    const inequalityQuestionnaire = questionnaireFor(
      { linkId: "control", text: "Control", type: "string" },
      [{ question: "control", operator: "!=", answerString: "match" }],
    );

    expect(
      isVisible(
        await processAndRender(
          repeatedQuestionnaire,
          repeatedFormData("control", ["first", "target"]),
        ),
        "dependent",
      ),
    ).toBe(true);
    expect(
      isVisible(
        await processAndRender(
          inequalityQuestionnaire,
          formDataFor("control", [["value", "different"]]),
        ),
        "dependent",
      ),
    ).toBe(true);
    expect(
      isVisible(
        await processAndRender(
          inequalityQuestionnaire,
          formDataFor("control", [["value", ""]]),
        ),
        "dependent",
      ),
    ).toBe(false);
    expect(
      isVisible(
        await processAndRender(
          inequalityQuestionnaire,
          formDataFor("control", [["value", "match"]]),
        ),
        "dependent",
      ),
    ).toBe(false);
  });

  it("treats whitespace-only submitted string answers as missing for exists", async () => {
    const existsTrueQuestionnaire = questionnaireFor(
      { linkId: "control", text: "Control", type: "string" },
      [{ question: "control", operator: "exists", answerBoolean: true }],
    );
    const existsFalseQuestionnaire = questionnaireFor(
      { linkId: "control", text: "Control", type: "string" },
      [{ question: "control", operator: "exists", answerBoolean: false }],
    );
    const whitespace = formDataFor("control", [["value", "   "]]);

    expect(
      isVisible(
        await processAndRender(existsTrueQuestionnaire, whitespace),
        "dependent",
      ),
    ).toBe(false);
    expect(
      isVisible(
        await processAndRender(existsFalseQuestionnaire, whitespace),
        "dependent",
      ),
    ).toBe(true);
  });

  it("evaluates comparison operators after submitted values are parsed", async () => {
    const cases: Array<{
      readonly control: QuestionnaireItem;
      readonly condition: QuestionnaireItemEnableWhen;
      readonly fields: readonly SubmittedField[];
      readonly visible: boolean;
    }> = [
      {
        control: { linkId: "control", text: "Control", type: "integer" },
        condition: { question: "control", operator: ">", answerInteger: 5 },
        fields: [["value", "10"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "decimal" },
        condition: { question: "control", operator: ">=", answerDecimal: 2.5 },
        fields: [["value", "2.5"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "date" },
        condition: {
          question: "control",
          operator: "<",
          answerDate: "2024-01-10",
        },
        fields: [["value", "2024-01-05"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "dateTime" },
        condition: {
          question: "control",
          operator: ">",
          answerDateTime: "2024-02-01T12:00:00Z",
        },
        fields: [["value", "2024-02-01T15:00:00Z"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "time" },
        condition: {
          question: "control",
          operator: "<",
          answerTime: "10:30:00",
        },
        fields: [["value", "09:30:00"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "string" },
        condition: { question: "control", operator: ">", answerString: "beta" },
        fields: [["value", "gamma"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "url" },
        condition: {
          question: "control",
          operator: ">",
          answerString: "https://example.org/beta",
        },
        fields: [["value", "https://example.org/gamma"]],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "quantity" },
        condition: {
          question: "control",
          operator: ">",
          answerQuantity: quantityMatch,
        },
        fields: [
          ["value", "6"],
          ["unit", "mg"],
          ["system", "http://unitsofmeasure.org"],
          ["code", "mg"],
        ],
        visible: true,
      },
      {
        control: { linkId: "control", text: "Control", type: "quantity" },
        condition: {
          question: "control",
          operator: ">",
          answerQuantity: quantityMatch,
        },
        fields: [
          ["value", "6"],
          ["unit", "mgplus"],
          ["system", "http://unitsofmeasure.org"],
          ["code", "mgplus"],
        ],
        visible: false,
      },
    ];

    for (const { control, condition, fields, visible } of cases) {
      const html = await processAndRender(
        questionnaireFor(control, [condition]),
        formDataFor("control", fields),
      );
      expect(isVisible(html, "dependent")).toBe(visible);
    }
  });

  it("returns false for malformed exists and unsupported comparison conditions", async () => {
    const malformedExists = await processAndRender(
      questionnaireFor(
        { linkId: "control", text: "Control", type: "boolean" },
        [{ question: "control", operator: "exists", answerInteger: 1 }],
      ),
      formDataFor("control", [["value", "true"]]),
    );
    const unsupportedComparison = await processAndRender(
      questionnaireFor(
        { linkId: "control", text: "Control", type: "boolean" },
        [{ question: "control", operator: ">", answerBoolean: true }],
      ),
      formDataFor("control", [["value", "true"]]),
    );
    const invalidComparisonValue = await processAndRender(
      questionnaireFor({ linkId: "control", text: "Control", type: "date" }, [
        { question: "control", operator: ">", answerDate: "2024-01-01" },
      ]),
      formDataFor("control", [["value", "not-a-date"]]),
    );

    expect(isVisible(malformedExists, "dependent")).toBe(false);
    expect(isVisible(unsupportedComparison, "dependent")).toBe(false);
    expect(isVisible(invalidComparisonValue, "dependent")).toBe(false);
  });

  it("ignores child-only answers when evaluating exists after full-form posts", async () => {
    const questionnaire = questionnaireFor(
      {
        linkId: "control",
        text: "Control",
        type: "string",
        item: [
          {
            linkId: "control-child",
            text: "Control child",
            type: "string",
          },
        ],
      },
      [{ question: "control", operator: "exists", answerBoolean: true }],
    );
    const formData = new FormData();
    formData.set(
      valueName([{ linkId: "control" }, { linkId: "control-child" }], "value"),
      "child value",
    );

    expect(
      isVisible(await processAndRender(questionnaire, formData), "dependent"),
    ).toBe(false);
  });

  it("skips non-comparable repeated answers when evaluating inequality", async () => {
    const questionnaire = questionnaireFor(
      {
        linkId: "control",
        text: "Control",
        type: "quantity",
        repeats: true,
      },
      [
        {
          question: "control",
          operator: "!=",
          answerQuantity: quantityMatch,
        },
      ],
    );
    const formData = new FormData();
    formData.set(countName([{ linkId: "control" }]), "2");
    formData.set(valueName([{ linkId: "control", index: 0 }], "unit"), "mg");
    formData.set(
      valueName([{ linkId: "control", index: 0 }], "system"),
      "http://unitsofmeasure.org",
    );
    formData.set(valueName([{ linkId: "control", index: 0 }], "code"), "mg");
    formData.set(valueName([{ linkId: "control", index: 1 }], "value"), "6");
    formData.set(valueName([{ linkId: "control", index: 1 }], "unit"), "mg");
    formData.set(
      valueName([{ linkId: "control", index: 1 }], "system"),
      "http://unitsofmeasure.org",
    );
    formData.set(valueName([{ linkId: "control", index: 1 }], "code"), "mg");

    expect(
      isVisible(await processAndRender(questionnaire, formData), "dependent"),
    ).toBe(true);
  });
});
