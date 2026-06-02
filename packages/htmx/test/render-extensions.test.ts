import { describe, expect, it } from "vitest";
import strings from "@formbox/strings";

import {
  QuestionnaireRenderer,
  type QuestionnaireRendererOptions,
} from "../lib/index.ts";
import { searchName } from "../lib/template.ts";
import { defaultTemplates } from "./default-templates.ts";

import type {
  ElementOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";

type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type Element = ElementOf<"r5">;

const itemControlUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const itemControlSystem = "http://hl7.org/fhir/questionnaire-item-control";
const choiceOrientationUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-choiceOrientation";
const collapsibleUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-collapsible";
const entryFormatUrl = "http://hl7.org/fhir/StructureDefinition/entryFormat";
const itemMediaUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemMedia";
const itemAnswerMediaUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemAnswerMedia";
const keyboardTypeUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-keyboard";
const minValueUrl = "http://hl7.org/fhir/StructureDefinition/minValue";
const maxValueUrl = "http://hl7.org/fhir/StructureDefinition/maxValue";
const maxDecimalPlacesUrl =
  "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces";
const minQuantityUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity";
const maxQuantityUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity";
const mimeTypeUrl = "http://hl7.org/fhir/StructureDefinition/mimeType";
const minLengthUrl = "http://hl7.org/fhir/StructureDefinition/minLength";
const unitUrl = "http://hl7.org/fhir/StructureDefinition/questionnaire-unit";
const shortTextUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-shortText";
const openLabelUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-openLabel";
const optionPrefixUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-optionPrefix";
const sliderStepValueUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue";
const supportHyperlinkUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-supportHyperlink";
const supportLinkUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-supportLink";
const translationUrl = "http://hl7.org/fhir/StructureDefinition/translation";
const widthUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-width";

function itemControl(code: string) {
  return {
    url: itemControlUrl,
    valueCodeableConcept: {
      coding: [{ system: itemControlSystem, code }],
    },
  };
}

function choiceOrientation(code: "horizontal" | "vertical") {
  return {
    url: choiceOrientationUrl,
    valueCode: code,
  };
}

function collapsible(code: string) {
  return {
    url: collapsibleUrl,
    valueCode: code,
  };
}

function keyboardType(code: string) {
  return {
    url: keyboardTypeUrl,
    valueCoding: {
      system: "http://hl7.org/fhir/uv/sdc/ValueSet/keyboardType",
      code,
    },
  };
}

function maxDecimalPlaces(value: number) {
  return {
    url: maxDecimalPlacesUrl,
    valueInteger: value,
  };
}

function minQuantity(value: number, unit: string) {
  return {
    url: minQuantityUrl,
    valueQuantity: {
      value,
      unit,
      system: "http://unitsofmeasure.org",
      code: unit,
    },
  };
}

function maxQuantity(value: number, unit: string) {
  return {
    url: maxQuantityUrl,
    valueQuantity: {
      value,
      unit,
      system: "http://unitsofmeasure.org",
      code: unit,
    },
  };
}

function mimeType(code: string) {
  return {
    url: mimeTypeUrl,
    valueCode: code,
  };
}

function minLength(value: number) {
  return {
    url: minLengthUrl,
    valueInteger: value,
  };
}

function width(value: number, code?: "%") {
  return {
    url: widthUrl,
    valueQuantity:
      code === "%"
        ? {
            value,
            code,
            system: "http://unitsofmeasure.org",
          }
        : { value },
  };
}

function translation(language: string, content: string) {
  return {
    url: translationUrl,
    extension: [
      { url: "lang", valueCode: language },
      { url: "content", valueString: content },
    ],
  };
}

function translatedElement(language: string, content: string): Element {
  return { extension: [translation(language, content)] };
}

function stringExtensionValue(extension: unknown): string | undefined {
  return typeof extension === "object" &&
    extension !== null &&
    "valueString" in extension &&
    typeof extension.valueString === "string"
    ? extension.valueString
    : undefined;
}

async function render(
  questionnaire: Questionnaire,
  options?: Omit<
    QuestionnaireRendererOptions<"r5">,
    "questionnaire" | "fhirVersion" | "templates" | "token"
  > & {
    readonly templates?: Partial<
      QuestionnaireRendererOptions<"r5">["templates"]
    >;
  },
): Promise<string> {
  const { templates, ...rendererOptions } = options ?? {};
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: { ...defaultTemplates, ...templates },
    questionnaire,
    fhirVersion: "r5",
    ...rendererOptions,
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function processAndRender(
  questionnaire: Questionnaire,
  formData: FormData,
  options?: Omit<
    QuestionnaireRendererOptions<"r5">,
    "questionnaire" | "fhirVersion" | "templates" | "token"
  > & {
    readonly templates?: Partial<
      QuestionnaireRendererOptions<"r5">["templates"]
    >;
  },
): Promise<string> {
  const { templates, ...rendererOptions } = options ?? {};
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: { ...defaultTemplates, ...templates },
    questionnaire,
    fhirVersion: "r5",
    ...rendererOptions,
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
  options?: Omit<
    QuestionnaireRendererOptions<"r5">,
    "questionnaire" | "fhirVersion" | "templates" | "token"
  > & {
    readonly templates?: Partial<
      QuestionnaireRendererOptions<"r5">["templates"]
    >;
  },
): Promise<QuestionnaireResponse> {
  const { templates, ...rendererOptions } = options ?? {};
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: { ...defaultTemplates, ...templates },
    questionnaire,
    fhirVersion: "r5",
    ...rendererOptions,
  });
  try {
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

function decodeEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function requiredMatch(pattern: RegExp, html: string): RegExpExecArray {
  const match = pattern.exec(html);
  if (!match) {
    throw new Error(`Missing match ${pattern} in ${html}`);
  }

  return match;
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function expectUnitDescription(
  html: string,
  linkId: string,
  unit: string,
): void {
  const input = requiredMatch(
    new RegExp(
      String.raw`<input[^>]*data-fb-link-id="${escapeRegExp(linkId)}"[^>]*>`,
      "u",
    ),
    html,
  )[0];
  const unitId = requiredMatch(
    new RegExp(
      String.raw`<span id="([^"]+)">${escapeRegExp(unit)}</span>`,
      "u",
    ),
    html,
  )[1];
  const describedBy = requiredMatch(/aria-describedby="([^"]+)"/u, input)[1];

  expect(unitId).toBeDefined();
  expect(describedBy?.split(" ")).toContain(unitId);
}

describe("@formbox/htmx render extension parity", () => {
  it("renders form issues for invalid page, header, and footer structure", async () => {
    const html = await render({
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-invalid-form-structure",
      item: [
        {
          linkId: "header-1",
          text: "Header 1",
          type: "group",
          extension: [itemControl("header")],
        },
        {
          linkId: "header-2",
          text: "Header 2",
          type: "group",
          extension: [itemControl("header")],
        },
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControl("page")],
        },
        {
          linkId: "loose",
          text: "Loose question",
          type: "string",
        },
        {
          linkId: "footer-1",
          text: "Footer 1",
          type: "group",
          extension: [itemControl("footer")],
        },
        {
          linkId: "footer-2",
          text: "Footer 2",
          type: "group",
          extension: [itemControl("footer")],
        },
      ],
    });

    expect(html).toContain("linkId=loose");
    expect(html).toContain("header");
    expect(html).toContain("footer");
  });

  it("renders hidden item issues through the form-level Errors template", async () => {
    const html = await render(
      {
        resourceType: "Questionnaire",
        status: "active",
        url: "Questionnaire/htmx-custom-hidden-issues",
        item: [
          {
            linkId: "show",
            text: "Show matrix",
            type: "boolean",
          },
          {
            linkId: "matrix",
            text: "Broken hidden matrix",
            type: "group",
            extension: [itemControl("table")],
            enableWhen: [
              {
                question: "show",
                operator: "=",
                answerBoolean: true,
              },
            ],
          },
        ],
      },
      {
        templates: {
          Errors({ hasMessages, messages }) {
            return hasMessages
              ? `<section data-custom-form-issues>${messages.map(({ html }) => `<p>${html}</p>`).join("")}</section>`
              : "";
          },
        },
      },
    );

    expect(html).toContain("<section data-custom-form-issues>");
    expect(html).toContain("matrix");
    expect(html).not.toContain('class="fb-errors"');
  });

  it("renders choiceOrientation on radio-button and check-box lists", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-choice-orientation",
      item: [
        {
          linkId: "color",
          text: "Favorite color",
          type: "string",
          extension: [
            itemControl("radio-button"),
            choiceOrientation("horizontal"),
          ],
          answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
        },
        {
          linkId: "allergy",
          text: "Allergy",
          type: "string",
          repeats: true,
          extension: [itemControl("check-box"), choiceOrientation("vertical")],
          answerOption: [{ valueString: "Dust" }, { valueString: "Pollen" }],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('data-orientation="horizontal"');
    expect(html).toContain('data-orientation="vertical"');
  });

  it("renders collapsible group and question state with native details", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-collapsible",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          type: "group",
          extension: [collapsible("default-closed")],
          item: [{ linkId: "nickname", text: "Nickname", type: "string" }],
        },
        {
          linkId: "issue",
          text: "Issue",
          type: "string",
          extension: [collapsible("default-open")],
          item: [{ linkId: "issue-note", text: "Issue note", type: "string" }],
        },
        {
          linkId: "invalid",
          text: "Invalid collapsible",
          type: "string",
          extension: [collapsible("invalid-code")],
          item: [
            { linkId: "invalid-note", text: "Invalid note", type: "string" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('data-fb-collapsible="demographics"');
    expect(html).toContain('name="fb[expanded][demographics]" value="false"');
    expect(html).toContain('value="toggle-expanded[demographics]"');
    expect(html).toContain(">Expand</button></summary>");
    expect(html).not.toContain('data-fb-link-id="nickname"');
    expect(html).toContain('data-fb-collapsible="issue" open');
    expect(html).toContain('name="fb[expanded][issue]" value="true"');
    expect(html).toContain('value="toggle-expanded[issue]"');
    expect(html).toContain(">Collapse</button></summary>");
    expect(html).toContain('data-fb-link-id="issue-note"');
    expect(html).toContain('data-fb-collapsible="invalid" open');
    expect(html).toContain('data-fb-link-id="invalid-note"');
  });

  it("does not render controls inside collapsed items but preserves their values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-collapsed-values",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          type: "group",
          extension: [collapsible("default-closed")],
          item: [{ linkId: "nickname", text: "Nickname", type: "string" }],
        },
        {
          linkId: "issue",
          text: "Issue",
          type: "string",
          extension: [collapsible("default-closed")],
          item: [{ linkId: "issue-note", text: "Issue note", type: "string" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htmx-collapsed-values",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          item: [
            {
              linkId: "nickname",
              text: "Nickname",
              answer: [{ valueString: "Nick" }],
            },
          ],
        },
        {
          linkId: "issue",
          text: "Issue",
          answer: [
            {
              valueString: "Pain",
              item: [
                {
                  linkId: "issue-note",
                  text: "Issue note",
                  answer: [{ valueString: "After meals" }],
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire, { questionnaireResponse });
    const response = await processResponse(questionnaire, hiddenFormData(html));

    expect(html).not.toMatch(
      /<input(?=[^>]*data-fb-link-id="nickname")(?![^>]*type="hidden")[^>]*>/u,
    );
    expect(html).not.toMatch(
      /<input(?=[^>]*data-fb-link-id="issue")(?![^>]*type="hidden")[^>]*>/u,
    );
    expect(html).not.toMatch(
      /<input(?=[^>]*data-fb-link-id="issue-note")(?![^>]*type="hidden")[^>]*>/u,
    );
    expect(response.item).toEqual(questionnaireResponse.item);
  });

  it("preserves collapsible expanded state across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-collapsible-state",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          type: "group",
          extension: [collapsible("default-closed")],
          item: [{ linkId: "nickname", text: "Nickname", type: "string" }],
        },
      ],
    };
    const initialHtml = await render(questionnaire);
    const toggleData = hiddenFormData(initialHtml);
    toggleData.append("fb[action]", "toggle-expanded[demographics]");
    const expandedHtml = await processAndRender(questionnaire, toggleData);
    const postData = hiddenFormData(expandedHtml);
    const preservedHtml = await processAndRender(questionnaire, postData);

    expect(initialHtml).toContain('data-fb-collapsible="demographics"');
    expect(initialHtml).not.toContain(
      'data-fb-collapsible="demographics" open',
    );
    expect(expandedHtml).toContain('data-fb-collapsible="demographics" open');
    expect(expandedHtml).toContain('value="true"');
    expect(preservedHtml).toContain('data-fb-collapsible="demographics" open');
  });

  it("shares collapsible state across repeated answers of the same question", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-collapsible-state",
      item: [
        {
          linkId: "issue",
          text: "Issue",
          type: "string",
          repeats: true,
          extension: [collapsible("default-open")],
          item: [{ linkId: "issue-note", text: "Issue note", type: "string" }],
        },
      ],
    };
    const initialHtml = await render(questionnaire);
    const addData = hiddenFormData(initialHtml);
    addData.append("fb[action]", "add-answer[issue]");
    const addedHtml = await processAndRender(questionnaire, addData);
    const collapseData = hiddenFormData(addedHtml);
    collapseData.set("fb[answer][issue][i:0][value]", "Pain");
    collapseData.set("fb[answer][issue][i:0][issue-note][value]", "Morning");
    collapseData.set("fb[answer][issue][i:1][value]", "Nausea");
    collapseData.set("fb[answer][issue][i:1][issue-note][value]", "Evening");
    collapseData.append("fb[action]", "toggle-expanded[issue]");
    const collapsedHtml = await processAndRender(questionnaire, collapseData);
    const response = await processResponse(
      questionnaire,
      hiddenFormData(collapsedHtml),
    );

    expect(addedHtml).toContain('data-fb-collapsible="issue" open');
    expect(addedHtml.match(/data-fb-link-id="issue-note"/gu)).toHaveLength(2);
    expect(collapsedHtml).not.toContain('data-fb-collapsible="issue" open');
    expect(collapsedHtml).not.toMatch(
      /<input(?=[^>]*data-fb-link-id="issue-note")(?![^>]*type="hidden")[^>]*>/u,
    );
    expect(collapsedHtml).not.toContain('data-fb-field="add-action"');
    expect(response.item).toEqual([
      {
        linkId: "issue",
        text: "Issue",
        answer: [
          {
            valueString: "Pain",
            item: [
              {
                linkId: "issue-note",
                text: "Issue note",
                answer: [{ valueString: "Morning" }],
              },
            ],
          },
          {
            valueString: "Nausea",
            item: [
              {
                linkId: "issue-note",
                text: "Issue note",
                answer: [{ valueString: "Evening" }],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("uses entryFormat extension as an input placeholder", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-entry-format",
      item: [
        {
          linkId: "mrn",
          text: "Medical record number",
          type: "string",
          extension: [{ url: entryFormatUrl, valueString: "MRN-####" }],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('placeholder="MRN-####"');
  });

  it("uses prompt item text as an input placeholder when entryFormat is absent", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-prompt-placeholder",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
          item: [
            {
              linkId: "notes-prompt",
              type: "display",
              text: "Add any relevant context",
              extension: [itemControl("prompt")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('placeholder="Add any relevant context"');
  });

  it("applies native input attributes from item behavior extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-input-behavior-extensions",
      item: [
        {
          linkId: "phone",
          text: "Phone",
          type: "string",
          extension: [keyboardType("phone")],
        },
        {
          linkId: "message",
          text: "Message",
          type: "text",
          extension: [keyboardType("chat")],
        },
        {
          linkId: "nickname",
          text: "Nickname",
          type: "string",
          maxLength: 10,
          extension: [minLength(3)],
        },
        {
          linkId: "amount",
          text: "Amount",
          type: "decimal",
          extension: [maxDecimalPlaces(2)],
        },
        {
          linkId: "weight",
          text: "Weight",
          type: "quantity",
          extension: [minQuantity(40, "kg"), maxQuantity(200, "kg")],
        },
        {
          linkId: "document",
          text: "Document",
          type: "attachment",
          extension: [mimeType("image/png"), mimeType("application/pdf")],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('data-fb-link-id="phone"');
    expect(html).toContain('inputmode="tel"');
    expect(html).toContain('data-fb-link-id="message"');
    expect(html).toContain('inputmode="text"');
    expect(html).toContain('minlength="3"');
    expect(html).toContain('maxlength="10"');
    expect(html).toContain('step="0.01"');
    expect(html).toMatch(
      /data-fb-link-id="weight"[^>]*data-fb-field="value"[^>]*min="40"[^>]*max="200"/u,
    );
    expect(html).toContain('accept="image/png,application/pdf"');
  });

  it("renders scalar input types and bound attributes from value extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-scalar-input-bounds",
      item: [
        {
          linkId: "pills",
          text: "Pills per day",
          type: "integer",
          extension: [
            { url: minValueUrl, valueInteger: 1 },
            { url: maxValueUrl, valueInteger: 12 },
          ],
        },
        {
          linkId: "dosage",
          text: "Dosage",
          type: "decimal",
          extension: [
            { url: minValueUrl, valueDecimal: 0.5 },
            { url: maxValueUrl, valueDecimal: 12.5 },
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "mg",
                display: "mg",
              },
            },
          ],
        },
        {
          linkId: "visit",
          text: "Visit date",
          type: "date",
          extension: [
            { url: minValueUrl, valueDate: "2024-01-01" },
            { url: maxValueUrl, valueDate: "2024-12-31" },
          ],
        },
        {
          linkId: "appointment",
          text: "Appointment time",
          type: "dateTime",
          extension: [
            { url: minValueUrl, valueDateTime: "2024-07-01T09:00" },
            { url: maxValueUrl, valueDateTime: "2024-07-31T17:00" },
          ],
        },
        {
          linkId: "dose-time",
          text: "Dose time",
          type: "time",
          extension: [
            { url: minValueUrl, valueTime: "08:00" },
            { url: maxValueUrl, valueTime: "20:00" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toMatch(
      /data-fb-link-id="pills"[^>]*type="number"[^>]*step="1"[^>]*min="1"[^>]*max="12"/u,
    );
    expect(html).toMatch(
      /data-fb-link-id="dosage"[^>]*type="number"[^>]*step="any"[^>]*min="0.5"[^>]*max="12.5"/u,
    );
    expect(html).toContain("mg");
    expect(html).toMatch(
      /data-fb-link-id="visit"[^>]*type="date"[^>]*min="2024-01-01"[^>]*max="2024-12-31"/u,
    );
    expect(html).toMatch(
      /data-fb-link-id="appointment"[^>]*type="datetime-local"[^>]*min="2024-07-01T09:00"[^>]*max="2024-07-31T17:00"/u,
    );
    expect(html).toMatch(
      /data-fb-link-id="dose-time"[^>]*type="time"[^>]*min="08:00"[^>]*max="20:00"/u,
    );
  });

  it("ignores unsupported keyboardType codes and ancestor keyboardType extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-keyboard-type-negative",
      item: [
        {
          linkId: "unsupported",
          text: "Unsupported keyboard",
          type: "string",
          extension: [keyboardType("unsupported")],
        },
        {
          linkId: "group",
          text: "Group",
          type: "group",
          extension: [keyboardType("phone")],
          item: [
            {
              linkId: "child",
              text: "Child",
              type: "string",
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(
      html.match(/data-fb-link-id="unsupported"[^>]*inputmode=/u),
    ).toBeNull();
    expect(html.match(/data-fb-link-id="child"[^>]*inputmode=/u)).toBeNull();
  });

  it("ignores mimeType extensions on non-attachment items", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-mime-type-non-attachment",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "string",
          extension: [mimeType("image/png")],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('data-fb-link-id="notes"');
    expect(html).not.toContain('accept="image/png"');
  });

  it("passes mimeType extensions to open-choice attachment inputs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-open-choice-attachment-mime-types",
      item: [
        {
          linkId: "document",
          text: "Document",
          type: "attachment",
          answerConstraint: "optionsOrType",
          extension: [mimeType("image/png"), mimeType("application/pdf")],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('type="file"');
    expect(html).toContain('accept="image/png,application/pdf"');
  });

  it("applies string length attributes to open-choice custom inputs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-open-choice-string-lengths",
      item: [
        {
          linkId: "call-sign",
          text: "Call sign",
          type: "string",
          answerConstraint: "optionsOrType",
          maxLength: 8,
          extension: [minLength(3)],
          answerOption: [{ valueString: "Alpha" }],
        },
      ],
    };
    const initialHtml = await render(questionnaire);
    const formData = hiddenFormData(initialHtml);
    formData.set(
      decodeEntities(
        requiredMatch(
          /<select[^>]*data-fb-link-id="call-sign"[^>]*name="([^"]+)"/u,
          initialHtml,
        )[1] ?? "",
      ),
      decodeEntities(
        requiredMatch(
          /<option value="([^"]+)">Specify other<\/option>/u,
          initialHtml,
        )[1] ?? "",
      ),
    );
    const html = await processAndRender(questionnaire, formData);

    expect(html).toContain('data-fb-link-id="call-sign"');
    expect(html).toContain('minlength="3"');
    expect(html).toContain('maxlength="8"');
  });

  it("applies decimal step and unit display to open-choice custom inputs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-open-choice-decimal-behavior",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "decimal",
          answerConstraint: "optionsOrType",
          extension: [
            maxDecimalPlaces(2),
            {
              url: unitUrl,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "mg/L",
                display: "mg/L",
              },
            },
          ],
          answerOption: [{ valueDecimal: 1.25 }],
        },
      ],
    };
    const initialHtml = await render(questionnaire);
    const formData = hiddenFormData(initialHtml);
    formData.set(
      decodeEntities(
        requiredMatch(
          /<select[^>]*data-fb-link-id="dose"[^>]*name="([^"]+)"/u,
          initialHtml,
        )[1] ?? "",
      ),
      decodeEntities(
        requiredMatch(
          /<option value="([^"]+)">Specify other<\/option>/u,
          initialHtml,
        )[1] ?? "",
      ),
    );
    const html = await processAndRender(questionnaire, formData);

    expect(html).toMatch(
      /data-fb-link-id="dose"[^>]*type="number"[^>]*step="0.01"/u,
    );
    expect(html).toContain("mg/L");
  });

  it("renders itemShortText as responsive label text", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-short-text",
      item: [
        {
          linkId: "age",
          text: "How old are you in completed years?",
          type: "string",
          extension: [{ url: shortTextUrl, valueString: "Age in years" }],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("How old are you in completed years?");
    expect(html).toContain('data-short-text="Age in years"');
    expect(html).toContain("[data-fb-label-short]{display:none}");
    expect(html).toMatch(
      /<span[^>]*data-fb-label-full[^>]*>How old are you in completed years\?<\/span><span[^>]*data-fb-label-short[^>]*>Age in years<\/span>/u,
    );
  });

  it("uses openLabel for unrestricted entry options", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-open-label",
      item: [
        {
          linkId: "symptom",
          text: "Primary symptom",
          type: "coding",
          answerConstraint: "optionsOrString",
          extension: [
            itemControl("radio-button"),
            { url: openLabelUrl, valueString: "Other, please specify" },
          ],
          answerOption: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "25064002",
                display: "Headache",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Other, please specify");
    expect(html).not.toContain("Specify other");
  });

  it("renders optionPrefix before answer option labels", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-option-prefix",
      item: [
        {
          linkId: "severity",
          type: "string",
          text: "Severity",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueString: "Mild",
              extension: [{ url: optionPrefixUrl, valueString: "(a)" }],
            },
            {
              valueString: "Moderate",
              extension: [{ url: optionPrefixUrl, valueString: "(b)" }],
            },
            { valueString: "Severe" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html.replaceAll(/\s+/g, "")).toContain("(a)Mild");
    expect(html.replaceAll(/\s+/g, "")).toContain("(b)Moderate");
    expect(html).toContain("Severe");
  });

  it("escapes optionPrefix text", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-option-prefix-escaping",
      item: [
        {
          linkId: "severity",
          type: "string",
          text: "Severity",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueString: "Mild",
              extension: [
                {
                  url: optionPrefixUrl,
                  valueString: "<script>alert(1)</script>",
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("escapes select placeholder text", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-select-placeholder-escaping",
      item: [
        {
          linkId: "severity",
          type: "string",
          text: "Severity",
          extension: [itemControl("drop-down")],
          answerOption: [{ valueString: "Mild" }],
        },
      ],
    };
    const html = await render(questionnaire, {
      strings: {
        ...strings.en,
        selection: {
          ...strings.en.selection,
          selectPlaceholder: "<script>alert(1)</script>",
        },
      },
    });

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("applies sliderStepValue to integer and quantity sliders", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-slider-step",
      item: [
        {
          linkId: "pain-score",
          text: "Pain score",
          type: "integer",
          extension: [
            itemControl("slider"),
            { url: sliderStepValueUrl, valueInteger: 5 },
          ],
        },
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            itemControl("slider"),
            { url: sliderStepValueUrl, valueDecimal: 0.25 },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('data-fb-link-id="pain-score"');
    expect(html).toContain('step="5"');
    expect(html).toContain('data-fb-link-id="dose"');
    expect(html).toContain('step="0.25"');
  });

  it("applies configured widths to table columns", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-table-width",
      item: [
        {
          linkId: "htable-group",
          text: "Patient vitals",
          type: "group",
          extension: [itemControl("htable")],
          item: [
            {
              linkId: "systolic",
              text: "Systolic",
              type: "string",
              extension: [width(120)],
              answerOption: [{ valueString: "Normal" }],
            },
            {
              linkId: "diastolic",
              text: "Diastolic",
              type: "string",
              extension: [width(40, "%")],
              answerOption: [{ valueString: "Normal" }],
            },
          ],
        },
        {
          linkId: "gtable-group",
          text: "Visits",
          type: "group",
          repeats: true,
          required: true,
          extension: [itemControl("gtable")],
          item: [
            {
              linkId: "symptom",
              text: "Symptom",
              type: "string",
              extension: [width(200)],
            },
            {
              linkId: "duration",
              text: "Duration",
              type: "integer",
              extension: [width(35, "%")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('<th style="width:120px"');
    expect(html).toContain('<th style="width:40%"');
    expect(html).toContain('<th style="width:200px"');
    expect(html).toContain('<th style="width:35%"');
  });

  it("renders selection table row header content", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-selection-table-headers",
      item: [
        {
          linkId: "table-group",
          text: "Table group",
          type: "group",
          extension: [itemControl("table")],
          item: [
            {
              linkId: "table-question",
              text: "Vertical table question",
              type: "coding",
              answerOption: [{ valueCoding: { code: "yes", display: "Yes" } }],
            },
          ],
        },
        {
          linkId: "htable-group",
          text: "HTable group",
          type: "group",
          extension: [itemControl("htable")],
          item: [
            {
              linkId: "htable-question",
              text: "Horizontal table question",
              type: "coding",
              answerOption: [
                { valueCoding: { code: "maybe", display: "Maybe" } },
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Vertical table question");
    expect(html).toContain("Maybe");
  });

  it("renders numeric unit display labels on default and spinner inputs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-labels",
      item: [
        {
          linkId: "lab",
          text: "Lab",
          type: "integer",
          item: [
            {
              linkId: "lab-unit",
              text: "mg/dL",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
        {
          linkId: "dose",
          text: "Dose",
          type: "decimal",
          extension: [itemControl("spinner")],
          item: [
            {
              linkId: "dose-unit",
              text: "tablets",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("mg/dL");
    expect(html).toContain("tablets");
  });

  it("prefers unit display child items over questionnaire-unit extension display", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-child-precedence",
      item: [
        {
          linkId: "dose-count",
          text: "Dose count",
          type: "integer",
          extension: [
            {
              url: unitUrl,
              valueCoding: {
                system: "http://example.org/units",
                code: "tablet",
                display: "tablets",
              },
            },
          ],
          item: [
            {
              linkId: "dose-count-unit",
              text: "tablet",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("tablet");
    expect(html).not.toContain("tablets");
  });

  it("describes numeric inputs with unit display labels", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-aria-description",
      item: [
        {
          linkId: "dose-count",
          text: "Dose count",
          type: "integer",
          item: [
            {
              linkId: "dose-count-unit",
              text: "tablet",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
        {
          linkId: "dose-spinner",
          text: "Dose spinner",
          type: "decimal",
          extension: [itemControl("spinner")],
          item: [
            {
              linkId: "dose-spinner-unit",
              text: "mg",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
        {
          linkId: "pain-score",
          text: "Pain score",
          type: "integer",
          extension: [itemControl("slider")],
          item: [
            {
              linkId: "pain-score-unit",
              text: "points",
              type: "display",
              extension: [itemControl("unit")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expectUnitDescription(html, "dose-count", "tablet");
    expectUnitDescription(html, "dose-spinner", "mg");
    expectUnitDescription(html, "pain-score", "points");
  });

  it("renders support hyperlinks next to item labels", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-support-links",
      item: [
        {
          linkId: "instructions",
          text: "Instructions",
          type: "string",
          extension: [
            {
              url: supportHyperlinkUrl,
              extension: [
                { url: "label", valueString: "More & <info>" },
                { url: "link", valueUri: "https://example.com/help" },
              ],
            },
            { url: supportLinkUrl, valueUri: "https://example.com/legacy" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('href="https://example.com/help"');
    expect(html).toContain("More &amp; &lt;info&gt;");
    expect(html).not.toContain("More &amp;amp; &amp;lt;info&amp;gt;");
    expect(html).toContain('href="https://example.com/legacy"');
    expect(html).toContain("https://example.com/legacy");
  });

  it("renders help, legal, and flyover display controls with accessible popover semantics", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-display-control-popovers",
      item: [
        {
          linkId: "question",
          text: "Question",
          type: "string",
          item: [
            {
              linkId: "question-help",
              text: "Helpful guidance",
              type: "display",
              extension: [itemControl("help")],
            },
            {
              linkId: "question-legal",
              text: "Important notice",
              type: "display",
              extension: [itemControl("legal")],
            },
            {
              linkId: "question-flyover",
              text: "More explanation",
              type: "display",
              extension: [itemControl("flyover")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toMatch(
      new RegExp(
        `<button type="button"[^>]* aria-describedby="[^"]+" aria-label="${strings.en.aria.help}">`,
        "u",
      ),
    );
    expect(html).toMatch(
      new RegExp(
        `<button type="button"[^>]* aria-describedby="[^"]+" aria-label="${strings.en.aria.legal}">`,
        "u",
      ),
    );
    expect(html).toMatch(
      new RegExp(
        `<button type="button"[^>]* aria-describedby="[^"]+" aria-label="${strings.en.aria.flyover}">`,
        "u",
      ),
    );
    expect(html).toMatch(/role="tooltip"[^>]*>Helpful guidance/u);
    expect(html).toMatch(/role="dialog"[^>]*>Important notice/u);
    expect(html).toMatch(/role="tooltip"[^>]*>More explanation/u);
  });

  it("renders question item media", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-item-media",
      item: [
        {
          linkId: "image",
          text: "Image question",
          type: "string",
          extension: [
            {
              url: itemMediaUrl,
              valueAttachment: {
                title: "Question image",
                contentType: "image/png",
                data: "AAAA",
              },
            },
          ],
        },
        {
          linkId: "pdf",
          text: "PDF question",
          type: "string",
          extension: [
            {
              url: itemMediaUrl,
              valueAttachment: {
                title: "Instructions",
                contentType: "application/pdf",
                url: "https://example.com/instructions.pdf",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('src="data:image/png;base64,AAAA"');
    expect(html).toContain('alt="Question image"');
    expect(html).toContain('href="https://example.com/instructions.pdf"');
    expect(html).toContain("Instructions");
  });

  it("renders audio, video, and text fallback item media", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-item-media-extra",
      item: [
        {
          linkId: "audio",
          text: "Audio question",
          type: "string",
          extension: [
            {
              url: itemMediaUrl,
              valueAttachment: {
                title: "Question audio",
                contentType: "audio/mpeg",
                url: "https://example.com/prompt.mp3",
              },
            },
          ],
        },
        {
          linkId: "video",
          text: "Video question",
          type: "string",
          extension: [
            {
              url: itemMediaUrl,
              valueAttachment: {
                title: "Question video",
                contentType: "video/mp4",
                url: "https://example.com/prompt.mp4",
              },
            },
          ],
        },
        {
          linkId: "fallback",
          text: "Fallback question",
          type: "string",
          extension: [
            {
              url: itemMediaUrl,
              valueAttachment: {
                title: "Attachment details",
                contentType: "application/json",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toMatch(
      /<audio controls[^>]* src="https:\/\/example\.com\/prompt\.mp3"><\/audio>/u,
    );
    expect(html).toMatch(
      /<video controls[^>]* src="https:\/\/example\.com\/prompt\.mp4"><\/video>/u,
    );
    expect(html).toContain("Attachment details");
    expect(html).not.toContain('href="Attachment details"');
  });

  it("renders answer option media in list controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-option-media",
      item: [
        {
          linkId: "severity",
          text: "Severity",
          type: "string",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueString: "Mild",
              extension: [
                {
                  url: itemAnswerMediaUrl,
                  valueAttachment: {
                    title: "Mild visual",
                    contentType: "image/png",
                    data: "AAAA",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain('src="data:image/png;base64,AAAA"');
    expect(html).toContain('alt="Mild visual"');
  });

  it("localizes item and answer option media fallback labels", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      language: "en",
      url: "Questionnaire/htmx-localized-media-fallback",
      title: "Media fallback",
      _title: translatedElement("es", "Medios"),
      item: [
        {
          linkId: "instructions",
          text: "Instructions",
          type: "display",
          extension: [
            {
              url: itemMediaUrl,
              valueAttachment: {
                contentType: "application/json",
              },
            },
          ],
        },
        {
          linkId: "severity",
          text: "Severity",
          type: "string",
          extension: [itemControl("radio-button")],
          answerOption: [
            {
              valueString: "Mild",
              extension: [
                {
                  url: itemAnswerMediaUrl,
                  valueAttachment: {
                    contentType: "application/json",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire, { language: "es" });

    expect(html).toContain(`>${strings.es.inputs.attachmentLabel}</span>`);
    expect(html).not.toContain(">Attachment</span>");
  });

  it("renders translated questionnaire, item, and option text", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-translations",
      title: "Intake form",
      _title: translatedElement("es", "Formulario de ingreso"),
      description: "Please complete all fields.",
      _description: translatedElement(
        "es",
        "Por favor complete todos los campos.",
      ),
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: translatedElement("es", "Nombre del paciente"),
          prefix: "1.",
          _prefix: translatedElement("es", "1)"),
          extension: [
            {
              url: entryFormatUrl,
              valueString: "Enter full legal name",
              _valueString: translatedElement(
                "es",
                "Ingrese el nombre legal completo",
              ),
            },
            {
              url: supportHyperlinkUrl,
              extension: [
                {
                  url: "label",
                  valueString: "More info",
                  _valueString: translatedElement("es", "Mas informacion"),
                },
                { url: "link", valueUri: "https://example.com/help" },
              ],
            },
          ],
        },
        {
          linkId: "material",
          type: "string",
          text: "Material",
          answerOption: [
            {
              valueString: "Discharge instructions",
              _valueString: translatedElement("es", "Instrucciones de alta"),
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire, { language: "es-MX" });

    expect(html).toContain("Formulario de ingreso");
    expect(html).toContain("Por favor complete todos los campos.");
    expect(html).toContain("1)");
    expect(html).toContain("Nombre del paciente");
    expect(html).toContain('placeholder="Ingrese el nombre legal completo"');
    expect(html).toContain("Mas informacion");
    expect(html).toContain("Instrucciones de alta");
    expect(html).not.toContain("Patient name");
    expect(html).not.toContain("Discharge instructions");
  });

  it("submits translated coding option displays", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-translated-coding-options",
      item: [
        {
          linkId: "priority",
          type: "coding",
          text: "Visit priority",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.org/priorities",
                code: "urgent",
                display: "Urgent",
                _display: translatedElement("es", "Urgente"),
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire, { language: "es" });
    const selectName = decodeEntities(
      requiredMatch(
        /<select[^>]*data-fb-link-id="priority"[^>]*name="([^"]+)"/u,
        html,
      )[1] ?? "",
    );
    const optionValue = decodeEntities(
      requiredMatch(
        /<option value="([^"]+)"><span>Urgente<\/span><\/option>/u,
        html,
      )[1] ?? "",
    );
    const formData = hiddenFormData(html);
    formData.set(selectName, optionValue);
    const response = await processResponse(questionnaire, formData, {
      language: "es",
    });

    expect(html).toContain("Urgente");
    expect(html).not.toContain(">Urgent<");
    expect(response.item?.[0]?.answer?.[0]?.valueCoding).toMatchObject({
      system: "http://example.org/priorities",
      code: "urgent",
      display: "Urgente",
    });
  });

  it("filters drop-down options by localized option text", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-localized-dropdown-search",
      item: [
        {
          linkId: "material",
          type: "string",
          text: "Preferred follow-up material",
          extension: [itemControl("drop-down")],
          answerOption: [
            {
              valueString: "Discharge instructions",
              _valueString: translatedElement("es", "Instrucciones de alta"),
            },
            {
              valueString: "Medication list",
              _valueString: translatedElement("es", "Lista de medicamentos"),
            },
          ],
        },
      ],
    };
    const initialHtml = await render(questionnaire, { language: "es" });
    const formData = hiddenFormData(initialHtml);
    formData.set(searchName([{ linkId: "material" }]), "alta");
    const html = await processAndRender(questionnaire, formData, {
      language: "es",
    });

    expect(initialHtml).not.toContain('type="search"');
    expect(html).toContain("Instrucciones de alta");
    expect(html).not.toContain("Lista de medicamentos");
    expect(html).not.toContain("Discharge instructions");
  });

  it("falls back to base text when the requested translation is missing", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-translation-fallback",
      title: "Intake form",
      _title: translatedElement("es", "Formulario de ingreso"),
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: translatedElement("es", "Nombre del paciente"),
        },
      ],
    };
    const html = await render(questionnaire, { language: "fr" });

    expect(html).toContain("Intake form");
    expect(html).toContain("Patient name");
    expect(html).not.toContain("Formulario de ingreso");
    expect(html).not.toContain("Nombre del paciente");
  });

  it("does not render a language selector without selectable languages", async () => {
    const withoutTranslations = await render({
      resourceType: "Questionnaire",
      status: "active",
      language: "en",
      url: "Questionnaire/htmx-no-translations",
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
        },
      ],
    });
    const withoutBaseLanguage = await render({
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-no-base-language",
      title: "Intake form",
      _title: translatedElement("es", "Formulario de ingreso"),
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: translatedElement("es", "Nombre del paciente"),
        },
      ],
    });

    expect(withoutTranslations).not.toContain('name="fb[language]"');
    expect(withoutBaseLanguage).not.toContain('name="fb[language]"');
  });

  it("localizes form, pagination, and collapsible action labels", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      language: "en",
      url: "Questionnaire/htmx-localized-form-actions",
      title: "Actions",
      _title: translatedElement("es", "Acciones"),
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControl("page")],
          item: [
            {
              linkId: "details",
              text: "Details",
              type: "group",
              extension: [collapsible("default-closed")],
              item: [{ linkId: "name", text: "Name", type: "string" }],
            },
          ],
        },
        {
          linkId: "page-2",
          text: "Page 2",
          type: "group",
          extension: [itemControl("page")],
          item: [{ linkId: "notes", text: "Notes", type: "text" }],
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: defaultTemplates,
      questionnaire,
      fhirVersion: "r5",
      language: "es",
    });
    try {
      const initialHtml = await renderer.render();
      const pageTwoData = hiddenFormData(initialHtml);
      pageTwoData.append("fb[action]", "page-next");
      await renderer.process(pageTwoData);
      const pageTwoHtml = await renderer.render();

      expect(initialHtml).toContain(`>${strings.es.form.submit}</button>`);
      expect(initialHtml).toContain(`>${strings.es.pagination.next}</button>`);
      expect(initialHtml).toContain(
        `>${strings.es.collapsible.expand}</button>`,
      );
      expect(initialHtml).not.toContain(">Submit</button>");
      expect(initialHtml).not.toContain(">Next</button>");
      expect(initialHtml).not.toContain(">Expand</button>");
      expect(pageTwoHtml).toContain(
        `>${strings.es.pagination.previous}</button>`,
      );
      expect(pageTwoHtml).not.toContain(">Previous</button>");
    } finally {
      renderer.dispose();
    }
  });

  it("localizes repeat action labels", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      language: "en",
      url: "Questionnaire/htmx-localized-repeat-actions",
      title: "Repeats",
      _title: translatedElement("es", "Repeticiones"),
      item: [
        { linkId: "alias", text: "Alias", type: "string", repeats: true },
        {
          linkId: "visit",
          text: "Visit",
          type: "group",
          repeats: true,
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-localized-repeat-actions",
      status: "in-progress",
      item: [
        {
          linkId: "alias",
          text: "Alias",
          answer: [{ valueString: "A" }, { valueString: "B" }],
        },
        {
          linkId: "visit",
          text: "Visit",
          item: [
            {
              linkId: "note",
              text: "Note",
              answer: [{ valueString: "First" }],
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
              answer: [{ valueString: "Second" }],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire, {
      questionnaireResponse,
      language: "es",
    });

    expect(html).toContain(
      `data-fb-link-id="alias" data-fb-field="add-action"`,
    );
    expect(html).toContain(
      `data-fb-link-id="visit" data-fb-field="add-action"`,
    );
    expect(html).toContain(`>${strings.es.selection.addAnother}</button>`);
    expect(html).toContain(`>${strings.es.group.addSection}</button>`);
    expect(html).toContain(`>${strings.es.group.removeSection}</button>`);
    expect(html).not.toContain(">Add another</button>");
    expect(html).not.toContain(">Remove</button>");
  });

  it("applies submitted language selections during full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      language: "en",
      url: "Questionnaire/htmx-language-post",
      title: "Intake form",
      _title: translatedElement("es", "Formulario de ingreso"),
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: translatedElement("es", "Nombre del paciente"),
        },
      ],
    };
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: defaultTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    try {
      const initialHtml = await renderer.render();
      expect(initialHtml).toContain('name="fb[language]"');

      const formData = new FormData();
      formData.set("fb[language]", "es");
      await renderer.process(formData);
      const html = await renderer.render();

      expect(html).toContain("Formulario de ingreso");
      expect(html).toContain("Nombre del paciente");
      expect(html).toContain(`>${strings.es.form.submit}</button>`);
      expect(html).not.toContain("Patient name");
      expect(html).not.toContain(`>${strings.en.form.submit}</button>`);
    } finally {
      renderer.dispose();
    }
  });

  it("passes extracted custom extensions to form and item templates", async () => {
    const formExtensionUrl =
      "http://example.test/StructureDefinition/form-note";
    const itemExtensionUrl =
      "http://example.test/StructureDefinition/item-note";
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-extensions",
      extension: [{ url: formExtensionUrl, valueString: "form extension" }],
      item: [
        {
          linkId: "notice",
          type: "display",
          text: "Notice",
          extension: [
            { url: itemExtensionUrl, valueString: "display extension" },
          ],
        },
        {
          linkId: "section",
          type: "group",
          text: "Section",
          extension: [
            { url: itemExtensionUrl, valueString: "group extension" },
          ],
          item: [{ linkId: "child", type: "string", text: "Child" }],
        },
        {
          linkId: "name",
          type: "string",
          text: "Name",
          extension: [
            { url: itemExtensionUrl, valueString: "question extension" },
          ],
        },
      ],
    };
    const html = await render(questionnaire, {
      customExtensions: {
        formNote: {
          target: "questionnaire",
          url: formExtensionUrl,
          repeats: false,
          extract: stringExtensionValue,
        },
        itemNote: {
          target: "item",
          url: itemExtensionUrl,
          repeats: false,
          extract: stringExtensionValue,
        },
      },
      templates: {
        Form: (properties) =>
          `${properties.hiddenFields}${properties.shortTextStyle}${properties.titleHtml ?? ""}${properties.descriptionHtml ?? ""}${properties.languageSelector ?? ""}${properties.errors ?? ""}${properties.before ?? ""}${properties.children}${properties.after ?? ""}${properties.signature ?? ""}${properties.paginationHtml ?? ""}${properties.submitButton}<p>${properties.customExtensions?.formNote}</p>`,
        QuestionScaffold: (properties) =>
          `<section>${properties.header ?? ""}${properties.children}<p>${properties.customExtensions?.itemNote}</p></section>`,
        GroupScaffold: (properties) =>
          `<fieldset>${properties.header ?? ""}${properties.children}<p>${properties.customExtensions?.itemNote}</p></fieldset>`,
        DisplayRenderer: (properties) =>
          `<div>${properties.children}<p>${properties.customExtensions?.itemNote}</p></div>`,
      },
    });

    expect(html).toContain("form extension");
    expect(html).toContain("display extension");
    expect(html).toContain("group extension");
    expect(html).toContain("question extension");
  });
});
