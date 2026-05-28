import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import strings from "@formbox/strings";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { searchName } from "../lib/template.ts";
import { nativeTemplates } from "./native-templates.ts";

import type {
  CodingOf,
  QuestionnaireItemAnswerOptionOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";

type Coding = CodingOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireItemAnswerOption = QuestionnaireItemAnswerOptionOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type QuestionnaireR4 = QuestionnaireOf<"r4">;
type QuestionnaireResponseR4 = QuestionnaireResponseOf<"r4">;

const itemControlUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const itemControlSystem = "http://hl7.org/fhir/questionnaire-item-control";
const optionExclusiveUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-optionExclusive";
const itemWeightUrl = "http://hl7.org/fhir/StructureDefinition/itemWeight";
const ordinalValueUrl = "http://hl7.org/fhir/StructureDefinition/ordinalValue";
const calculatedExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";
const variableUrl = "http://hl7.org/fhir/StructureDefinition/variable";
const answerOptionsToggleUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerOptionsToggleExpression";
const cqfExpressionUrl =
  "http://hl7.org/fhir/StructureDefinition/cqf-expression";

const GENDER_VALUE_SET = "http://example.test/ValueSet/gender";
const CONTACT_VALUE_SET = "http://example.test/ValueSet/contact";
const WEIGHTED_VALUE_SET = "http://example.test/ValueSet/weighted";

const expansionsByCanonical = {
  [GENDER_VALUE_SET]: [
    {
      system: "http://example.test/gender",
      code: "male",
      display: "Male",
    },
    {
      system: "http://example.test/gender",
      code: "female",
      display: "Female",
    },
  ],
  [CONTACT_VALUE_SET]: [
    {
      system: "http://example.test/contact",
      code: "phone",
      display: "Phone",
    },
    {
      system: "http://example.test/contact",
      code: "email",
      display: "Email",
    },
  ],
  [WEIGHTED_VALUE_SET]: [
    {
      system: "http://example.test/weighted",
      code: "never",
      display: "Never",
      extension: [{ url: itemWeightUrl, valueDecimal: 0 }],
    },
    {
      system: "http://example.test/weighted",
      code: "weekly",
      display: "Weekly",
      extension: [{ url: itemWeightUrl, valueDecimal: 2 }],
    },
  ],
};

const weightedOptions = [
  {
    valueCoding: {
      system: "http://example.test/score",
      code: "0",
      display: "Zero",
    },
    extension: [{ url: itemWeightUrl, valueDecimal: 0 }],
  },
  {
    valueCoding: {
      system: "http://example.test/score",
      code: "1",
      display: "One",
    },
    extension: [{ url: itemWeightUrl, valueDecimal: 1 }],
  },
  {
    valueCoding: {
      system: "http://example.test/score",
      code: "3",
      display: "Three",
    },
    extension: [{ url: itemWeightUrl, valueDecimal: 3 }],
  },
];

function itemControl(code: string) {
  return {
    url: itemControlUrl,
    valueCodeableConcept: {
      coding: [{ system: itemControlSystem, code }],
    },
  };
}

function answerOptionToggle(
  option: NonNullable<Questionnaire["item"]>[number]["answerOption"][number],
  expression: string,
) {
  return {
    url: answerOptionsToggleUrl,
    extension: [
      { url: "option", ...structuredClone(option) },
      {
        url: "expression",
        valueExpression: {
          language: "text/fhirpath",
          expression,
        },
      },
    ],
  };
}

function answerValueSetExpression(expression: string) {
  return {
    url: cqfExpressionUrl,
    valueExpression: {
      language: "text/fhirpath",
      expression,
    },
  };
}

function expressionExtension(url: string, expression: string, name?: string) {
  return {
    url,
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name === undefined ? {} : { name }),
    },
  };
}

function variable(name: string, expression: string) {
  return expressionExtension(variableUrl, expression, name);
}

function calculatedExpression(expression: string) {
  return expressionExtension(calculatedExpressionUrl, expression);
}

