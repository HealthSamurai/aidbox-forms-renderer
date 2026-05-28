import { describe, expect, it } from "vitest";

import {
  QuestionnaireRenderer,
  type QuestionnaireRendererOptions,
} from "../lib/index.ts";
import { defaultTemplates } from "./default-templates.ts";

import type { QuestionnaireOf, QuestionnaireResponseOf } from "@formbox/fhir";

type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type TestRendererOptions = Omit<
  QuestionnaireRendererOptions<"r5">,
  "templates" | "token"
> & {
  readonly templates?: Partial<QuestionnaireRendererOptions<"r5">["templates"]>;
  readonly token?: string | undefined;
};
type ResponseItem = NonNullable<QuestionnaireResponse["item"]>[number];

const hiddenUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden";
const itemControlUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const itemControlSystem = "http://hl7.org/fhir/questionnaire-item-control";
const usageModeUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-usageMode";
const enableWhenExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression";

function itemControl(code: string) {
  return {
    url: itemControlUrl,
    valueCodeableConcept: {
      coding: [{ system: itemControlSystem, code }],
    },
  };
}

function usageMode(code: string) {
  return {
    url: usageModeUrl,
    valueCode: code,
  };
}

function enableWhenExpression(expression: string) {
  return {
    url: enableWhenExpressionUrl,
    valueExpression: {
      language: "text/fhirpath",
      expression,
    },
  };
}

function withRenderer<T>(
  options: TestRendererOptions,
  run: (renderer: QuestionnaireRenderer<"r5">) => T | Promise<T>,
): Promise<T> {
  const { templates, ...rendererOptions } = options;
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: { ...defaultTemplates, ...templates },
    ...rendererOptions,
  });
  return Promise.resolve()
    .then(() => run(renderer))
    .finally(() => {
      renderer.dispose();
    });
}

async function renderQuestionnaire(
  options: TestRendererOptions,
): Promise<string> {
  return await withRenderer(options, (renderer) => renderer.render());
}

async function responseFromFormData(
  formData: FormData,
  options: TestRendererOptions,
): Promise<QuestionnaireResponse> {
  return await withRenderer(options, async (renderer) => {
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  });
}

async function processAndRender(
  formData: FormData,
  options: TestRendererOptions,
): Promise<string> {
  return await withRenderer(options, async (renderer) => {
    await renderer.process(formData);
    return await renderer.render();
  });
}

function attributeFrom(
  html: string,
  linkId: string,
  attribute: string,
  field = "value",
): string {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const escapedField = escapeRegExp(encodeURIComponent(field));
  const pattern = new RegExp(
    String.raw`<[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\bdata-fb-field="${escapedField}"[^>]*\b${attribute}="([^"]+)"`,
    "u",
  );
  const match = pattern.exec(html);
  if (!match?.[1]) {
    throw new Error(`Missing ${attribute} for ${linkId}.${field} in ${html}`);
  }

  return decodeEntities(match[1]);
}

function attributeValuesFrom(
  html: string,
  linkId: string,
  attribute: string,
  field: string,
): string[] {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const escapedField = escapeRegExp(encodeURIComponent(field));
  const pattern = new RegExp(
    String.raw`<[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\bdata-fb-field="${escapedField}"[^>]*\b${attribute}="([^"]+)"`,
    "gu",
  );

  return [...html.matchAll(pattern)].map((match) =>
    decodeEntities(match[1] ?? ""),
  );
}