async function render(
  questionnaire: Questionnaire,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
    questionnaireResponse,
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function process(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
  questionnaire: Questionnaire,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<QuestionnaireResponse> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
    questionnaireResponse,
  });
  try {
    const formData = hiddenFormData(html);
    for (const [linkId, value] of entries) {
      formData.append(attributeFrom(html, linkId, "name"), value);
    }
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

async function processAndRender(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
  questionnaire: Questionnaire,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    const formData = hiddenFormData(html);
    for (const [linkId, value] of entries) {
      formData.append(attributeFrom(html, linkId, "name"), value);
    }
    await renderer.process(formData);
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function renderR4(questionnaire: QuestionnaireR4): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r4",
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function processR4(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
  questionnaire: QuestionnaireR4,
): Promise<QuestionnaireResponseR4> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r4",
  });
  try {
    const formData = hiddenFormData(html);
    for (const [linkId, value] of entries) {
      formData.append(attributeFrom(html, linkId, "name"), value);
    }
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

function hiddenFormData(html: string): FormData {
  const formData = new FormData();
  const pattern =
    /<input[^>]*type="hidden"[^>]*name="([^"]+)"[^>]*value="([^"]*)"/gu;
  for (const match of html.matchAll(pattern)) {
    const [, rawName, rawValue] = match;
    if (rawName && rawValue !== undefined) {
      formData.append(decodeEntities(rawName), decodeEntities(rawValue));
    }
  }
  return formData;
}

function attributeFrom(
  html: string,
  linkId: string,
  attribute: string,
): string {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const pattern = new RegExp(
    String.raw`<[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\bdata-fb-field="value"[^>]*\b${attribute}="([^"]+)"`,
    "u",
  );
  const match = pattern.exec(html);
  if (!match?.[1]) {
    throw new Error(`Missing ${attribute} for ${linkId} in ${html}`);
  }
  return decodeEntities(match[1]);
}

function optionValue(html: string, label: string): string {
  const optionPattern = new RegExp(
    String.raw`<option\b[^>]*\bvalue="([^"]+)"[^>]*>(?:<span>)?${escapeRegExp(label)}(?:</span>)?</option>`,
    "u",
  );
  const optionMatch = optionPattern.exec(html);
  if (optionMatch?.[1]) {
    return decodeEntities(optionMatch[1]);
  }

  const inputPattern = new RegExp(
    String.raw`<label><input\b[^>]*\bvalue="([^"]+)"[^>]*>(?:<span>)?${escapeRegExp(label)}(?:</span>)?</label>`,
    "u",
  );
  const inputMatch = inputPattern.exec(html);
  if (inputMatch?.[1]) {
    return decodeEntities(inputMatch[1]);
  }

  throw new Error(`Missing option ${label} in ${html}`);
}

function optionMarkup(html: string, label: string): string {
  const optionPattern = new RegExp(
    String.raw`<option\b[^>]*>(?:<span>)?${escapeRegExp(label)}(?:</span>)?</option>`,
    "u",
  );
  const optionMatch = optionPattern.exec(html);
  if (optionMatch?.[0]) {
    return optionMatch[0];
  }

  const inputPattern = new RegExp(
    String.raw`<label><input\b[^>]*\bvalue="[^"]+"[^>]*>(?:<span>)?${escapeRegExp(label)}(?:</span>)?</label>`,
    "u",
  );
  const inputMatch = inputPattern.exec(html);
  if (inputMatch?.[0]) {
    return inputMatch[0];
  }

  throw new Error(`Missing option ${label} in ${html}`);
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

describe("@formbox/htmx option parity", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn<typeof globalThis, "fetch">>;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) =>
        buildFetchResponse(
          expansionsByCanonical[getRequestedCanonical(input)] ?? [],
        ),
      );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("serializes submitted string answerOption tokens as answer values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-string-answer-options",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerOption: [
            { valueString: "red" },
            { valueString: "green" },
            { valueString: "blue" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["color", optionValue(html, "green")]],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "color",
        text: "Color",
        answer: [{ valueString: "green" }],
      },
    ]);
  });

  it("serializes every supported answerOption value type from submitted tokens", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-option-value-types",
      item: [
        {
          linkId: "integer",
          text: "Integer",
          type: "integer",
          answerOption: [{ valueInteger: 7 }],
        },
        {
          linkId: "date",
          text: "Date",
          type: "date",
          answerOption: [{ valueDate: "2024-01-01" }],
        },
        {
          linkId: "time",
          text: "Time",
          type: "time",
          answerOption: [{ valueTime: "10:15:00" }],
        },
        {
          linkId: "string",
          text: "String",
          type: "string",
          answerOption: [{ valueString: "alpha" }],
        },
        {
          linkId: "coding",
          text: "Coding",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/code",
                code: "A",
                display: "Alpha",
              },
            },
          ],
        },
        {
          linkId: "reference",
          text: "Reference",
          type: "reference",
          answerOption: [
            {
              valueReference: {
                reference: "Patient/1",
                display: "Patient One",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [
        ["integer", optionValue(html, "7")],
        ["date", optionValue(html, "2024-01-01")],
        ["time", optionValue(html, "10:15:00")],
        ["string", optionValue(html, "alpha")],
        ["coding", optionValue(html, "Alpha")],
        ["reference", optionValue(html, "Patient One")],
      ],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "integer",
        text: "Integer",
        answer: [{ valueInteger: 7 }],
      },
      {
        linkId: "date",
        text: "Date",
        answer: [{ valueDate: "2024-01-01" }],
      },
      {
        linkId: "time",
        text: "Time",
        answer: [{ valueTime: "10:15:00" }],
      },
      {
        linkId: "string",
        text: "String",
        answer: [{ valueString: "alpha" }],
      },
      {
        linkId: "coding",
        text: "Coding",
        answer: [
          {
            valueCoding: {
              system: "http://example.test/code",
              code: "A",
              display: "Alpha",
            },
          },
        ],
      },
      {
        linkId: "reference",
        text: "Reference",
        answer: [
          {
            valueReference: {
              reference: "Patient/1",
              display: "Patient One",
            },
          },
        ],
      },
    ]);
  });

  it("serializes quantity answerOption tokens", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-quantity-answer-option",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          answerConstraint: "optionsOrString",
          answerOption: [
            {
              valueQuantity: {
                value: 1,
                unit: "mg",
                system: "http://unitsofmeasure.org",
                code: "mg",
              },
            } as QuestionnaireItemAnswerOption,
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["dose", optionValue(html, "1 mg")]],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [
          {
            valueQuantity: {
              value: 1,
              unit: "mg",
              system: "http://unitsofmeasure.org",
              code: "mg",
            },
          },
        ],
      },
    ]);
  });

  it("serializes boolean radio-button choices including unanswered", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-boolean-radio",
      item: [
        {
          linkId: "consent",
          text: "Consent",
          type: "boolean",
          extension: [itemControl("radio-button")],
        },
      ],
    };
    const html = await render(questionnaire);
    const yes = await process(
      html,
      [["consent", optionValue(html, "Yes")]],
      questionnaire,
    );
    const no = await process(
      html,
      [["consent", optionValue(html, "No")]],
      questionnaire,
    );
    const unanswered = await process(
      html,
      [["consent", optionValue(html, "Unanswered")]],
      questionnaire,
    );

    expect(optionMarkup(html, "Unanswered")).toContain("checked");
    expect(yes.item).toEqual([
      {
        linkId: "consent",
        text: "Consent",
        answer: [{ valueBoolean: true }],
      },
    ]);
    expect(no.item).toEqual([
      {
        linkId: "consent",
        text: "Consent",
        answer: [{ valueBoolean: false }],
      },
    ]);
    expect(unanswered.item).toBeUndefined();
  });

  it("serializes boolean drop-down choices including unanswered", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-boolean-dropdown",
      item: [
        {
          linkId: "consent",
          text: "Consent",
          type: "boolean",
          extension: [itemControl("drop-down")],
        },
      ],
    };
    const html = await render(questionnaire);
    const yes = await process(
      html,
      [["consent", optionValue(html, "Yes")]],
      questionnaire,
    );
    const no = await process(
      html,
      [["consent", optionValue(html, "No")]],
      questionnaire,
    );
    const unanswered = await process(
      html,
      [["consent", optionValue(html, "Unanswered")]],
      questionnaire,
    );

    expect(optionMarkup(html, "Unanswered")).toContain("selected");
    expect(yes.item).toEqual([
      {
        linkId: "consent",
        text: "Consent",
        answer: [{ valueBoolean: true }],
      },
    ]);
    expect(no.item).toEqual([
      {
        linkId: "consent",
        text: "Consent",
        answer: [{ valueBoolean: false }],
      },
    ]);
    expect(unanswered.item).toBeUndefined();
  });

  it("filters drop-down options by submitted search query", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-dropdown-search",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          extension: [itemControl("drop-down")],
          answerOption: [
            { valueString: "Alpha" },
            { valueString: "Bravo" },
            { valueString: "Charlie" },
          ],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(firstHtml);
      formData.set(searchName([{ linkId: "call-sign" }]), "br");
      await renderer.process(formData);
      const html = await renderer.render();

      expect(firstHtml).not.toContain('type="search"');
      expect(html).not.toContain('type="search"');
      expect(html).not.toContain(">Alpha</span>");
      expect(html).toContain(">Bravo</span>");
      expect(html).not.toContain(">Charlie</span>");
    } finally {
      renderer.dispose();
    }
  });

  it("preserves a selected drop-down answer when search filters it out", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-dropdown-search-selected",
      item: [
        {
          linkId: "contact",
          text: "Contact",
          type: "coding",
          answerConstraint: "optionsOnly",
          extension: [itemControl("drop-down")],
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "alpha",
                display: "Alpha",
              },
            },
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "bravo",
                display: "Bravo",
              },
            },
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "charlie",
                display: "Charlie",
              },
            },
          ],
        },
      ],
    };
    const initialHtml = await render(questionnaire);
    const selectedHtml = await processAndRender(
      initialHtml,
      [["contact", optionValue(initialHtml, "Bravo")]],
      questionnaire,
    );
    const formData = hiddenFormData(selectedHtml);
    formData.set(searchName([{ linkId: "contact" }]), "char");
    formData.set(
      attributeFrom(selectedHtml, "contact", "name"),
      optionValue(selectedHtml, "Bravo"),
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      await renderer.process(formData);
      const response = renderer.getQuestionnaireResponse();

      expect(response.item?.[0]?.answer?.[0]?.valueCoding).toEqual({
        system: "http://example.test/contact",
        code: "bravo",
        display: "Bravo",
      });

      const searchedHtml = await renderer.render();
      expect(optionMarkup(searchedHtml, "Bravo")).toContain("selected");

      const nextFormData = hiddenFormData(searchedHtml);
      nextFormData.set(
        attributeFrom(searchedHtml, "contact", "name"),
        optionValue(searchedHtml, "Bravo"),
      );
      const nextRenderer = new QuestionnaireRenderer({
        token: "form",
        templates: nativeTemplates,
        questionnaire,
        fhirVersion: "r5",
      });
      try {
        await nextRenderer.process(nextFormData);
        const nextResponse = nextRenderer.getQuestionnaireResponse();

        expect(nextResponse.item?.[0]?.answer?.[0]?.valueCoding).toEqual({
          system: "http://example.test/contact",
          code: "bravo",
          display: "Bravo",
        });
      } finally {
        nextRenderer.dispose();
      }
    } finally {
      renderer.dispose();
    }
  });

  it("filters repeated drop-down options by submitted search query", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-dropdown-search",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          repeats: true,
          extension: [itemControl("drop-down")],
          answerOption: [
            { valueString: "Alpha" },
            { valueString: "Bravo" },
            { valueString: "Charlie" },
          ],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(firstHtml);
      formData.set(searchName([{ linkId: "call-sign" }]), "ch");
      await renderer.process(formData);
      const html = await renderer.render();

      expect(firstHtml).not.toContain('type="search"');
      expect(html).not.toContain('type="search"');
      expect(html).not.toContain(">Alpha</span>");
      expect(html).not.toContain(">Bravo</span>");
      expect(html).toContain(">Charlie</span>");
    } finally {
      renderer.dispose();
    }
  });

  it("renders initially selected answerOption values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-selected-options",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerOption: [
            { valueString: "red" },
            { valueString: "green", initialSelected: true },
            { valueString: "blue" },
          ],
        },
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          answerOption: [
            { valueString: "cough", initialSelected: true },
            { valueString: "fever" },
            { valueString: "fatigue", initialSelected: true },
          ],
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const html = await renderer.render();

      expect(html).toMatch(
        /<option value="[^"]+" selected><span>green<\/span><\/option>/,
      );
      expect(renderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "color",
          text: "Color",
          answer: [{ valueString: "green" }],
        },
        {
          linkId: "symptoms",
          text: "Symptoms",
          answer: [{ valueString: "cough" }, { valueString: "fatigue" }],
        },
      ]);
    } finally {
      renderer.dispose();
    }
  });

  it("preserves response answers over initially selected answerOption values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-selected-response",
      item: [
        {
          linkId: "food",
          text: "Food",
          type: "string",
          answerOption: [
            { valueString: "pizza", initialSelected: true },
            { valueString: "sushi" },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-initial-selected-response",
      status: "in-progress",
      item: [
        {
          linkId: "food",
          answer: [{ valueString: "sushi" }],
        },
      ],
    };
    const html = await render(questionnaire, questionnaireResponse);

    expect(optionMarkup(html, "pizza")).not.toContain("selected");
    expect(optionMarkup(html, "sushi")).toContain("selected");
    expect(
      await process(
        html,
        [["food", optionValue(html, "sushi")]],
        questionnaire,
      ),
    ).toMatchObject({
      item: [
        {
          linkId: "food",
          text: "Food",
          answer: [{ valueString: "sushi" }],
        },
      ],
    });
  });

  it("uses answerOption.initialSelected instead of item.initial values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-selected-over-initial",
      item: [
        {
          linkId: "pet",
          text: "Pet",
          type: "string",
          initial: [{ valueString: "cat" }],
          answerOption: [
            { valueString: "dog", initialSelected: true },
            { valueString: "cat" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(optionMarkup(html, "dog")).toContain("selected");
    expect(optionMarkup(html, "cat")).not.toContain("selected");
    expect(
      await process(html, [["pet", optionValue(html, "dog")]], questionnaire),
    ).toMatchObject({
      item: [
        {
          linkId: "pet",
          text: "Pet",
          answer: [{ valueString: "dog" }],
        },
      ],
    });
  });

  it("preserves legacy selected answer options missing from current options", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-legacy-answer-options",
      item: [
        {
          linkId: "select-color",
          text: "Select color",
          type: "string",
          answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
        },
        {
          linkId: "radio-color",
          text: "Radio color",
          type: "string",
          extension: [itemControl("radio-button")],
          answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
        },
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOnly",
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Alpha" }, { valueString: "Bravo" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-legacy-answer-options",
      status: "in-progress",
      item: [
        {
          linkId: "select-color",
          answer: [{ valueString: "Green" }],
        },
        {
          linkId: "radio-color",
          answer: [{ valueString: "Green" }],
        },
        {
          linkId: "call-sign",
          answer: [{ valueString: "Alpha" }, { valueString: "Zulu" }],
        },
      ],
    };
    const html = await render(questionnaire, questionnaireResponse);

    expect(optionMarkup(html, "Green")).toContain("disabled");
    expect(optionMarkup(html, "Zulu")).toContain("disabled");

    const formData = hiddenFormData(html);
    const callSignName = attributeFrom(html, "call-sign", "name");
    const preservedCallSigns = formData
      .getAll(callSignName)
      .map(String)
      .filter((value) => value.length > 0);
    formData.delete(callSignName);
    formData.append(callSignName, "");
    formData.append(callSignName, optionValue(html, "Alpha"));
    preservedCallSigns.forEach((value) => formData.append(callSignName, value));

    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    let response: QuestionnaireResponse;
    try {
      await renderer.process(formData);
      response = renderer.getQuestionnaireResponse();
    } finally {
      renderer.dispose();
    }

    expect(response.item).toEqual([
      {
        linkId: "select-color",
        text: "Select color",
        answer: [{ valueString: "Green" }],
      },
      {
        linkId: "radio-color",
        text: "Radio color",
        answer: [{ valueString: "Green" }],
      },
      {
        linkId: "call-sign",
        text: "Call sign",
        answer: [{ valueString: "Alpha" }, { valueString: "Zulu" }],
      },
    ]);
  });

  it("submits legacy complex option tokens while preserving their values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-legacy-complex-answer-option",
      item: [
        {
          linkId: "diagnosis",
          text: "Diagnosis",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/diagnosis",
                code: "asthma",
                display: "Asthma",
              },
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-legacy-complex-answer-option",
      status: "in-progress",
      item: [
        {
          linkId: "diagnosis",
          answer: [
            {
              valueCoding: {
                system: "http://example.test/diagnosis",
                code: "copd",
                display: "COPD",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire, questionnaireResponse);
    const legacyToken = optionValue(html, "COPD");

    expect(legacyToken).toContain("__legacy__");
    expect(legacyToken).not.toContain("COPD");

    const response = await process(
      html,
      [["diagnosis", legacyToken]],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "diagnosis",
        text: "Diagnosis",
        answer: [
          {
            valueCoding: {
              system: "http://example.test/diagnosis",
              code: "copd",
              display: "COPD",
            },
          },
        ],
      },
    ]);
  });

  it("applies exclusive repeated answer options during aggregate checkbox submission", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-exclusive-options",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          extension: [itemControl("check-box")],
          answerOption: [
            { valueString: "Fever" },
            { valueString: "Cough" },
            {
              valueString: "None of the above",
              extension: [{ url: optionExclusiveUrl, valueBoolean: true }],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [
        ["symptoms", optionValue(html, "Fever")],
        ["symptoms", optionValue(html, "None of the above")],
      ],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "symptoms",
        text: "Symptoms",
        answer: [{ valueString: "None of the above" }],
      },
    ]);
  });

  it("replaces an exclusive option with a regular checkbox across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-exclusive-replace",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          extension: [itemControl("check-box")],
          answerOption: [
            { valueString: "Fever" },
            {
              valueString: "None of the above",
              extension: [{ url: optionExclusiveUrl, valueBoolean: true }],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const exclusiveHtml = await processAndRender(
      html,
      [["symptoms", optionValue(html, "None of the above")]],
      questionnaire,
    );
    const response = await process(
      exclusiveHtml,
      [
        ["symptoms", optionValue(exclusiveHtml, "Fever")],
        ["symptoms", optionValue(exclusiveHtml, "None of the above")],
      ],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "symptoms",
        text: "Symptoms",
        answer: [{ valueString: "Fever" }],
      },
    ]);
  });

  it("clears repeated option selections when no checkbox remains checked", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-clear-options",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Fever" }, { valueString: "Cough" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: questionnaire.url,
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          answer: [{ valueString: "Fever" }],
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const html = await renderer.render();
    renderer.dispose();
    const response = await process(
      html,
      [],
      questionnaire,
      questionnaireResponse,
    );

    expect(response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: questionnaire.url,
    });
  });

  it("rejects tampered disabled answer option tokens", async () => {
    const redOption = {
      valueString: "Red",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-disabled-option",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerOption: [redOption, { valueString: "Green" }],
          extension: [answerOptionToggle(redOption, "false")],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["color", optionValue(html, "Red")]],
      questionnaire,
    );

    expect(response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htmx-disabled-option",
    });
  });

  it("rejects tampered optionsOnly values that are not answer option tokens", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-options-only-tamper",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerConstraint: "optionsOnly",
          answerOption: [{ valueString: "Red" }, { valueString: "Green" }],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(html, [["color", "Purple"]], questionnaire);

    expect(response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htmx-options-only-tamper",
    });
  });

  it("rejects tampered disabled repeated answer option tokens", async () => {
    const redOption = {
      valueString: "Red",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-disabled-repeated-option",
      item: [
        {
          linkId: "colors",
          text: "Colors",
          type: "string",
          repeats: true,
          extension: [
            itemControl("check-box"),
            answerOptionToggle(redOption, "false"),
          ],
          answerOption: [redOption, { valueString: "Green" }],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [
        ["colors", optionValue(html, "Red")],
        ["colors", optionValue(html, "Green")],
      ],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "colors",
        text: "Colors",
        answer: [{ valueString: "Green" }],
      },
    ]);
  });

  it("rejects tampered repeated optionsOnly values that are not answer option tokens", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-options-only-tamper",
      item: [
        {
          linkId: "colors",
          text: "Colors",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOnly",
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Red" }, { valueString: "Green" }],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [
        ["colors", optionValue(html, "Green")],
        ["colors", "Purple"],
      ],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "colors",
        text: "Colors",
        answer: [{ valueString: "Green" }],
      },
    ]);
  });

  it("updates disabled answer option state after submitted toggle answers", async () => {
    const redOption = {
      valueCoding: {
        system: "http://example.org/colors",
        code: "red",
        display: "Red",
      },
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-dynamic-disabled-option",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
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
                redOption,
                {
                  valueCoding: {
                    system: "http://example.org/colors",
                    code: "green",
                    display: "Green",
                  },
                },
              ],
              extension: [answerOptionToggle(redOption, "%toggleValue")],
            },
          ],
        },
      ],
    };
    const initialHtml = await render(questionnaire);
    const enabledHtml = await processAndRender(
      initialHtml,
      [["toggle", "true"]],
      questionnaire,
    );
    const response = await process(
      enabledHtml,
      [
        ["toggle", "true"],
        ["color", optionValue(enabledHtml, "Red")],
      ],
      questionnaire,
    );
    const panel = response.item?.find((item) => item.linkId === "panel");
    const color = panel?.item?.find((item) => item.linkId === "color");

    expect(optionMarkup(initialHtml, "Red")).toContain("disabled");
    expect(optionMarkup(initialHtml, "Green")).not.toContain("disabled");
    expect(optionMarkup(enabledHtml, "Red")).not.toContain("disabled");
    expect(color?.answer?.[0]?.valueCoding?.code).toBe("red");
  });

  it("treats multiple answer option toggle expressions as logical OR", async () => {
    const redOption = { valueString: "Red" };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-option-toggle-or",
      item: [
        {
          linkId: "color",
          type: "string",
          text: "Preferred color",
          answerOption: [redOption, { valueString: "Green" }],
          extension: [
            answerOptionToggle(redOption, "false"),
            answerOptionToggle(redOption, "true"),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["color", optionValue(html, "Red")]],
      questionnaire,
    );

    expect(optionMarkup(html, "Red")).not.toContain("disabled");
    expect(optionMarkup(html, "Green")).not.toContain("disabled");
    expect(response.item?.[0]?.answer?.[0]?.valueString).toBe("Red");
  });

  it("renders and processes custom string answer options", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-answer-option",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerConstraint: "optionsOrString",
          answerOption: [{ valueString: "Red" }, { valueString: "Green" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const secondHtml = await processAndRender(
      firstHtml,
      [["color", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const response = await process(
      secondHtml,
      [["color", "Purple"]],
      questionnaire,
    );

    expect(secondHtml).toContain("<fieldset>");
    expect(response.item).toEqual([
      {
        linkId: "color",
        text: "Color",
        answer: [{ valueString: "Purple" }],
      },
    ]);
  });

  it("keeps custom answer option form submission enabled for server validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-empty-custom-answer-option-submit-enabled",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerConstraint: "optionsOrString",
          answerOption: [{ valueString: "Red" }, { valueString: "Green" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["color", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );

    expect(customHtml).toContain(`value="submit-custom">Apply</button>`);
    expect(customHtml).not.toMatch(
      /<button\b[^>]*\bvalue="submit-custom"[^>]*\bdisabled\b/u,
    );
  });

  it("keeps an empty custom answer option form open on tampered submit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-empty-custom-answer-option",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerConstraint: "optionsOrString",
          answerOption: [{ valueString: "Red" }, { valueString: "Green" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["color", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const formData = hiddenFormData(customHtml);
    formData.append(
      attributeFrom(customHtml, "color", "name"),
      optionValue(customHtml, "Specify other"),
    );
    formData.append(attributeFrom(customHtml, "color", "name"), "");
    formData.append("fb[action]", "submit-custom");

    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    try {
      await renderer.process(formData);
      const html = await renderer.render();

      expect(html).toContain("<fieldset>");
      expect(html).toContain(`>${strings.en.dialog.submit}</button>`);
      expect(renderer.getQuestionnaireResponse().item).toBeUndefined();
    } finally {
      renderer.dispose();
    }
  });

  it("processes optionsOrString custom values for non-string answer types", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-string-for-quantity-option",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          answerConstraint: "optionsOrString",
          maxLength: 4,
          answerOption: [
            {
              valueQuantity: {
                value: 1,
                unit: "mg",
              },
            },
          ],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const secondHtml = await processAndRender(
      firstHtml,
      [["dose", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const response = await process(
      secondHtml,
      [["dose", "oral"]],
      questionnaire,
    );

    expect(secondHtml).toContain('maxlength="4"');
    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [{ valueString: "oral" }],
      },
    ]);
  });

  it("preserves repeated optionsOrType custom values across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-options-or-type-custom",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "integer",
          repeats: true,
          answerConstraint: "optionsOrType",
          extension: [itemControl("check-box")],
          answerOption: [{ valueInteger: 1 }, { valueInteger: 2 }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["dose", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const selectedHtml = await processAndRender(
      customHtml,
      [["dose", "3"]],
      questionnaire,
    );
    const response = await process(
      selectedHtml,
      [["dose", optionValue(selectedHtml, "3")]],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [{ valueInteger: 3 }],
      },
    ]);
  });

  it("keeps multiple repeated drop-down custom answers distinct from matching options", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-dropdown-custom-options",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOrType",
          extension: [itemControl("drop-down")],
          answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["call-sign", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const firstRenderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    let firstCustomHtml = "";
    try {
      const formData = hiddenFormData(customHtml);
      const name = attributeFrom(customHtml, "call-sign", "name");
      formData.append(name, optionValue(customHtml, "Specify other"));
      formData.append(name, "Echo");
      formData.append("fb[action]", "submit-custom");
      await firstRenderer.process(formData);
      firstCustomHtml = await firstRenderer.render();

      expect(firstRenderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "call-sign",
          text: "Call sign",
          answer: [{ valueString: "Echo" }],
        },
      ]);
    } finally {
      firstRenderer.dispose();
    }

    const secondRenderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(firstCustomHtml);
      const name = attributeFrom(firstCustomHtml, "call-sign", "name");
      formData.append(name, optionValue(firstCustomHtml, "Specify other"));
      formData.append(name, "Foxtrot");
      formData.append("fb[action]", "submit-custom");
      await secondRenderer.process(formData);
      const html = await secondRenderer.render();

      expect(html).toContain("Foxtrot");
      expect(secondRenderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "call-sign",
          text: "Call sign",
          answer: [{ valueString: "Echo" }, { valueString: "Foxtrot" }],
        },
      ]);
    } finally {
      secondRenderer.dispose();
    }
  });

  it("keeps Specify other active when a custom value matches an existing radio option across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-option-matching-radio-option",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          answerConstraint: "optionsOrType",
          extension: [itemControl("radio-button")],
          answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["call-sign", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(customHtml);
      const name = attributeFrom(customHtml, "call-sign", "name");
      formData.append(name, optionValue(customHtml, "Specify other"));
      formData.append(name, "Echo");
      await renderer.process(formData);
      const selectedHtml = await renderer.render();

      expect(optionMarkup(selectedHtml, "Echo")).not.toContain("checked");
      expect(optionMarkup(selectedHtml, "Specify other")).toContain("checked");
      expect(selectedHtml).toMatch(
        /<input[^>]*data-fb-link-id="call-sign"[^>]*value="Echo"/u,
      );
    } finally {
      renderer.dispose();
    }
  });

  it("keeps Specify other active when a repeated custom value matches an existing checkbox option across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-option-matching-checkbox-option",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOrType",
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["call-sign", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(customHtml);
      const name = attributeFrom(customHtml, "call-sign", "name");
      formData.append(name, optionValue(customHtml, "Specify other"));
      formData.append(name, "Echo");
      await renderer.process(formData);
      const selectedHtml = await renderer.render();

      expect(optionMarkup(selectedHtml, "Echo")).not.toContain("checked");
      expect(optionMarkup(selectedHtml, "Specify other")).toContain("checked");
      expect(selectedHtml).toMatch(
        /<input[^>]*data-fb-link-id="call-sign"[^>]*value="Echo"/u,
      );
    } finally {
      renderer.dispose();
    }
  });

  it("keeps Specify other active when a repeated custom value matches an existing option with answer child items", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-option-matching-option-with-children",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOrType",
          extension: [
            itemControl("check-box"),
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
              valueInteger: 1,
            },
          ],
          answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["call-sign", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(customHtml);
      const name = attributeFrom(customHtml, "call-sign", "name");
      formData.append(name, optionValue(customHtml, "Specify other"));
      formData.append(name, "Echo");
      formData.set(attributeFrom(customHtml, "note", "name"), "custom note");
      await renderer.process(formData);
      const selectedHtml = await renderer.render();
      const response = renderer.getQuestionnaireResponse();

      expect(optionMarkup(selectedHtml, "Echo")).not.toContain("checked");
      expect(optionMarkup(selectedHtml, "Specify other")).toContain("checked");
      expect(selectedHtml).toMatch(
        /<input[^>]*data-fb-link-id="call-sign"[^>]*value="Echo"/u,
      );
      expect(response.item).toEqual([
        {
          linkId: "call-sign",
          text: "Call sign",
          answer: [
            {
              valueString: "Echo",
              item: [
                {
                  linkId: "note",
                  text: "Note",
                  answer: [{ valueString: "custom note" }],
                },
              ],
            },
          ],
        },
      ]);
    } finally {
      renderer.dispose();
    }
  });

  it("commits a repeated custom option form when Add is submitted across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-submit-custom-option",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOrType",
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["call-sign", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(customHtml);
      const name = attributeFrom(customHtml, "call-sign", "name");
      formData.append(name, optionValue(customHtml, "Specify other"));
      formData.append(name, "Echo");
      formData.append("fb[action]", "submit-custom");
      await renderer.process(formData);
      const selectedHtml = await renderer.render();
      const echoOptions = [
        ...selectedHtml.matchAll(
          /<label><input\b[^>]*>(?:<span>)?Echo(?:<\/span>)?<\/label>/gu,
        ),
      ].map((match) => match[0]);

      expect(selectedHtml).not.toContain(
        `value="submit-custom">${strings.en.dialog.submit}</button>`,
      );
      expect(echoOptions).toHaveLength(2);
      expect(
        echoOptions.some(
          (option) =>
            option.includes("checked") && option.includes("__custom__"),
        ),
      ).toBe(true);
      expect(renderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "call-sign",
          text: "Call sign",
          answer: [{ valueString: "Echo" }],
        },
      ]);
    } finally {
      renderer.dispose();
    }
  });

  it("cancels a repeated custom option form across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-cancel-custom-option",
      item: [
        {
          linkId: "allergy",
          text: "Allergy",
          type: "string",
          repeats: true,
          answerConstraint: "optionsOrString",
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Dust" }, { valueString: "Pollen" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const customHtml = await processAndRender(
      firstHtml,
      [["allergy", optionValue(firstHtml, "Specify other")]],
      questionnaire,
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const formData = hiddenFormData(customHtml);
      const name = attributeFrom(customHtml, "allergy", "name");
      formData.append(name, optionValue(customHtml, "Specify other"));
      formData.append("fb[action]", "cancel-custom");
      await renderer.process(formData);
      const html = await renderer.render();

      expect(customHtml).toContain(`>${strings.en.dialog.cancel}</button>`);
      expect(html).not.toContain(
        `value="submit-custom">${strings.en.dialog.submit}</button>`,
      );
      expect(html).not.toContain(
        `value="cancel-custom">${strings.en.dialog.cancel}</button>`,
      );
      expect(html).not.toContain("__custom-input");
      expect(renderer.getQuestionnaireResponse().item).toBeUndefined();
    } finally {
      renderer.dispose();
    }
  });

  it("preserves itemWeight on option-token answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-weighted-options",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "coding",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/score",
                code: "one",
                display: "One",
              },
              extension: [{ url: itemWeightUrl, valueDecimal: 1 }],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["score", optionValue(html, "One")]],
      questionnaire,
    );

    expect(response.item?.[0]?.answer?.[0]?.extension).toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 1,
    });
  });

  it("uses answerOption itemWeight for calculated scoring and QuestionnaireResponse answer metadata", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-weighted-scoring",
      item: [
        {
          linkId: "phq9",
          text: "PHQ-9",
          type: "group",
          extension: [
            variable(
              "phq9Score",
              "%context.item.where(linkId='q1' or linkId='q2').answer.value.weight().aggregate($this + $total, 0)",
            ),
          ],
          item: [
            {
              linkId: "q1",
              text: "Q1",
              type: "coding",
              extension: [itemControl("radio-button")],
              answerOption: structuredClone(weightedOptions),
            },
            {
              linkId: "q2",
              text: "Q2",
              type: "coding",
              extension: [itemControl("radio-button")],
              answerOption: structuredClone(weightedOptions),
            },
            {
              linkId: "total",
              text: "Total",
              type: "integer",
              extension: [calculatedExpression("%phq9Score")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [
        ["q1", optionValue(html, "One")],
        ["q2", optionValue(html, "Three")],
      ],
      questionnaire,
    );
    const group = response.item?.find((item) => item.linkId === "phq9");
    const q1 = group?.item?.find((item) => item.linkId === "q1");
    const total = group?.item?.find((item) => item.linkId === "total");

    expect(total?.answer?.[0]?.valueInteger).toBe(4);
    expect(q1?.answer?.[0]?.extension).toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 1,
    });
    expect(q1?.answer?.[0]?.valueCoding?.extension ?? []).not.toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 1,
    });
  });

  it("accepts deprecated ordinalValue extensions as scoring weights", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-ordinal-scoring",
      item: [
        {
          linkId: "score-input",
          text: "Score input",
          type: "coding",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/legacy",
                code: "high",
                display: "High",
              },
              extension: [{ url: ordinalValueUrl, valueDecimal: 4 }],
            },
          ],
        },
        {
          linkId: "total",
          text: "Total",
          type: "integer",
          extension: [
            calculatedExpression(
              "%resource.item.where(linkId='score-input').answer.value.weight().aggregate($this + $total, 0)",
            ),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["score-input", optionValue(html, "High")]],
      questionnaire,
    );

    expect(
      response.item?.find((item) => item.linkId === "total")?.answer?.[0]
        ?.valueInteger,
    ).toBe(4);
  });

  it("prefers answerOption-level itemWeight over valueCoding-level itemWeight", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-weight-precedence",
      item: [
        {
          linkId: "score-input",
          text: "Score input",
          type: "coding",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/precedence",
                code: "high",
                display: "High",
                extension: [{ url: itemWeightUrl, valueDecimal: 1 }],
              },
              extension: [{ url: itemWeightUrl, valueDecimal: 3 }],
            },
          ],
        },
        {
          linkId: "total",
          text: "Total",
          type: "integer",
          extension: [
            calculatedExpression(
              "%resource.item.where(linkId='score-input').answer.value.weight().aggregate($this + $total, 0)",
            ),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["score-input", optionValue(html, "High")]],
      questionnaire,
    );
    const scoreInput = response.item?.find(
      (item) => item.linkId === "score-input",
    );

    expect(
      response.item?.find((item) => item.linkId === "total")?.answer?.[0]
        ?.valueInteger,
    ).toBe(3);
    expect(scoreInput?.answer?.[0]?.extension).toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 3,
    });
    expect(
      scoreInput?.answer?.[0]?.valueCoding?.extension ?? [],
    ).not.toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 1,
    });
  });

  it("uses itemWeight from answerValueSet expansion codings", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-weighted-value-set",
      item: [
        {
          linkId: "frequency",
          text: "Frequency",
          type: "coding",
          answerValueSet: WEIGHTED_VALUE_SET,
        },
        {
          linkId: "total",
          text: "Total",
          type: "integer",
          extension: [
            calculatedExpression(
              "%resource.item.where(linkId='frequency').answer.value.weight().aggregate($this + $total, 0)",
            ),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["frequency", optionValue(html, "Weekly")]],
      questionnaire,
    );
    const frequency = response.item?.find(
      (item) => item.linkId === "frequency",
    );

    expect(fetchSpy).toHaveBeenCalled();
    expect(
      response.item?.find((item) => item.linkId === "total")?.answer?.[0]
        ?.valueInteger,
    ).toBe(2);
    expect(frequency?.answer?.[0]?.extension).toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 2,
    });
    expect(
      frequency?.answer?.[0]?.valueCoding?.extension ?? [],
    ).not.toContainEqual({
      url: itemWeightUrl,
      valueDecimal: 2,
    });
  });

  it("expands answerValueSet options before rendering", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-value-set",
      item: [
        {
          linkId: "gender",
          text: "Gender",
          type: "coding",
          answerValueSet: GENDER_VALUE_SET,
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const html = await renderer.render();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(html).toContain("Male");
      expect(html).toContain("Female");
    } finally {
      renderer.dispose();
    }
  });

  it("processes answerValueSet option tokens after expansion", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-value-set-process",
      item: [
        {
          linkId: "gender",
          text: "Gender",
          type: "coding",
          answerValueSet: GENDER_VALUE_SET,
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const html = await renderer.render();
      const formData = hiddenFormData(html);
      formData.set(
        attributeFrom(html, "gender", "name"),
        optionValue(html, "Female"),
      );

      await renderer.process(formData);

      expect(renderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "gender",
          text: "Gender",
          answer: [
            {
              valueCoding: {
                system: "http://example.test/gender",
                code: "female",
                display: "Female",
              },
            },
          ],
        },
      ]);
    } finally {
      renderer.dispose();
    }
  });

  it("processes answerValueSet option tokens with a fresh stateless renderer", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-value-set-stateless-process",
      item: [
        {
          linkId: "gender",
          text: "Gender",
          type: "coding",
          answerValueSet: GENDER_VALUE_SET,
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(
      html,
      [["gender", optionValue(html, "Female")]],
      questionnaire,
    );

    expect(response.item).toEqual([
      {
        linkId: "gender",
        text: "Gender",
        answer: [
          {
            valueCoding: {
              system: "http://example.test/gender",
              code: "female",
              display: "Female",
            },
          },
        ],
      },
    ]);
  });

  it("re-expands expression-driven answerValueSet options after submitted answers change", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-value-set-expression",
      item: [
        {
          linkId: "use-contact",
          text: "Use contact methods",
          type: "boolean",
          initial: [{ valueBoolean: false }],
        },
        {
          linkId: "choice",
          text: "Choice",
          type: "coding",
          _answerValueSet: {
            extension: [
              answerValueSetExpression(
                `iif(%resource.item.where(linkId='use-contact').answer.valueBoolean.last() = true, '${CONTACT_VALUE_SET}', '${GENDER_VALUE_SET}')`,
              ),
            ],
          },
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const html = await renderer.render();
      const formData = hiddenFormData(html);
      formData.set(attributeFrom(html, "use-contact", "name"), "true");

      await renderer.process(formData);
      const updated = await renderer.render();

      expect(updated).toContain("Phone");
      expect(updated).toContain("Email");
      expect(updated).not.toContain("Male");
    } finally {
      renderer.dispose();
    }
  });

  it("renders an issue when answerValueSetExpression is not a canonical URL", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-value-set-expression-issue",
      item: [
        {
          linkId: "choice",
          text: "Choice",
          type: "coding",
          _answerValueSet: {
            extension: [answerValueSetExpression("true")],
          },
        },
      ],
    };
    const html = await render(questionnaire);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(html).toContain(
      "answerValueSetExpression must evaluate to a canonical URL string.",
    );
  });

  it("serializes R4 choice answers as Coding values", async () => {
    const questionnaire: QuestionnaireR4 = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-r4-choice",
      item: [
        {
          linkId: "contact",
          text: "Preferred contact",
          type: "choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "phone",
                display: "Phone",
              },
            },
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "email",
                display: "Email",
              },
            },
          ],
        },
      ],
    };
    const html = await renderR4(questionnaire);

    expect(
      await processR4(
        html,
        [["contact", optionValue(html, "Phone")]],
        questionnaire,
      ),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htmx-r4-choice",
      item: [
        {
          linkId: "contact",
          text: "Preferred contact",
          answer: [
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "phone",
                display: "Phone",
              },
            },
          ],
        },
      ],
    });
  });

  it("serializes R4 open-choice custom answers as string values", async () => {
    const questionnaire: QuestionnaireR4 = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-r4-open-choice",
      item: [
        {
          linkId: "contact",
          text: "Preferred contact",
          type: "open-choice",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/contact",
                code: "phone",
                display: "Phone",
              },
            },
          ],
        },
      ],
    };
    const html = await renderR4(questionnaire);

    expect(
      await processR4(html, [["contact", "Pager"]], questionnaire),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htmx-r4-open-choice",
      item: [
        {
          linkId: "contact",
          text: "Preferred contact",
          answer: [{ valueString: "Pager" }],
        },
      ],
    });
  });
});

function buildFetchResponse(contains: Coding[]) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
      Promise.resolve({
        expansion: {
          contains,
        },
      }),
  } as Response;
}

function getRequestUrl(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function getRequestedCanonical(input: Parameters<typeof fetch>[0]): string {
  return new URL(getRequestUrl(input)).searchParams.get("url") ?? "";
}