function formDataFromHtml(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
): FormData {
  const formData = hiddenFormData(html);
  for (const [linkId, value] of entries) {
    formData.append(attributeFrom(html, linkId, "name"), value);
  }
  return formData;
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

function inputValuesFrom(html: string, linkId: string, type: string): string[] {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const escapedType = escapeRegExp(type);
  const pattern = new RegExp(
    String.raw`<input[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\btype="${escapedType}"[^>]*\bvalue="([^"]+)"`,
    "gu",
  );

  return [...html.matchAll(pattern)].map((match) =>
    decodeEntities(match[1] ?? ""),
  );
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

function findItem(
  items: readonly ResponseItem[] | undefined,
  linkId: string,
): ResponseItem {
  const item = items?.find((candidate) => candidate.linkId === linkId);
  if (!item) {
    throw new Error(`Missing response item ${linkId}`);
  }
  return item;
}

function firstAnswer(
  item: ResponseItem,
): NonNullable<ResponseItem["answer"]>[number] {
  const answer = item.answer?.[0];
  if (!answer) {
    throw new Error(`Missing response answer for ${item.linkId}`);
  }
  return answer;
}

describe("@formbox/htmx spec coverage", () => {
  it("includes display items in QuestionnaireResponse output", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/display-response",
      item: [
        {
          linkId: "intro",
          text: "Introduction",
          type: "display",
        },
        {
          linkId: "ack",
          text: "Do you acknowledge?",
          type: "boolean",
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await responseFromFormData(
      formDataFromHtml(html, [["ack", "true"]]),
      {
        questionnaire,
        fhirVersion: "r5",
      },
    );

    expect(response.item).toEqual([
      {
        linkId: "intro",
        text: "Introduction",
      },
      {
        linkId: "ack",
        text: "Do you acknowledge?",
        answer: [{ valueBoolean: true }],
      },
    ]);
  });

  it("ignores nested items under display entries", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/display-children",
      item: [
        {
          linkId: "intro",
          text: "Introduction",
          type: "display",
          item: [
            {
              linkId: "child",
              text: "Child question",
              type: "string",
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(html);
    formData.append("fb[answer][intro][child][value]", "tampered");
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).not.toContain("Child question");
    expect(response.item).toEqual([
      {
        linkId: "intro",
        text: "Introduction",
      },
    ]);
  });

  it("renders page-control structure issues", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/page-structure-issue",
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControl("page")],
        },
        {
          linkId: "question-1",
          text: "Loose question",
          type: "string",
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("linkId=question-1");
  });

  it("omits QuestionnaireResponse.item when no answerable content is populated", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-empty-response",
      item: [{ linkId: "notes", text: "Notes", type: "text" }],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await responseFromFormData(hiddenFormData(html), {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response).toEqual({
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-empty-response",
      status: "in-progress",
    });
  });

  it("omits empty repeated group rows from QuestionnaireResponse", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-empty-repeated-group-response",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          item: [{ linkId: "condition", text: "Condition", type: "string" }],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const addData = hiddenFormData(initialHtml);
    addData.append(
      "fb[action]",
      attributeFrom(initialHtml, "family-history", "value", "add-action"),
    );
    const addedHtml = await processAndRender(addData, {
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await responseFromFormData(hiddenFormData(addedHtml), {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(addedHtml).toContain('data-fb-link-id="condition"');
    expect(response).toEqual({
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-empty-repeated-group-response",
      status: "in-progress",
    });
  });

  it("serializes multiple repeated group rows with nested answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-group-response",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          item: [{ linkId: "condition", text: "Condition", type: "string" }],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const firstAdd = hiddenFormData(initialHtml);
    firstAdd.append(
      "fb[action]",
      attributeFrom(initialHtml, "family-history", "value", "add-action"),
    );
    const oneRowHtml = await processAndRender(firstAdd, {
      questionnaire,
      fhirVersion: "r5",
    });
    const secondAdd = hiddenFormData(oneRowHtml);
    secondAdd.append(
      "fb[action]",
      attributeFrom(oneRowHtml, "family-history", "value", "add-action"),
    );
    const twoRowHtml = await processAndRender(secondAdd, {
      questionnaire,
      fhirVersion: "r5",
    });
    const conditionNames = attributeValuesFrom(
      twoRowHtml,
      "condition",
      "name",
      "value",
    );
    const [firstConditionName, secondConditionName] = conditionNames;
    if (!firstConditionName || !secondConditionName) {
      throw new Error(`Expected two condition inputs in ${twoRowHtml}`);
    }
    const formData = hiddenFormData(twoRowHtml);
    formData.set(firstConditionName, "Asthma");
    formData.set(secondConditionName, "Diabetes");
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(conditionNames).toHaveLength(2);
    expect(response.item).toEqual([
      {
        linkId: "family-history",
        text: "Family history",
        item: [
          {
            linkId: "condition",
            text: "Condition",
            answer: [{ valueString: "Asthma" }],
          },
        ],
      },
      {
        linkId: "family-history",
        text: "Family history",
        item: [
          {
            linkId: "condition",
            text: "Condition",
            answer: [{ valueString: "Diabetes" }],
          },
        ],
      },
    ]);
  });

  it("renders, submits, and serializes every supported answer item type", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/all-types",
      item: [
        { linkId: "string", text: "String", type: "string" },
        { linkId: "text", text: "Text", type: "text" },
        { linkId: "url", text: "URL", type: "url" },
        { linkId: "integer", text: "Integer", type: "integer" },
        { linkId: "decimal", text: "Decimal", type: "decimal" },
        { linkId: "boolean", text: "Boolean", type: "boolean" },
        { linkId: "date", text: "Date", type: "date" },
        { linkId: "date-time", text: "Date time", type: "dateTime" },
        { linkId: "time", text: "Time", type: "time" },
        { linkId: "coding", text: "Coding", type: "coding" },
        { linkId: "quantity", text: "Quantity", type: "quantity" },
        { linkId: "reference", text: "Reference", type: "reference" },
        { linkId: "attachment", text: "Attachment", type: "attachment" },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const coding = {
      system: "http://loinc.org",
      code: "1234-5",
      display: "Mock code",
    };
    const formData = formDataFromHtml(html, [
      ["string", "alpha"],
      ["text", "long text"],
      ["url", "https://example.org"],
      ["integer", "7"],
      ["decimal", "12.34"],
      ["boolean", "true"],
      ["date", "2024-05-01"],
      ["date-time", "2024-05-01T12:34:56Z"],
      ["time", "08:30:00"],
      ["coding", coding.code],
      ["quantity", "5"],
      ["reference", "Patient/123"],
    ]);
    formData.set(
      attributeFrom(html, "coding", "name", "system"),
      coding.system,
    );
    formData.set(
      attributeFrom(html, "coding", "name", "display"),
      coding.display,
    );
    formData.set(attributeFrom(html, "quantity", "name", "unit"), "mg");
    formData.set(attributeFrom(html, "reference", "name", "display"), "Alice");
    formData.append(
      attributeFrom(html, "attachment", "name"),
      new File(["scan"], "scan.txt", { type: "text/plain" }),
    );

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/all-types",
      item: [
        {
          linkId: "string",
          text: "String",
          answer: [{ valueString: "alpha" }],
        },
        {
          linkId: "text",
          text: "Text",
          answer: [{ valueString: "long text" }],
        },
        {
          linkId: "url",
          text: "URL",
          answer: [{ valueUri: "https://example.org" }],
        },
        {
          linkId: "integer",
          text: "Integer",
          answer: [{ valueInteger: 7 }],
        },
        {
          linkId: "decimal",
          text: "Decimal",
          answer: [{ valueDecimal: 12.34 }],
        },
        {
          linkId: "boolean",
          text: "Boolean",
          answer: [{ valueBoolean: true }],
        },
        { linkId: "date", text: "Date", answer: [{ valueDate: "2024-05-01" }] },
        {
          linkId: "date-time",
          text: "Date time",
          answer: [{ valueDateTime: "2024-05-01T12:34:56Z" }],
        },
        { linkId: "time", text: "Time", answer: [{ valueTime: "08:30:00" }] },
        { linkId: "coding", text: "Coding", answer: [{ valueCoding: coding }] },
        {
          linkId: "quantity",
          text: "Quantity",
          answer: [{ valueQuantity: { value: 5, unit: "mg" } }],
        },
        {
          linkId: "reference",
          text: "Reference",
          answer: [
            {
              valueReference: {
                reference: "Patient/123",
                display: "Alice",
              },
            },
          ],
        },
        {
          linkId: "attachment",
          text: "Attachment",
          answer: [
            {
              valueAttachment: {
                contentType: "text/plain",
                data: "c2Nhbg==",
                size: 4,
                title: "scan.txt",
              },
            },
          ],
        },
      ],
    });
  });

  it("renders unsupported question item types without serializing answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/unsupported-question-type",
      item: [
        {
          linkId: "unsupported",
          text: "Unsupported",
          type: "question",
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Unsupported type: question");
    expect(html).not.toContain('data-fb-link-id="unsupported"');
    expect(
      await responseFromFormData(hiddenFormData(html), {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/unsupported-question-type",
    });
  });

  it("ignores tampered submitted values for enabled read-only answer types", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/read-only-types",
      item: [
        { linkId: "string", text: "String", type: "string", readOnly: true },
        { linkId: "integer", text: "Integer", type: "integer", readOnly: true },
        { linkId: "boolean", text: "Boolean", type: "boolean", readOnly: true },
        { linkId: "coding", text: "Coding", type: "coding", readOnly: true },
        {
          linkId: "quantity",
          text: "Quantity",
          type: "quantity",
          readOnly: true,
        },
        {
          linkId: "attachment",
          text: "Attachment",
          type: "attachment",
          readOnly: true,
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/read-only-types",
      item: [
        { linkId: "string", answer: [{ valueString: "server" }] },
        { linkId: "integer", answer: [{ valueInteger: 7 }] },
        { linkId: "boolean", answer: [{ valueBoolean: true }] },
        {
          linkId: "coding",
          answer: [
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "server-code",
                display: "Server code",
              },
            },
          ],
        },
        {
          linkId: "quantity",
          answer: [
            {
              valueQuantity: {
                value: 5,
                unit: "mg",
                system: "http://unitsofmeasure.org",
                code: "mg",
              },
            },
          ],
        },
        {
          linkId: "attachment",
          answer: [
            {
              valueAttachment: {
                contentType: "text/plain",
                title: "server.txt",
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const formData = formDataFromHtml(html, [
      ["string", "client"],
      ["integer", "99"],
      ["boolean", "false"],
      ["coding", "client-code"],
      ["quantity", "99"],
    ]);
    formData.append(
      attributeFrom(html, "attachment", "name"),
      new File(["client"], "client.txt", { type: "text/plain" }),
    );

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        questionnaireResponse,
        fhirVersion: "r5",
      }),
    ).toEqual({
      ...questionnaireResponse,
      item: questionnaireResponse.item?.map((item) => ({
        ...item,
        text: findItem(questionnaire.item, item.linkId).text,
      })),
    });
  });

  it("ignores tampered read-only mirrors for empty read-only answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/read-only-empty-mirror",
      item: [
        { linkId: "secret", text: "Secret", type: "string", readOnly: true },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(html);
    formData.set("fb[readonly][secret]", "tampered");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/read-only-empty-mirror",
    });
  });

  it("preserves read-only option controls through browser-style form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/read-only-option-controls",
      item: [
        {
          linkId: "severity",
          text: "Severity",
          type: "coding",
          readOnly: true,
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/severity",
                code: "mild",
                display: "Mild",
              },
            },
            {
              valueCoding: {
                system: "http://example.test/severity",
                code: "severe",
                display: "Severe",
              },
            },
          ],
        },
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          readOnly: true,
          extension: [itemControl("check-box")],
          answerOption: [{ valueString: "Fever" }, { valueString: "Cough" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/read-only-option-controls",
      item: [
        {
          linkId: "severity",
          answer: [
            {
              valueCoding: {
                system: "http://example.test/severity",
                code: "severe",
                display: "Severe",
              },
            },
          ],
        },
        {
          linkId: "symptoms",
          answer: [{ valueString: "Fever" }, { valueString: "Cough" }],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const response = await responseFromFormData(hiddenFormData(html), {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      {
        linkId: "severity",
        text: "Severity",
        answer: [
          {
            valueCoding: {
              system: "http://example.test/severity",
              code: "severe",
              display: "Severe",
            },
          },
        ],
      },
      {
        linkId: "symptoms",
        text: "Symptoms",
        answer: [{ valueString: "Fever" }, { valueString: "Cough" }],
      },
    ]);
  });

  it("preserves hidden enabled answer child items through full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/hidden-answer-child",
      item: [
        {
          linkId: "parent",
          text: "Parent",
          type: "string",
          extension: [{ url: hiddenUrl, valueBoolean: true }],
          item: [{ linkId: "child", text: "Child", type: "string" }],
        },
        { linkId: "visible", text: "Visible", type: "string" },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden-answer-child",
      item: [
        {
          linkId: "parent",
          text: "Parent",
          answer: [
            {
              valueString: "parent value",
              item: [
                {
                  linkId: "child",
                  text: "Child",
                  answer: [{ valueString: "child value" }],
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const formData = formDataFromHtml(html, [["visible", "visible value"]]);
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(firstAnswer(findItem(response.item, "parent")).item).toEqual([
      {
        linkId: "child",
        text: "Child",
        answer: [{ valueString: "child value" }],
      },
    ]);
    expect(firstAnswer(findItem(response.item, "visible")).valueString).toBe(
      "visible value",
    );
  });

  it("keeps protected disabled complex values available across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/protected-disabled-complex",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          disabledDisplay: "protected",
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
        {
          linkId: "code",
          text: "Code",
          type: "coding",
          disabledDisplay: "protected",
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
        {
          linkId: "subject",
          text: "Subject",
          type: "reference",
          disabledDisplay: "protected",
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
        {
          linkId: "scan",
          text: "Scan",
          type: "attachment",
          disabledDisplay: "protected",
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/protected-disabled-complex",
      item: [
        { linkId: "gate", answer: [{ valueBoolean: false }] },
        {
          linkId: "dose",
          answer: [
            {
              valueQuantity: {
                value: 5,
                unit: "mg",
                system: "http://unitsofmeasure.org",
                code: "mg",
              },
            },
          ],
        },
        {
          linkId: "code",
          answer: [
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "1234-5",
                display: "Mock code",
              },
            },
          ],
        },
        {
          linkId: "subject",
          answer: [
            {
              valueReference: {
                reference: "Patient/123",
                display: "Alice",
              },
            },
          ],
        },
        {
          linkId: "scan",
          answer: [
            {
              valueAttachment: {
                contentType: "text/plain",
                data: "c2Nhbg==",
                size: 4,
                title: "scan.txt",
              },
            },
          ],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
      mode: "capture",
    });
    const disabledHtml = await processAndRender(
      formDataFromHtml(initialHtml, [["gate", "false"]]),
      { questionnaire, fhirVersion: "r5", mode: "capture" },
    );
    const enableData = hiddenFormData(disabledHtml);
    enableData.set(attributeFrom(disabledHtml, "gate", "name"), "true");
    const response = await responseFromFormData(enableData, {
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });

    expect(firstAnswer(findItem(response.item, "dose")).valueQuantity).toEqual({
      value: 5,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(firstAnswer(findItem(response.item, "code")).valueCoding).toEqual({
      system: "http://loinc.org",
      code: "1234-5",
      display: "Mock code",
    });
    expect(
      firstAnswer(findItem(response.item, "subject")).valueReference,
    ).toEqual({
      reference: "Patient/123",
      display: "Alice",
    });
    expect(
      firstAnswer(findItem(response.item, "scan")).valueAttachment,
    ).toEqual({
      contentType: "text/plain",
      data: "c2Nhbg==",
      size: 4,
      title: "scan.txt",
    });
  });

  it("serializes visible answer child items through full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/visible-answer-child",
      item: [
        {
          linkId: "allergy",
          text: "Allergy",
          type: "string",
          extension: [itemControl("radio-button")],
          answerOption: [{ valueString: "Peanut" }, { valueString: "Dust" }],
          item: [{ linkId: "reaction", text: "Reaction", type: "string" }],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = formDataFromHtml(html, [["reaction", "Hives"]]);
    formData.append(attributeFrom(html, "allergy", "name"), "Peanut");
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(firstAnswer(findItem(response.item, "allergy"))).toEqual({
      valueString: "Peanut",
      item: [
        {
          linkId: "reaction",
          text: "Reaction",
          answer: [{ valueString: "Hives" }],
        },
      ],
    });
  });

  it("serializes answer child items when the parent answer has no primitive value", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/answer-child-without-parent-value",
      item: [
        {
          linkId: "follow-up",
          text: "Provide follow-up detail",
          type: "string",
          item: [
            {
              linkId: "detail",
              text: "Detail",
              type: "text",
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await responseFromFormData(
      formDataFromHtml(html, [
        ["detail", "Allergies reviewed and no issues noted."],
      ]),
      {
        questionnaire,
        fhirVersion: "r5",
      },
    );

    expect(firstAnswer(findItem(response.item, "follow-up"))).toEqual({
      item: [
        {
          linkId: "detail",
          text: "Detail",
          answer: [
            {
              valueString: "Allergies reviewed and no issues noted.",
            },
          ],
        },
      ],
    });
  });

  it("serializes deep answer child groups through full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/deep-answer-child",
      item: [
        {
          linkId: "parent-question",
          text: "Root",
          type: "string",
          item: [
            {
              linkId: "child-group",
              text: "Child group",
              type: "group",
              item: [
                {
                  linkId: "grandchild-question",
                  text: "Leaf response",
                  type: "boolean",
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = formDataFromHtml(html, [
      ["parent-question", "Value"],
      ["grandchild-question", "true"],
    ]);
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(firstAnswer(findItem(response.item, "parent-question"))).toEqual({
      valueString: "Value",
      item: [
        {
          linkId: "child-group",
          text: "Child group",
          item: [
            {
              linkId: "grandchild-question",
              text: "Leaf response",
              answer: [{ valueBoolean: true }],
            },
          ],
        },
      ],
    });
  });

  it("scopes submitted child answers to repeated answer instances", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/repeated-answer-child-scope",
      item: [
        {
          linkId: "attendee",
          text: "Attendee",
          type: "string",
          repeats: true,
          item: [{ linkId: "contact", text: "Contact", type: "text" }],
        },
      ],
    };
    const initial = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const addData = hiddenFormData(initial);
    addData.append(
      "fb[action]",
      attributeFrom(initial, "attendee", "value", "add-action"),
    );
    const added = await processAndRender(addData, {
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(added);
    const attendeeNames = attributeValuesFrom(
      added,
      "attendee",
      "name",
      "value",
    );
    const contactNames = attributeValuesFrom(added, "contact", "name", "value");

    expect(attendeeNames).toHaveLength(2);
    expect(contactNames).toHaveLength(2);

    formData.set(attendeeNames[0] ?? "", "Alice");
    formData.set(contactNames[0] ?? "", "alice@example.org");
    formData.set(attendeeNames[1] ?? "", "Bob");
    formData.set(contactNames[1] ?? "", "bob@example.org");

    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(findItem(response.item, "attendee").answer).toEqual([
      {
        valueString: "Alice",
        item: [
          {
            linkId: "contact",
            text: "Contact",
            answer: [{ valueString: "alice@example.org" }],
          },
        ],
      },
      {
        valueString: "Bob",
        item: [
          {
            linkId: "contact",
            text: "Contact",
            answer: [{ valueString: "bob@example.org" }],
          },
        ],
      },
    ]);
  });

  it("recomputes enableWhenExpression from submitted answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/enable-expression",
      item: [
        {
          linkId: "age",
          text: "Age",
          type: "integer",
        },
        {
          linkId: "adult-note",
          text: "Adult note",
          type: "string",
          extension: [
            enableWhenExpression(
              "%resource.item.where(linkId='age').answer.valueInteger.last() >= 18",
            ),
          ],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const hiddenHtml = await processAndRender(
      formDataFromHtml(initialHtml, [["age", "17"]]),
      { questionnaire, fhirVersion: "r5" },
    );
    const visibleHtml = await processAndRender(
      formDataFromHtml(initialHtml, [["age", "18"]]),
      { questionnaire, fhirVersion: "r5" },
    );

    expect(hiddenHtml).not.toContain('data-fb-question="adult-note"');
    expect(visibleHtml).toContain('data-fb-question="adult-note"');
  });

  it("renders supported item controls with named controls or explicit static fallback", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/item-controls",
      item: [
        {
          linkId: "list",
          text: "List",
          type: "group",
          extension: [itemControl("list")],
          item: [{ linkId: "list-child", text: "List child", type: "string" }],
        },
        {
          linkId: "grid",
          text: "Grid",
          type: "group",
          extension: [itemControl("grid")],
          item: [
            {
              linkId: "row",
              text: "Row",
              type: "group",
              item: [
                { linkId: "grid-child", text: "Grid child", type: "string" },
              ],
            },
          ],
        },
        {
          linkId: "table",
          text: "Table",
          type: "group",
          extension: [itemControl("table")],
          item: [
            {
              linkId: "table-choice",
              text: "Table choice",
              type: "coding",
              answerOption: [
                { valueCoding: { code: "yes", display: "Yes" } },
                { valueCoding: { code: "no", display: "No" } },
              ],
            },
          ],
        },
        {
          linkId: "htable",
          text: "HTable",
          type: "group",
          extension: [itemControl("htable")],
          item: [
            {
              linkId: "htable-choice",
              text: "HTable choice",
              type: "coding",
              answerOption: [
                { valueCoding: { code: "yes", display: "Yes" } },
                { valueCoding: { code: "no", display: "No" } },
              ],
            },
          ],
        },
        {
          linkId: "gtable",
          text: "GTable",
          type: "group",
          repeats: true,
          extension: [itemControl("gtable")],
          item: [
            { linkId: "gtable-child", text: "GTable child", type: "string" },
          ],
        },
        {
          linkId: "tabs",
          text: "Tabs",
          type: "group",
          extension: [itemControl("tab-container")],
          item: [
            {
              linkId: "tab-one",
              text: "Tab one",
              type: "group",
              item: [
                { linkId: "tab-child", text: "Tab child", type: "string" },
              ],
            },
            {
              linkId: "tab-two",
              text: "Tab two",
              type: "group",
              item: [
                {
                  linkId: "tab-child-two",
                  text: "Tab child two",
                  type: "string",
                },
              ],
            },
          ],
        },
        {
          linkId: "dropdown",
          text: "Dropdown",
          type: "coding",
          extension: [itemControl("drop-down")],
          answerOption: [{ valueCoding: { code: "a", display: "A" } }],
        },
        {
          linkId: "radio",
          text: "Radio",
          type: "coding",
          extension: [itemControl("radio-button")],
          answerOption: [{ valueCoding: { code: "b", display: "B" } }],
        },
        {
          linkId: "checkbox",
          text: "Checkbox",
          type: "coding",
          repeats: true,
          extension: [itemControl("check-box")],
          answerOption: [{ valueCoding: { code: "c", display: "C" } }],
        },
        {
          linkId: "autocomplete",
          text: "Autocomplete",
          type: "coding",
          extension: [itemControl("autocomplete")],
          answerOption: [{ valueCoding: { code: "d", display: "D" } }],
        },
        {
          linkId: "lookup",
          text: "Lookup",
          type: "coding",
          extension: [itemControl("lookup")],
          answerOption: [{ valueCoding: { code: "e", display: "E" } }],
        },
        {
          linkId: "slider",
          text: "Slider",
          type: "integer",
          extension: [itemControl("slider")],
        },
        {
          linkId: "spinner",
          text: "Spinner",
          type: "decimal",
          extension: [itemControl("spinner")],
        },
        {
          linkId: "textbox",
          text: "Textbox",
          type: "string",
          extension: [itemControl("text-box")],
        },
        {
          linkId: "display",
          text: "Inline display",
          type: "display",
          extension: [itemControl("inline")],
        },
        {
          linkId: "display-controls",
          text: "Display controls",
          type: "string",
          item: [
            {
              linkId: "prompt",
              text: "Prompt text",
              type: "display",
              extension: [itemControl("prompt")],
            },
            {
              linkId: "help",
              text: "Help text",
              type: "display",
              extension: [itemControl("help")],
            },
            {
              linkId: "legal",
              text: "Legal text",
              type: "display",
              extension: [itemControl("legal")],
            },
            {
              linkId: "flyover",
              text: "Flyover text",
              type: "display",
              extension: [itemControl("flyover")],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const pageHtml = await renderQuestionnaire({
      fhirVersion: "r5",
      questionnaire: {
        resourceType: "Questionnaire",
        status: "active",
        url: "Questionnaire/page-controls",
        item: [
          {
            linkId: "header",
            text: "Header",
            type: "group",
            extension: [itemControl("header")],
          },
          {
            linkId: "page-1",
            text: "Page 1",
            type: "group",
            extension: [itemControl("page")],
            item: [
              { linkId: "page-child", text: "Page child", type: "string" },
            ],
          },
          {
            linkId: "footer",
            text: "Footer",
            type: "group",
            extension: [itemControl("footer")],
          },
        ],
      },
    });

    expect(pageHtml).toContain("Header");
    expect(pageHtml).toContain("Footer");
    expect(pageHtml).toContain("Page 1");
    expect(pageHtml).toContain("<nav>");
    expect(html).toContain("<table>");
    expect(html).toContain("Tab child");
    expect(html).toContain("Prompt text");
    expect(html).toContain("Help text");
    expect(html).toContain("Legal text");
    expect(html).toContain("Flyover text");
    expect(html).toContain('type="range"');
    expect(html).toContain('type="number"');
    expect(html).toContain("<select");
    expect(html).toContain('type="radio"');
    expect(html).toContain('type="checkbox"');
    expect(attributeFrom(html, "table-choice", "name")).toBe(
      "fb[answer][table][table-choice][value]",
    );
    expect(attributeFrom(html, "htable-choice", "name")).toBe(
      "fb[answer][htable][htable-choice][value]",
    );
    expect(attributeFrom(html, "textbox", "name")).toBe(
      "fb[answer][textbox][value]",
    );
  });

  it("ignores invalid itemControl configurations", async () => {
    const html = await renderQuestionnaire({
      fhirVersion: "r5",
      questionnaire: {
        resourceType: "Questionnaire",
        status: "active",
        url: "Questionnaire/invalid-item-controls",
        item: [
          {
            linkId: "bad-system",
            text: "Bad system",
            type: "coding",
            extension: [
              {
                url: itemControlUrl,
                valueCodeableConcept: {
                  coding: [
                    {
                      system: "http://example.com/controls",
                      code: "radio-button",
                    },
                  ],
                },
              },
            ],
            answerOption: [{ valueCoding: { code: "a", display: "A" } }],
          },
          {
            linkId: "question-header",
            text: "Question header",
            type: "string",
            extension: [itemControl("header")],
          },
          {
            linkId: "group-radio",
            text: "Group radio",
            type: "group",
            extension: [itemControl("radio-button")],
            item: [
              {
                linkId: "group-child",
                text: "Group child",
                type: "string",
              },
            ],
          },
        ],
      },
    });

    expect(html).toContain("<select");
    expect(html).not.toContain('data-fb-link-id="bad-system" type="radio"');
    expect(attributeFrom(html, "question-header", "name")).toBe(
      "fb[answer][question-header][value]",
    );
    expect(attributeFrom(html, "group-child", "name")).toBe(
      "fb[answer][group-radio][group-child][value]",
    );
  });

  it("switches tab-container panels and preserves inactive tab answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/tab-container-post",
      item: [
        {
          linkId: "tabs",
          text: "Sections",
          type: "group",
          extension: [itemControl("tab-container")],
          item: [
            {
              linkId: "history",
              text: "History",
              type: "group",
              item: [
                {
                  linkId: "history-note",
                  text: "History note",
                  type: "string",
                },
              ],
            },
            {
              linkId: "medications",
              text: "Medications",
              type: "group",
              item: [
                {
                  linkId: "medication-name",
                  text: "Medication name",
                  type: "string",
                },
              ],
            },
          ],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const tabActions = attributeValuesFrom(
      initialHtml,
      "tabs",
      "value",
      "tab-action",
    );
    const medicationAction = tabActions[1];
    if (!medicationAction) {
      throw new Error(`Missing medication tab action in ${initialHtml}`);
    }

    const switchData = formDataFromHtml(initialHtml, [
      ["history-note", "asthma"],
    ]);
    switchData.append("fb[action]", medicationAction);
    const medicationHtml = await processAndRender(switchData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(medicationHtml).toContain("Medication name");
    expect(medicationHtml).toContain('value="asthma"');

    const response = await responseFromFormData(
      formDataFromHtml(medicationHtml, [["medication-name", "albuterol"]]),
      { questionnaire, fhirVersion: "r5" },
    );

    expect(response.item).toEqual([
      {
        linkId: "tabs",
        text: "Sections",
        item: [
          {
            linkId: "history",
            text: "History",
            item: [
              {
                linkId: "history-note",
                text: "History note",
                answer: [{ valueString: "asthma" }],
              },
            ],
          },
          {
            linkId: "medications",
            text: "Medications",
            item: [
              {
                linkId: "medication-name",
                text: "Medication name",
                answer: [{ valueString: "albuterol" }],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("supports repeated selection-table check-box cells with option-token submission", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/repeating-table-submit",
      item: [
        {
          linkId: "table",
          text: "Table",
          type: "group",
          extension: [itemControl("table")],
          item: [
            {
              linkId: "choice",
              text: "Choice",
              type: "coding",
              repeats: true,
              answerOption: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "alpha",
                    display: "Alpha",
                  },
                },
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "beta",
                    display: "Beta",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(html);
    const name = attributeFrom(html, "choice", "name");
    const values = inputValuesFrom(html, "choice", "checkbox");

    expect(values).toHaveLength(2);
    for (const value of values) {
      formData.append(name, value);
    }

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/repeating-table-submit",
      item: [
        {
          linkId: "table",
          text: "Table",
          item: [
            {
              linkId: "choice",
              text: "Choice",
              answer: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "alpha",
                    display: "Alpha",
                  },
                },
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "beta",
                    display: "Beta",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("removes repeated gtable rows through HTMX actions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/gtable-remove",
      item: [
        {
          linkId: "visit",
          text: "Visit",
          type: "group",
          repeats: true,
          extension: [itemControl("gtable")],
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/gtable-remove",
      item: [
        {
          linkId: "visit",
          text: "Visit",
          item: [
            {
              linkId: "note",
              text: "Note",
              answer: [{ valueString: "first" }],
            },
          ],
        },
        {
          linkId: "visit",
          text: "Visit",
          item: [
            {
              linkId: "note",
              text: "Note",
              answer: [{ valueString: "second" }],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const removeAction = attributeFrom(html, "visit", "value", "remove-action");
    const formData = hiddenFormData(html);
    formData.append("fb[action]", removeAction);
    const response = await responseFromFormData(formData, {
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      {
        linkId: "visit",
        text: "Visit",
        item: [
          {
            linkId: "note",
            text: "Note",
            answer: [{ valueString: "second" }],
          },
        ],
      },
    ]);
  });

  it("renders lower, upper, and unit display controls around sliders", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/slider-labels",
      item: [
        {
          linkId: "pain",
          text: "Pain score",
          type: "integer",
          extension: [itemControl("slider")],
          item: [
            {
              linkId: "lower",
              text: "No pain",
              type: "display",
              extension: [itemControl("lower")],
            },
            {
              linkId: "upper",
              text: "Worst pain",
              type: "display",
              extension: [itemControl("upper")],
            },
            {
              linkId: "unit",
              text: "points",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain('type="range"');
    expect(html).toContain("No pain");
    expect(html).toContain("Worst pain");
    expect(html).toContain("points");
  });

  it("serializes radio-button table controls when selected through submitted form data", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/table-submit",
      item: [
        {
          linkId: "table",
          text: "Table",
          type: "group",
          extension: [itemControl("table")],
          item: [
            {
              linkId: "choice",
              text: "Choice",
              type: "coding",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "yes",
                    display: "Yes",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = formDataFromHtml(html, [
      [
        "choice",
        JSON.stringify({
          system: "http://example.test/choice",
          code: "yes",
          display: "Yes",
        }),
      ],
    ]);

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/table-submit",
      item: [
        {
          linkId: "table",
          text: "Table",
          item: [
            {
              linkId: "choice",
              text: "Choice",
              answer: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "yes",
                    display: "Yes",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("serializes table controls backed by string answerOption values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/string-table-submit",
      item: [
        {
          linkId: "matrix",
          text: "Matrix",
          type: "group",
          extension: [itemControl("table")],
          item: [
            {
              linkId: "question-1",
              text: "Question 1",
              type: "string",
              answerOption: [{ valueString: "Yes" }, { valueString: "No" }],
            },
            {
              linkId: "question-2",
              text: "Question 2",
              type: "string",
              answerOption: [{ valueString: "Yes" }, { valueString: "No" }],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(html);
    const questionOneValues = inputValuesFrom(html, "question-1", "radio");
    const questionTwoValues = inputValuesFrom(html, "question-2", "radio");
    const [questionOneYes] = questionOneValues;
    const [, questionTwoNo] = questionTwoValues;
    if (!questionOneYes || !questionTwoNo) {
      throw new Error(`Expected table option tokens in ${html}`);
    }
    formData.set(attributeFrom(html, "question-1", "name"), questionOneYes);
    formData.set(attributeFrom(html, "question-2", "name"), questionTwoNo);

    expect(html).toContain("<table>");
    expect(html).toContain(">Yes</span>");
    expect(html).toContain(">Question 1</span>");
    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/string-table-submit",
      item: [
        {
          linkId: "matrix",
          text: "Matrix",
          item: [
            {
              linkId: "question-1",
              text: "Question 1",
              answer: [{ valueString: "Yes" }],
            },
            {
              linkId: "question-2",
              text: "Question 2",
              answer: [{ valueString: "No" }],
            },
          ],
        },
      ],
    });
  });

  it("serializes htable controls when selected through submitted option tokens", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htable-submit",
      item: [
        {
          linkId: "matrix",
          text: "Matrix",
          type: "group",
          extension: [itemControl("htable")],
          item: [
            {
              linkId: "question-1",
              text: "Question 1",
              type: "coding",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "yes",
                    display: "Yes",
                  },
                },
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "no",
                    display: "No",
                  },
                },
              ],
            },
            {
              linkId: "question-2",
              text: "Question 2",
              type: "coding",
              answerOption: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "yes",
                    display: "Yes",
                  },
                },
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "no",
                    display: "No",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(html);
    const questionOneValues = inputValuesFrom(html, "question-1", "radio");
    const questionTwoValues = inputValuesFrom(html, "question-2", "radio");
    const [questionOneYes] = questionOneValues;
    const [, questionTwoNo] = questionTwoValues;
    if (!questionOneYes || !questionTwoNo) {
      throw new Error(`Expected htable option tokens in ${html}`);
    }
    formData.set(attributeFrom(html, "question-1", "name"), questionOneYes);
    formData.set(attributeFrom(html, "question-2", "name"), questionTwoNo);

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htable-submit",
      item: [
        {
          linkId: "matrix",
          text: "Matrix",
          item: [
            {
              linkId: "question-1",
              text: "Question 1",
              answer: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "yes",
                    display: "Yes",
                  },
                },
              ],
            },
            {
              linkId: "question-2",
              text: "Question 2",
              answer: [
                {
                  valueCoding: {
                    system: "http://example.test/choice",
                    code: "no",
                    display: "No",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("applies usageMode variants to capture and display rendering", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/usage-mode",
      item: [
        {
          linkId: "capture",
          text: "Capture",
          type: "string",
          extension: [usageMode("capture")],
        },
        {
          linkId: "display",
          text: "Display",
          type: "string",
          extension: [usageMode("display")],
        },
        {
          linkId: "display-filled",
          text: "Display filled",
          type: "string",
          extension: [usageMode("display-non-empty")],
        },
        {
          linkId: "capture-display",
          text: "Capture display",
          type: "string",
          extension: [usageMode("capture-display")],
        },
        {
          linkId: "hybrid",
          text: "Hybrid",
          type: "string",
          extension: [usageMode("capture-display-non-empty")],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      questionnaire: "Questionnaire/usage-mode",
      item: [
        { linkId: "display-filled", answer: [{ valueString: "filled" }] },
        { linkId: "hybrid", answer: [{ valueString: "hybrid" }] },
      ],
    };
    const captureHtml = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
      mode: "capture",
    });
    const displayHtml = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
      mode: "display",
    });

    expect(captureHtml).toContain('data-fb-question="capture"');
    expect(captureHtml).not.toContain('data-fb-question="display"');
    expect(captureHtml).toContain('data-fb-question="capture-display"');
    expect(captureHtml).toContain('data-fb-question="hybrid"');
    expect(displayHtml).not.toContain('data-fb-question="capture"');
    expect(displayHtml).toContain('data-fb-question="display"');
    expect(displayHtml).toContain('data-fb-question="display-filled"');
    expect(displayHtml).toContain('data-fb-question="capture-display"');
    expect(displayHtml).toContain('data-fb-question="hybrid"');
  });

  it("infers display usageMode from completed responses and child answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/usage-mode-inferred-display",
      item: [
        {
          linkId: "display-only",
          text: "Display only",
          type: "string",
          extension: [usageMode("display")],
        },
        {
          linkId: "section",
          text: "Section",
          type: "group",
          extension: [usageMode("display-non-empty")],
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse: {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        questionnaire: "Questionnaire/usage-mode-inferred-display",
        item: [
          { linkId: "display-only", answer: [{ valueString: "ready" }] },
          {
            linkId: "section",
            item: [{ linkId: "note", answer: [{ valueString: "present" }] }],
          },
        ],
      },
      fhirVersion: "r5",
    });

    expect(html).toContain('data-fb-question="display-only"');
    expect(html).toContain('data-fb-link-id="section"');
    expect(html).toContain('data-fb-question="note"');
  });

  it("ignores unknown usageMode values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/usage-mode-unknown",
      item: [
        {
          linkId: "bad-mode",
          text: "Bad mode",
          type: "string",
          extension: [usageMode("invalid-mode")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });

    expect(html).toContain('data-fb-question="bad-mode"');
    expect(html).toContain("Bad mode");
    expect(html).not.toContain("invalid-mode");
  });
});
