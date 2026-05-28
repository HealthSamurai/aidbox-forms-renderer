import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { Buffer } from "node:buffer";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

import type {
  CodingOf,
  ElementOf,
  FhirVersion,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";
import strings from "@formbox/strings";
import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  QuestionnaireRenderer,
  loadDefaultTemplates,
  type RenderMode,
} from "../dist/index.js";

type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type Coding = CodingOf<"r5">;
type Element = ElementOf<"r5">;
type ResponseItem = NonNullable<QuestionnaireResponse["item"]>[number];
type TestServerOptions<V extends FhirVersion = "r5"> = {
  readonly questionnaire: QuestionnaireOf<V>;
  readonly questionnaireResponse?: QuestionnaireResponseOf<V> | undefined;
  readonly fhirVersion?: V | undefined;
  readonly mode?: RenderMode | undefined;
};

const require = createRequire(import.meta.url);
const htmxScriptPath = require.resolve("htmx.org/dist/htmx.min.js");
const defaultTemplates = await loadDefaultTemplates();
const usageModeUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-usageMode";
const hiddenUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden";
const calculatedExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";
const enableWhenExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression";
const answerExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression";
const answerOptionsToggleUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerOptionsToggleExpression";
const cqfExpressionUrl =
  "http://hl7.org/fhir/StructureDefinition/cqf-expression";
const collapsibleUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-collapsible";
const optionExclusiveUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-optionExclusive";
const signatureRequiredUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-signatureRequired";
const responseSignatureUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaireresponse-signature";
const targetConstraintUrl =
  "http://hl7.org/fhir/StructureDefinition/targetConstraint";
const itemControlUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const shortTextUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-shortText";
const unitOptionUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption";
const unitValueSetUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet";
const unitOpenUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-unitOpen";
const minOccursUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs";
const maxOccursUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs";
const minValueUrl = "http://hl7.org/fhir/StructureDefinition/minValue";
const maxValueUrl = "http://hl7.org/fhir/StructureDefinition/maxValue";
const itemControlSystem = "http://hl7.org/fhir/questionnaire-item-control";
const ucumSystem = "http://unitsofmeasure.org";
const signatureDataUrl = "data:image/png;base64,c2lnbmF0dXJl";
const browserAnswerValueSet =
  "http://example.test/ValueSet/browser-answer-options";
const browserUnitValueSet = "http://example.test/ValueSet/browser-unit-options";
const signature = {
  sigFormat: "image/png",
  data: "c2lnbmF0dXJl",
};

function collapsible(code: string) {
  return {
    url: collapsibleUrl,
    valueCode: code,
  };
}

function itemControl(code: string) {
  return {
    url: itemControlUrl,
    valueCodeableConcept: {
      coding: [{ system: itemControlSystem, code }],
    },
  };
}

function minOccurs(value: number) {
  return { url: minOccursUrl, valueInteger: value };
}

function maxOccurs(value: number) {
  return { url: maxOccursUrl, valueInteger: value };
}

function minOccursExpression(expression: string) {
  return {
    url: minOccursUrl,
    valueInteger: 0,
    _valueInteger: {
      extension: [expressionExtension(cqfExpressionUrl, expression)],
    },
  };
}

function maxOccursExpression(expression: string) {
  return {
    url: maxOccursUrl,
    valueInteger: 0,
    _valueInteger: {
      extension: [expressionExtension(cqfExpressionUrl, expression)],
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

function targetConstraint(human: string, expression: string) {
  return {
    url: targetConstraintUrl,
    extension: [
      { url: "severity", valueCode: "error" },
      { url: "human", valueString: human },
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

function answerOptionToggle(option: { readonly valueCoding: Coding }) {
  return {
    url: answerOptionsToggleUrl,
    extension: [
      { url: "option", valueCoding: option.valueCoding },
      {
        url: "expression",
        valueExpression: {
          language: "text/fhirpath",
          expression: "%toggleValue",
        },
      },
    ],
  };
}

function translation(language: string, content: string) {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/translation",
    extension: [
      { url: "lang", valueCode: language },
      { url: "content", valueString: content },
    ],
  };
}

function translatedElement(language: string, content: string): Element {
  return { extension: [translation(language, content)] };
}

const questionnaire = {
  resourceType: "Questionnaire",
  id: "browser-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-e2e",
  title: "Browser E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "patient",
      text: "Patient",
      type: "group",
      item: [
        {
          linkId: "name",
          text: "Patient name",
          type: "string",
          required: true,
        },
        {
          linkId: "alias",
          text: "Alias",
          type: "string",
          repeats: true,
        },
      ],
    },
    {
      linkId: "symptom",
      text: "Symptom",
      type: "group",
      repeats: true,
      item: [
        {
          linkId: "symptom-name",
          text: "Symptom",
          type: "string",
          required: true,
        },
        {
          linkId: "severity",
          text: "Severity",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "https://formbox.healthsamurai.dev/CodeSystem/severity",
                code: "mild",
                display: "Mild",
              },
            },
            {
              valueCoding: {
                system: "https://formbox.healthsamurai.dev/CodeSystem/severity",
                code: "moderate",
                display: "Moderate",
              },
            },
            {
              valueCoding: {
                system: "https://formbox.healthsamurai.dev/CodeSystem/severity",
                code: "severe",
                display: "Severe",
              },
            },
          ],
        },
      ],
    },
    {
      linkId: "follow-up-needed",
      text: "Follow-up needed",
      type: "boolean",
    },
    {
      linkId: "follow-up-note",
      text: "Follow-up note",
      type: "text",
      enableWhen: [
        {
          question: "follow-up-needed",
          operator: "=",
          answerBoolean: true,
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const advancedQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-advanced-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-advanced-e2e",
  title: "Browser Advanced E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "gate",
      text: "Gate",
      type: "boolean",
    },
    {
      linkId: "readonly",
      text: "Read only",
      type: "string",
      readOnly: true,
    },
    {
      linkId: "readonly-group",
      text: "Read only group",
      type: "group",
      readOnly: true,
      item: [
        {
          linkId: "readonly-child",
          text: "Read only child",
          type: "string",
        },
      ],
    },
    {
      linkId: "readonly-radio",
      text: "Read only radio",
      type: "coding",
      readOnly: true,
      extension: [itemControl("radio-button")],
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/readonly",
            code: "low",
            display: "Low",
          },
        },
        {
          valueCoding: {
            system: "http://example.test/readonly",
            code: "high",
            display: "High",
          },
        },
      ],
    },
    {
      linkId: "readonly-checks",
      text: "Read only checks",
      type: "string",
      repeats: true,
      readOnly: true,
      extension: [itemControl("check-box")],
      answerOption: [
        { valueString: "First readonly check" },
        { valueString: "Second readonly check" },
      ],
    },
    {
      linkId: "secret",
      text: "Secret",
      type: "string",
      extension: [
        {
          url: hiddenUrl,
          valueBoolean: true,
        },
      ],
    },
    {
      linkId: "protected",
      text: "Protected",
      type: "string",
      disabledDisplay: "protected",
      enableWhen: [
        {
          question: "gate",
          operator: "=",
          answerBoolean: true,
        },
      ],
    },
    {
      linkId: "hidden-disabled",
      text: "Hidden disabled",
      type: "string",
      disabledDisplay: "hidden",
      enableWhen: [
        {
          question: "gate",
          operator: "=",
          answerBoolean: true,
        },
      ],
    },
    {
      linkId: "plain-disabled",
      text: "Plain disabled",
      type: "string",
      enableWhen: [
        {
          question: "gate",
          operator: "=",
          answerBoolean: true,
        },
      ],
    },
    {
      linkId: "capture-only",
      text: "Capture only",
      type: "string",
      extension: [
        {
          url: usageModeUrl,
          valueCode: "capture",
        },
      ],
    },
    {
      linkId: "display-only",
      text: "Display only",
      type: "string",
      extension: [
        {
          url: usageModeUrl,
          valueCode: "display",
        },
      ],
    },
    {
      linkId: "display-filled",
      text: "Display filled",
      type: "string",
      extension: [
        {
          url: usageModeUrl,
          valueCode: "display-non-empty",
        },
      ],
    },
    {
      linkId: "display-empty",
      text: "Display empty",
      type: "string",
      extension: [
        {
          url: usageModeUrl,
          valueCode: "display-non-empty",
        },
      ],
    },
    {
      linkId: "hybrid-filled",
      text: "Hybrid filled",
      type: "string",
      extension: [
        {
          url: usageModeUrl,
          valueCode: "capture-display-non-empty",
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const advancedResponse = {
  resourceType: "QuestionnaireResponse",
  status: "in-progress",
  questionnaire: advancedQuestionnaire.url,
  item: [
    { linkId: "gate", answer: [{ valueBoolean: false }] },
    { linkId: "readonly", answer: [{ valueString: "server-readonly" }] },
    {
      linkId: "readonly-group",
      item: [
        {
          linkId: "readonly-child",
          answer: [{ valueString: "server-child" }],
        },
      ],
    },
    {
      linkId: "readonly-radio",
      answer: [
        {
          valueCoding: {
            system: "http://example.test/readonly",
            code: "high",
            display: "High",
          },
        },
      ],
    },
    {
      linkId: "readonly-checks",
      answer: [
        { valueString: "First readonly check" },
        { valueString: "Second readonly check" },
      ],
    },
    { linkId: "secret", answer: [{ valueString: "secret-1" }] },
    { linkId: "protected", answer: [{ valueString: "protected-1" }] },
    {
      linkId: "hidden-disabled",
      answer: [{ valueString: "hidden-disabled-1" }],
    },
    { linkId: "plain-disabled", answer: [{ valueString: "plain-disabled-1" }] },
    { linkId: "capture-only", answer: [{ valueString: "capture-1" }] },
    { linkId: "display-only", answer: [{ valueString: "display-1" }] },
    { linkId: "display-filled", answer: [{ valueString: "display-filled-1" }] },
    { linkId: "hybrid-filled", answer: [{ valueString: "hybrid-1" }] },
  ],
} satisfies QuestionnaireResponse;

const allTypesQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-all-types-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-all-types-e2e",
  title: "Browser All Types E2E Questionnaire",
  status: "active",
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
} satisfies QuestionnaireOf<"r5">;

const urlEnableWhenQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-url-enable-when-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-url-enable-when-e2e",
  title: "Browser URL EnableWhen E2E Questionnaire",
  status: "active",
  item: [
    { linkId: "website", text: "Website", type: "url" },
    {
      linkId: "matching-note",
      text: "Matching note",
      type: "string",
      enableWhen: [
        {
          question: "website",
          operator: "=",
          answerString: "https://example.org/target",
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const r4ChoiceQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-r4-choice-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-r4-choice-e2e",
  title: "Browser R4 Choice E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "r4-choice",
      text: "R4 choice",
      type: "choice",
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/r4-choice",
            code: "phone",
            display: "Phone",
          },
        },
        {
          valueCoding: {
            system: "http://example.test/r4-choice",
            code: "email",
            display: "Email",
          },
        },
      ],
    },
    {
      linkId: "r4-open-choice",
      text: "R4 open choice",
      type: "open-choice",
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/r4-choice",
            code: "sms",
            display: "SMS",
          },
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r4">;

const initiallySelectedQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-initially-selected-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-initially-selected-e2e",
  title: "Browser Initially Selected E2E Questionnaire",
  status: "active",
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
} satisfies QuestionnaireOf<"r5">;

const initiallySelectedResponse = {
  resourceType: "QuestionnaireResponse",
  status: "in-progress",
  questionnaire: initiallySelectedQuestionnaire.url,
  item: [
    {
      linkId: "food",
      answer: [{ valueString: "sushi" }],
    },
  ],
} satisfies QuestionnaireResponse;

const controlQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-controls-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-controls-e2e",
  title: "Browser Controls E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "dropdown",
      text: "Dropdown",
      type: "coding",
      extension: [itemControl("drop-down")],
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/control",
            code: "drop",
            display: "Drop",
          },
        },
      ],
    },
    {
      linkId: "autocomplete",
      text: "Autocomplete",
      type: "coding",
      extension: [itemControl("autocomplete")],
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/control",
            code: "auto",
            display: "Auto",
          },
        },
      ],
    },
    {
      linkId: "lookup",
      text: "Lookup",
      type: "coding",
      extension: [itemControl("lookup")],
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/control",
            code: "lookup",
            display: "Lookup",
          },
        },
      ],
    },
    {
      linkId: "radio",
      text: "Radio",
      type: "coding",
      extension: [itemControl("radio-button")],
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/control",
            code: "radio",
            display: "Radio",
          },
        },
      ],
    },
    {
      linkId: "checkbox",
      text: "Checkbox",
      type: "coding",
      repeats: true,
      extension: [itemControl("check-box")],
      answerOption: [
        {
          valueCoding: {
            system: "http://example.test/control",
            code: "check-a",
            display: "Check A",
          },
        },
        {
          valueCoding: {
            system: "http://example.test/control",
            code: "check-b",
            display: "Check B",
          },
        },
      ],
    },
    {
      linkId: "slider",
      text: "Slider",
      type: "integer",
      extension: [itemControl("slider")],
      item: [
        {
          linkId: "slider-lower",
          text: "No pain",
          type: "display",
          extension: [itemControl("lower")],
        },
        {
          linkId: "slider-upper",
          text: "Worst pain",
          type: "display",
          extension: [itemControl("upper")],
        },
        {
          linkId: "slider-unit",
          text: "points",
          type: "display",
          extension: [itemControl("unit")],
        },
      ],
    },
    {
      linkId: "quantity-slider",
      text: "Quantity slider",
      type: "quantity",
      extension: [itemControl("slider")],
    },
    {
      linkId: "spinner",
      text: "Spinner",
      type: "decimal",
      extension: [itemControl("spinner")],
    },
    {
      linkId: "quantity-spinner",
      text: "Quantity spinner",
      type: "quantity",
      extension: [itemControl("spinner")],
    },
    {
      linkId: "text-box",
      text: "Text box",
      type: "text",
      extension: [itemControl("text-box")],
      item: [
        {
          linkId: "text-box-prompt",
          text: "Prompt text",
          type: "display",
          extension: [itemControl("prompt")],
        },
        {
          linkId: "text-box-help",
          text: "Help text",
          type: "display",
          extension: [itemControl("help")],
        },
        {
          linkId: "text-box-legal",
          text: "Legal text",
          type: "display",
          extension: [itemControl("legal")],
        },
        {
          linkId: "text-box-flyover",
          text: "Flyover text",
          type: "display",
          extension: [itemControl("flyover")],
        },
      ],
    },
    {
      linkId: "inline-display",
      text: "Inline display",
      type: "display",
      extension: [itemControl("inline")],
    },
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
          linkId: "grid-row",
          text: "Grid row",
          type: "group",
          item: [{ linkId: "grid-child", text: "Grid child", type: "string" }],
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
            {
              valueCoding: {
                system: "http://example.test/control",
                code: "table",
                display: "Table",
              },
            },
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
            {
              valueCoding: {
                system: "http://example.test/control",
                code: "htable",
                display: "HTable",
              },
            },
          ],
        },
      ],
    },
    {
      linkId: "visits",
      text: "Visits",
      type: "group",
      repeats: true,
      extension: [itemControl("gtable")],
      item: [
        { linkId: "visit-note", text: "Visit note", type: "string" },
        { linkId: "visit-score", text: "Visit score", type: "integer" },
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
            {
              linkId: "tab-child",
              text: "Tab child",
              type: "string",
            },
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
  ],
} satisfies QuestionnaireOf<"r5">;

const pageControlQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-page-controls-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-page-controls-e2e",
  title: "Browser Page Controls E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "header",
      text: "Header",
      type: "group",
      extension: [itemControl("header")],
    },
    {
      linkId: "page-one",
      text: "Page one",
      type: "group",
      extension: [itemControl("page")],
      item: [
        {
          linkId: "page-name",
          text: "Page name",
          type: "string",
          item: [
            {
              linkId: "page-name-detail",
              text: "Page name detail",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      linkId: "page-two",
      text: "Page two",
      type: "group",
      extension: [itemControl("page")],
      item: [{ linkId: "page-note", text: "Page note", type: "string" }],
    },
    {
      linkId: "footer",
      text: "Footer",
      type: "group",
      extension: [itemControl("footer")],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const localizedActionsQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-localized-actions-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-localized-actions-e2e",
  title: "Localized actions",
  _title: translatedElement("es", "Acciones localizadas"),
  status: "active",
  language: "en",
  item: [
    {
      linkId: "page-one",
      text: "Page one",
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
        { linkId: "alias", text: "Alias", type: "string", repeats: true },
      ],
    },
    {
      linkId: "page-two",
      text: "Page two",
      type: "group",
      extension: [itemControl("page")],
      item: [{ linkId: "notes", text: "Notes", type: "text" }],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const expressionQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-expression-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-expression-e2e",
  title: "Browser Expression E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "base",
      text: "Base",
      type: "integer",
    },
    {
      linkId: "double",
      text: "Double",
      type: "integer",
      readOnly: true,
      extension: [
        expressionExtension(
          calculatedExpressionUrl,
          "%resource.item.where(linkId='base').answer.valueInteger.last() * 2",
        ),
      ],
    },
    {
      linkId: "adult-note",
      text: "Adult note",
      type: "string",
      extension: [
        expressionExtension(
          enableWhenExpressionUrl,
          "%resource.item.where(linkId='base').answer.valueInteger.last() >= 18",
        ),
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const readOnlyExpressionQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-readonly-expression-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-readonly-expression-e2e",
  title: "Browser Read Only Expression E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "lock",
      text: "Lock answers?",
      type: "boolean",
    },
    {
      linkId: "detail",
      text: "Detail",
      type: "string",
      _readOnly: {
        extension: [
          expressionExtension(
            cqfExpressionUrl,
            "%resource.item.where(linkId='lock').answer.valueBoolean.last()",
          ),
        ],
      },
    },
    {
      linkId: "section",
      text: "Section",
      type: "group",
      _readOnly: {
        extension: [
          expressionExtension(
            cqfExpressionUrl,
            "%resource.item.where(linkId='lock').answer.valueBoolean.last()",
          ),
        ],
      },
      item: [{ linkId: "child", text: "Child", type: "string" }],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const dynamicOptionsQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-dynamic-options-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-dynamic-options-e2e",
  title: "Browser Dynamic Options E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "panel",
      text: "Panel",
      type: "group",
      extension: [
        expressionExtension(
          "http://hl7.org/fhir/StructureDefinition/variable",
          "%context.item.where(linkId='source').answer.valueString",
          "sourceValues",
        ),
        expressionExtension(
          "http://hl7.org/fhir/StructureDefinition/variable",
          "%context.item.where(linkId='toggle').answer.valueBoolean",
          "toggleValue",
        ),
      ],
      item: [
        {
          linkId: "source",
          text: "Source",
          type: "string",
        },
        {
          linkId: "mirror",
          text: "Mirror",
          type: "string",
          extension: [
            expressionExtension(answerExpressionUrl, "%sourceValues"),
          ],
        },
        {
          linkId: "toggle",
          text: "Enable red option",
          type: "boolean",
        },
        {
          linkId: "color",
          text: "Favorite color",
          type: "coding",
          extension: [
            itemControl("radio-button"),
            answerOptionToggle({
              valueCoding: {
                system: "http://example.test/color",
                code: "red",
                display: "Red",
              },
            }),
          ],
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/color",
                code: "red",
                display: "Red",
              },
            },
            {
              valueCoding: {
                system: "http://example.test/color",
                code: "green",
                display: "Green",
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const repeatsExpressionQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-repeats-expression-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-repeats-expression-e2e",
  title: "Browser Repeats Expression E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "panel",
      text: "Panel",
      type: "group",
      extension: [
        expressionExtension(
          "http://hl7.org/fhir/StructureDefinition/variable",
          "%context.item.where(linkId='allow').answer.valueBoolean.last()",
          "allowMultiple",
        ),
      ],
      item: [
        {
          linkId: "allow",
          text: "Allow multiple",
          type: "boolean",
        },
        {
          linkId: "favorite",
          text: "Favorite",
          type: "string",
          _repeats: {
            extension: [
              expressionExtension(cqfExpressionUrl, "%allowMultiple"),
            ],
          },
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const quantityUnitQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-quantity-unit-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-quantity-unit-e2e",
  title: "Browser Quantity Unit E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "dose",
      text: "Dose",
      type: "quantity",
      extension: [
        {
          url: unitOptionUrl,
          valueCoding: {
            system: ucumSystem,
            code: "mg",
            display: "mg",
          },
        },
        {
          url: unitOptionUrl,
          valueCoding: {
            system: ucumSystem,
            code: "g",
            display: "g",
          },
        },
        {
          url: unitOpenUrl,
          valueCode: "optionsOrString",
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const terminologyQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-terminology-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-terminology-e2e",
  title: "Browser Terminology E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "contact",
      text: "Contact",
      type: "coding",
      answerValueSet: browserAnswerValueSet,
    },
    {
      linkId: "dose",
      text: "Dose",
      type: "quantity",
      extension: [
        {
          url: unitValueSetUrl,
          valueCanonical: browserUnitValueSet,
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const collapsibleQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-collapsible-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-collapsible-e2e",
  title: "Browser Collapsible E2E Questionnaire",
  status: "active",
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
} satisfies QuestionnaireOf<"r5">;

const exclusiveQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-exclusive-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-exclusive-e2e",
  title: "Browser Exclusive E2E Questionnaire",
  status: "active",
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
} satisfies QuestionnaireOf<"r5">;

const occurrenceQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-occurrence-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-occurrence-e2e",
  title: "Browser Occurrence E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "symptom",
      text: "Symptoms",
      type: "string",
      repeats: true,
      extension: [minOccurs(2), maxOccurs(3)],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const groupOccurrenceExpressionQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-group-occurrence-expression-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-group-occurrence-expression-e2e",
  title: "Browser Group Occurrence Expression E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "panel",
      text: "Panel",
      type: "group",
      extension: [
        expressionExtension(
          "http://hl7.org/fhir/StructureDefinition/variable",
          "%context.item.where(linkId='require-two').answer.valueBoolean.last()",
          "requireTwo",
        ),
        expressionExtension(
          "http://hl7.org/fhir/StructureDefinition/variable",
          "%context.item.where(linkId='limit-one').answer.valueBoolean.last()",
          "limitOne",
        ),
      ],
      item: [
        {
          linkId: "require-two",
          text: "Require two visits",
          type: "boolean",
        },
        {
          linkId: "limit-one",
          text: "Limit to one visit",
          type: "boolean",
        },
        {
          linkId: "visit-min",
          text: "Minimum visits",
          type: "group",
          repeats: true,
          extension: [
            minOccursExpression(
              "iif(%requireTwo.exists() and %requireTwo, 2, 1)",
            ),
            maxOccurs(3),
          ],
          item: [{ linkId: "min-note", text: "Min note", type: "string" }],
        },
        {
          linkId: "visit-max",
          text: "Maximum visits",
          type: "group",
          repeats: true,
          extension: [
            minOccurs(1),
            maxOccursExpression("iif(%limitOne.exists() and %limitOne, 1, 3)"),
          ],
          item: [{ linkId: "max-note", text: "Max note", type: "string" }],
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const signatureQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-signature-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-signature-e2e",
  title: "Browser Signature E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "consent-group",
      text: "Consent group",
      type: "group",
      extension: [{ url: signatureRequiredUrl }],
      item: [
        {
          linkId: "consent-details",
          text: "Consent details",
          type: "string",
        },
      ],
    },
    {
      linkId: "patient-name",
      text: "Patient name",
      type: "string",
      extension: [{ url: signatureRequiredUrl }],
    },
    {
      linkId: "witness-group",
      text: "Witness group",
      type: "group",
      repeats: true,
      required: true,
      extension: [{ url: signatureRequiredUrl }],
      item: [
        {
          linkId: "witness-details",
          text: "Witness details",
          type: "string",
        },
      ],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

const targetConstraintQuestionnaire = {
  resourceType: "Questionnaire",
  id: "browser-target-constraint-e2e",
  url: "https://formbox.healthsamurai.dev/Questionnaire/browser-target-constraint-e2e",
  title: "Browser Target Constraint E2E Questionnaire",
  status: "active",
  item: [
    {
      linkId: "visit",
      text: "Visit",
      type: "group",
      repeats: true,
      required: true,
      extension: [
        targetConstraint(
          "Provide a visit note.",
          "item.where(linkId='note').answer.exists()",
        ),
      ],
      item: [{ linkId: "note", text: "Note", type: "string" }],
    },
  ],
} satisfies QuestionnaireOf<"r5">;

test("loads, validates, posts HTMX actions, preserves repeats, and renders a QuestionnaireResponse", async ({
  page,
}) => {
  const server = await startServer({ questionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.locator("script[src='/htmx.min.js']")).toHaveCount(1);
    await expect(page.locator("script[src*='react']")).toHaveCount(0);
    await expect(page.locator("#questionnaire form")).toHaveAttribute(
      "hx-post",
      "/questionnaire",
    );
    await expect(page.getByLabel("Follow-up note")).toHaveCount(0);

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "false",
    );
    await expect(page.getByText("At least one")).toBeVisible();

    await page.getByLabel("Patient name").fill("Alice Example");
    await aliasInputs(page).first().fill("Old alias");
    await htmxPost(page, aliasAddButton(page));
    await expect(aliasInputs(page)).toHaveCount(2);
    await expect(aliasInputs(page).first()).toHaveValue("Old alias");
    await aliasInputs(page).nth(1).fill("Ally");
    await htmxPost(page, aliasRemoveButtons(page).first());
    await expect(aliasInputs(page)).toHaveCount(1);
    await expect(aliasInputs(page).first()).toHaveValue("Ally");

    await htmxPost(page, symptomAddButton(page));
    await expect(symptomNameInputs(page)).toHaveCount(1);
    await symptomNameInputs(page).first().fill("Headache");
    await page.getByLabel("Severity").selectOption({ label: "Moderate" });

    await page.getByLabel("Follow-up needed").check();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.getByLabel("Follow-up note")).toBeVisible();
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "true",
    );

    await page.getByLabel("Follow-up note").fill("Needs follow-up");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(response.status).toBe("in-progress");
    expect(response.questionnaire).toBe(questionnaire.url);

    const patient = findItem(response.item, "patient");
    expect(firstAnswer(findItem(patient.item, "name")).valueString).toBe(
      "Alice Example",
    );
    expect(firstAnswer(findItem(patient.item, "alias")).valueString).toBe(
      "Ally",
    );

    const symptom = findItem(response.item, "symptom");
    expect(
      firstAnswer(findItem(symptom.item, "symptom-name")).valueString,
    ).toBe("Headache");
    expect(firstAnswer(findItem(symptom.item, "severity")).valueCoding).toEqual(
      {
        system: "https://formbox.healthsamurai.dev/CodeSystem/severity",
        code: "moderate",
        display: "Moderate",
      },
    );

    expect(
      firstAnswer(findItem(response.item, "follow-up-needed")).valueBoolean,
    ).toBe(true);
    expect(
      firstAnswer(findItem(response.item, "follow-up-note")).valueString,
    ).toBe("Needs follow-up");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("submits every supported answer type through HTMX full-form posts", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: allTypesQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("String").fill("alpha");
    await page.getByLabel("Text").fill("long text");
    await page.getByLabel("URL").fill("https://example.org");
    await page.getByLabel("Integer").fill("7");
    await page.getByLabel("Decimal").fill("12.34");
    await page.getByLabel("Boolean").check();
    await page.getByLabel("Date", { exact: true }).fill("2024-05-01");
    await page.getByLabel("Date time").fill("2024-05-01T12:34");
    await page.getByLabel("Time", { exact: true }).fill("08:30");
    await answerField(page, "coding", "system").fill("http://loinc.org");
    await answerField(page, "coding").fill("1234-5");
    await answerField(page, "coding", "display").fill("Mock code");
    await answerField(page, "quantity").fill("5");
    await answerField(page, "reference").fill("Patient/123");
    await answerField(page, "reference", "display").fill("Alice");
    await answerField(page, "attachment").setInputFiles({
      name: "scan.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("scan"),
    });

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    let response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "string")).valueString).toBe(
      "alpha",
    );
    expect(firstAnswer(findItem(response.item, "text")).valueString).toBe(
      "long text",
    );
    expect(firstAnswer(findItem(response.item, "url")).valueUri).toBe(
      "https://example.org",
    );
    expect(firstAnswer(findItem(response.item, "integer")).valueInteger).toBe(
      7,
    );
    expect(firstAnswer(findItem(response.item, "decimal")).valueDecimal).toBe(
      12.34,
    );
    expect(firstAnswer(findItem(response.item, "boolean")).valueBoolean).toBe(
      true,
    );
    expect(firstAnswer(findItem(response.item, "date")).valueDate).toBe(
      "2024-05-01",
    );
    expect(
      firstAnswer(findItem(response.item, "date-time")).valueDateTime,
    ).toBe("2024-05-01T12:34");
    expect(firstAnswer(findItem(response.item, "time")).valueTime).toBe(
      "08:30",
    );
    expect(firstAnswer(findItem(response.item, "coding")).valueCoding).toEqual({
      system: "http://loinc.org",
      code: "1234-5",
      display: "Mock code",
    });
    expect(
      firstAnswer(findItem(response.item, "quantity")).valueQuantity,
    ).toEqual({ value: 5 });
    expect(
      firstAnswer(findItem(response.item, "reference")).valueReference,
    ).toEqual({
      reference: "Patient/123",
      display: "Alice",
    });
    expect(
      firstAnswer(findItem(response.item, "attachment")).valueAttachment,
    ).toEqual({
      contentType: "text/plain",
      data: "c2Nhbg==",
      size: 4,
      title: "scan.txt",
    });

    await htmxPost(page, page.getByRole("button", { name: "Clear" }));
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    response = await readQuestionnaireResponse(page);
    expect(findOptionalItem(response.item, "attachment")).toBeUndefined();
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("updates url enableWhen conditions through browser posts", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: urlEnableWhenQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByLabel("Matching note")).toHaveCount(0);

    await page.getByLabel("Website").fill("https://example.org/target");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.getByLabel("Matching note")).toBeVisible();

    await page.getByLabel("Matching note").fill("URL matched");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "website")).valueUri).toBe(
      "https://example.org/target",
    );
    expect(
      firstAnswer(findItem(response.item, "matching-note")).valueString,
    ).toBe("URL matched");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("preserves seeded timezone dateTime values through browser posts", async ({
  page,
}) => {
  const questionnaire = {
    resourceType: "Questionnaire",
    id: "browser-date-time-timezone-e2e",
    url: "https://formbox.healthsamurai.dev/Questionnaire/browser-date-time-timezone-e2e",
    status: "active",
    item: [
      {
        linkId: "appointment",
        text: "Appointment",
        type: "dateTime",
      },
      {
        linkId: "approximate-appointment",
        text: "Approximate appointment",
        type: "dateTime",
      },
    ],
  } satisfies QuestionnaireOf<"r5">;
  const questionnaireResponse = {
    resourceType: "QuestionnaireResponse",
    status: "in-progress",
    questionnaire: questionnaire.url,
    item: [
      {
        linkId: "appointment",
        answer: [{ valueDateTime: "2024-07-12T14:30:00Z" }],
      },
      {
        linkId: "approximate-appointment",
        answer: [{ valueDateTime: "2024-07" }],
      },
    ],
  } satisfies QuestionnaireResponse;
  const server = await startServer({ questionnaire, questionnaireResponse });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);
    await expect(page.getByLabel("Appointment", { exact: true })).toHaveValue(
      "2024-07-12T14:30",
    );
    await expect(page.getByLabel("Approximate appointment")).toHaveValue(
      "2024-07",
    );

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(
      firstAnswer(findItem(response.item, "appointment")).valueDateTime,
    ).toBe("2024-07-12T14:30:00Z");
    expect(
      firstAnswer(findItem(response.item, "approximate-appointment"))
        .valueDateTime,
    ).toBe("2024-07");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("preserves seeded partial date values through browser posts", async ({
  page,
}) => {
  const questionnaire = {
    resourceType: "Questionnaire",
    id: "browser-partial-date-e2e",
    url: "https://formbox.healthsamurai.dev/Questionnaire/browser-partial-date-e2e",
    status: "active",
    item: [
      {
        linkId: "approximate-start",
        text: "Approximate start",
        type: "date",
      },
      {
        linkId: "year-only-start",
        text: "Year only start",
        type: "date",
      },
    ],
  } satisfies QuestionnaireOf<"r5">;
  const questionnaireResponse = {
    resourceType: "QuestionnaireResponse",
    status: "in-progress",
    questionnaire: questionnaire.url,
    item: [
      {
        linkId: "approximate-start",
        answer: [{ valueDate: "2024-07" }],
      },
      {
        linkId: "year-only-start",
        answer: [{ valueDate: "2024" }],
      },
    ],
  } satisfies QuestionnaireResponse;
  const server = await startServer({ questionnaire, questionnaireResponse });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);
    await expect(page.getByLabel("Approximate start")).toHaveValue("2024-07");
    await expect(page.getByLabel("Year only start")).toHaveValue("2024");

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(
      firstAnswer(findItem(response.item, "approximate-start")).valueDate,
    ).toBe("2024-07");
    expect(
      firstAnswer(findItem(response.item, "year-only-start")).valueDate,
    ).toBe("2024");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("renders timezone dateTime min and max as browser-valid constraints", async ({
  page,
}) => {
  const questionnaire = {
    resourceType: "Questionnaire",
    id: "browser-date-time-bounds-e2e",
    url: "https://formbox.healthsamurai.dev/Questionnaire/browser-date-time-bounds-e2e",
    status: "active",
    item: [
      {
        linkId: "appointment",
        text: "Appointment",
        type: "dateTime",
        extension: [
          { url: minValueUrl, valueDateTime: "2024-07-01T09:00:00Z" },
          { url: maxValueUrl, valueDateTime: "2024-07-31T17:00:00+05:00" },
        ],
      },
    ],
  } satisfies QuestionnaireOf<"r5">;
  const server = await startServer({ questionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    const appointment = page.getByLabel("Appointment");
    await expect(appointment).toHaveAttribute("min", "2024-07-01T09:00");
    await expect(appointment).toHaveAttribute("max", "2024-07-31T17:00");
    await appointment.fill("2024-06-30T12:00");
    expect(await hasRangeUnderflow(appointment)).toBe(true);
    await appointment.fill("2024-08-01T12:00");
    expect(await hasRangeOverflow(appointment)).toBe(true);
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("submits second-precision dateTime and time values through browser posts", async ({
  page,
}) => {
  const questionnaire = {
    resourceType: "Questionnaire",
    id: "browser-temporal-seconds-e2e",
    url: "https://formbox.healthsamurai.dev/Questionnaire/browser-temporal-seconds-e2e",
    status: "active",
    item: [
      {
        linkId: "appointment",
        text: "Appointment",
        type: "dateTime",
      },
      {
        linkId: "dose-time",
        text: "Dose time",
        type: "time",
      },
    ],
  } satisfies QuestionnaireOf<"r5">;
  const server = await startServer({ questionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    const appointment = page.getByLabel("Appointment");
    const doseTime = page.getByLabel("Dose time");
    await appointment.fill("2024-07-12T14:30:15.123");
    await doseTime.fill("08:30:15.123");
    expect(await hasStepMismatch(appointment)).toBe(false);
    expect(await hasStepMismatch(doseTime)).toBe(false);

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(
      firstAnswer(findItem(response.item, "appointment")).valueDateTime,
    ).toBe("2024-07-12T14:30:15.123");
    expect(firstAnswer(findItem(response.item, "dose-time")).valueTime).toBe(
      "08:30:15.123",
    );
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("posts initially selected and response-selected options through browser form submission", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: initiallySelectedQuestionnaire,
    questionnaireResponse: initiallySelectedResponse,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByLabel("Food").locator("option:checked")).toHaveText(
      "sushi",
    );
    await expect(page.getByLabel("Pet").locator("option:checked")).toHaveText(
      "dog",
    );

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "food")).valueString).toBe(
      "sushi",
    );
    expect(firstAnswer(findItem(response.item, "pet")).valueString).toBe("dog");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("submits R4 choice and open-choice items through HTMX full-form posts", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: r4ChoiceQuestionnaire,
    fhirVersion: "r4",
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await answerField(page, "r4-choice").selectOption({ label: "Phone" });
    await answerField(page, "r4-open-choice").selectOption({
      label: "Specify other",
    });
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await answerField(page, "r4-open-choice").last().fill("Pager");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse<"r4">(page);
    expect(
      response.item?.find((item) => item.linkId === "r4-choice")?.answer,
    ).toEqual([
      {
        valueCoding: {
          system: "http://example.test/r4-choice",
          code: "phone",
          display: "Phone",
        },
      },
    ]);
    expect(
      response.item?.find((item) => item.linkId === "r4-open-choice")?.answer,
    ).toEqual([{ valueString: "Pager" }]);
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("submits supported question item controls through HTMX full-form posts", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: controlQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("Dropdown").selectOption({ label: "Drop" });
    await page.getByLabel("Autocomplete").selectOption({ label: "Auto" });
    await page.getByLabel("Lookup").selectOption({ label: "Lookup" });
    await page
      .locator('[data-fb-question="radio"] input[type="radio"]')
      .first()
      .check();
    await page.getByLabel("Check A").check();
    await page.getByLabel("Check B").check();
    await setAnswerInputValue(page, "slider", "4");
    await setAnswerInputValue(page, "quantity-slider", "2");
    await answerField(page, "spinner").fill("8.5");
    await answerField(page, "quantity-spinner").fill("3.5");
    await expect(page.getByText("No pain")).toBeVisible();
    await expect(page.getByText("Worst pain")).toBeVisible();
    await expect(page.getByText("points")).toBeVisible();
    await expect(page.getByLabel("Text box")).toHaveAttribute(
      "placeholder",
      "Prompt text",
    );
    await expect(
      page.getByRole("button", { name: "More information" }),
    ).toBeVisible();
    await expect(
      page.getByRole("tooltip").filter({ hasText: "Help text" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Legal information" }),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Legal text" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "More context" }),
    ).toBeVisible();
    await expect(
      page.getByRole("tooltip").filter({ hasText: "Flyover text" }),
    ).toBeVisible();
    await expect(page.getByText("Inline display")).toBeVisible();
    await page.getByLabel("Text box").fill("text box value");
    await page.getByLabel("List child").fill("list value");
    await page
      .locator('[data-fb-link-id="table-choice"][type="radio"]')
      .first()
      .check();
    await page
      .locator('[data-fb-link-id="htable-choice"][type="radio"]')
      .first()
      .check();
    await page.getByLabel("Grid child").fill("grid value");
    await page.getByLabel("Tab child", { exact: true }).fill("tab value");
    await htmxPost(page, page.getByRole("tab", { name: "Tab two" }));
    await expect(page.getByLabel("Tab child", { exact: true })).toHaveCount(0);
    await page
      .getByLabel("Tab child two", { exact: true })
      .fill("tab two value");
    await htmxPost(
      page,
      page.locator('[data-fb-group-list="visits"] button').first(),
    );
    await page.getByLabel("Visit note").fill("visit value");
    await page.getByLabel("Visit score").fill("6");

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(
      firstAnswer(findItem(response.item, "dropdown")).valueCoding,
    ).toEqual({
      system: "http://example.test/control",
      code: "drop",
      display: "Drop",
    });
    expect(
      firstAnswer(findItem(response.item, "autocomplete")).valueCoding,
    ).toEqual({
      system: "http://example.test/control",
      code: "auto",
      display: "Auto",
    });
    expect(firstAnswer(findItem(response.item, "lookup")).valueCoding).toEqual({
      system: "http://example.test/control",
      code: "lookup",
      display: "Lookup",
    });
    expect(firstAnswer(findItem(response.item, "radio")).valueCoding).toEqual({
      system: "http://example.test/control",
      code: "radio",
      display: "Radio",
    });
    expect(
      findItem(response.item, "checkbox").answer?.map(
        (answer) => answer.valueCoding,
      ),
    ).toEqual([
      {
        system: "http://example.test/control",
        code: "check-a",
        display: "Check A",
      },
      {
        system: "http://example.test/control",
        code: "check-b",
        display: "Check B",
      },
    ]);
    expect(firstAnswer(findItem(response.item, "slider")).valueInteger).toBe(4);
    expect(
      firstAnswer(findItem(response.item, "quantity-slider")).valueQuantity,
    ).toEqual({
      value: 2,
    });
    expect(firstAnswer(findItem(response.item, "spinner")).valueDecimal).toBe(
      8.5,
    );
    expect(
      firstAnswer(findItem(response.item, "quantity-spinner")).valueQuantity,
    ).toEqual({
      value: 3.5,
    });
    expect(firstAnswer(findItem(response.item, "text-box")).valueString).toBe(
      "text box value",
    );
    expect(
      firstAnswer(findItem(findItem(response.item, "list").item, "list-child"))
        .valueString,
    ).toBe("list value");
    expect(
      firstAnswer(
        findItem(
          findItem(findItem(response.item, "grid").item, "grid-row").item,
          "grid-child",
        ),
      ).valueString,
    ).toBe("grid value");
    const table = findItem(response.item, "table");
    expect(
      firstAnswer(findItem(table.item, "table-choice")).valueCoding,
    ).toEqual({
      system: "http://example.test/control",
      code: "table",
      display: "Table",
    });
    const htable = findItem(response.item, "htable");
    expect(
      firstAnswer(findItem(htable.item, "htable-choice")).valueCoding,
    ).toEqual({
      system: "http://example.test/control",
      code: "htable",
      display: "HTable",
    });
    const visits = findItem(response.item, "visits");
    expect(firstAnswer(findItem(visits.item, "visit-note")).valueString).toBe(
      "visit value",
    );
    expect(firstAnswer(findItem(visits.item, "visit-score")).valueInteger).toBe(
      6,
    );
    const tabs = findItem(response.item, "tabs");
    const tabOne = findItem(tabs.item, "tab-one");
    expect(firstAnswer(findItem(tabOne.item, "tab-child")).valueString).toBe(
      "tab value",
    );
    const tabTwo = findItem(tabs.item, "tab-two");
    expect(
      firstAnswer(findItem(tabTwo.item, "tab-child-two")).valueString,
    ).toBe("tab two value");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("navigates page item controls while preserving off-page answers", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: pageControlQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByText("Header")).toBeVisible();
    await expect(page.getByText("Footer")).toBeVisible();
    await expect(page.getByText("Page one")).toBeVisible();
    await expect(page.getByLabel("Page note")).toHaveCount(0);

    await page.getByLabel("Page name", { exact: true }).fill("page-one value");
    await page.getByLabel("Page name detail").fill("nested page-one value");
    await htmxPost(page, page.getByRole("button", { name: "Next" }));
    await expect(page.getByLabel("Page name", { exact: true })).toHaveCount(0);
    await expect(page.getByLabel("Page name detail")).toHaveCount(0);
    await expect(page.getByText("Page two")).toBeVisible();
    await page.getByLabel("Page note").fill("page-two value");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    const pageName = findItem(
      findItem(response.item, "page-one").item,
      "page-name",
    );
    expect(firstAnswer(pageName).valueString).toBe("page-one value");
    expect(
      firstAnswer(findItem(firstAnswer(pageName).item, "page-name-detail"))
        .valueString,
    ).toBe("nested page-one value");
    expect(
      firstAnswer(
        findItem(findItem(response.item, "page-two").item, "page-note"),
      ).valueString,
    ).toBe("page-two value");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("localizes action labels after a language full-form post", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: localizedActionsQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByRole("combobox").selectOption("es");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await expect(
      page.getByRole("button", { name: strings.es.form.submit }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit" })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: strings.es.pagination.next }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: strings.es.collapsible.expand }),
    ).toBeVisible();
    await expect(aliasAddButton(page)).toHaveText(
      strings.es.selection.addAnother,
    );

    await htmxPost(page, aliasAddButton(page));
    await expect(aliasRemoveButtons(page).first()).toHaveText(
      strings.es.group.removeSection,
    );

    await htmxPost(
      page,
      page.getByRole("button", { name: strings.es.pagination.next }),
    );
    await expect(
      page.getByRole("button", { name: strings.es.pagination.previous }),
    ).toBeVisible();
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("renders itemShortText as responsive browser label text", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "age",
          text: "How old are you in completed years?",
          type: "string",
          extension: [{ url: shortTextUrl, valueString: "Age in years" }],
        },
      ],
    },
  });

  try {
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto(server.url);
    await expect(
      page.getByText("How old are you in completed years?"),
    ).toBeVisible();
    await expect(page.getByText("Age in years")).toBeHidden();

    await page.setViewportSize({ width: 500, height: 700 });
    await expect(page.getByText("Age in years")).toBeVisible();
    await expect(
      page.getByText("How old are you in completed years?"),
    ).toBeHidden();
    await page.getByLabel("Age in years").fill("42");
    await expect(page.getByLabel("Age in years")).toHaveValue("42");
  } finally {
    await server.close();
  }
});

test("preserves read-only and hidden values while omitting dynamically disabled answers", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: advancedQuestionnaire,
    questionnaireResponse: advancedResponse,
    mode: "capture",
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByLabel("Read only", { exact: true })).toHaveValue(
      "server-readonly",
    );
    await expect(page.getByLabel("Read only", { exact: true })).toHaveAttribute(
      "readonly",
      "",
    );
    await expect(page.getByLabel("Read only child")).toHaveValue(
      "server-child",
    );
    await expect(page.getByLabel("Read only child")).toHaveAttribute(
      "readonly",
      "",
    );
    await expect(page.getByLabel("High")).toBeChecked();
    await expect(page.getByLabel("High")).toBeDisabled();
    await expect(page.getByLabel("First readonly check")).toBeChecked();
    await expect(page.getByLabel("First readonly check")).toBeDisabled();
    await expect(page.getByLabel("Second readonly check")).toBeChecked();
    await expect(page.getByLabel("Second readonly check")).toBeDisabled();
    await expect(page.getByLabel("Secret")).toHaveCount(0);
    await expect(hiddenAnswerInput(page, "secret")).toHaveValue("secret-1");
    await expect(page.getByLabel("Protected")).toBeVisible();
    await expect(page.getByLabel("Protected")).toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Hidden disabled")).toHaveCount(0);
    await expect(page.getByLabel("Plain disabled")).toHaveCount(0);
    await expect(page.getByLabel("Capture only")).toBeVisible();
    await expect(page.getByLabel("Display only")).toHaveCount(0);
    await expect(page.getByLabel("Display filled")).toHaveCount(0);
    await expect(page.getByLabel("Display empty")).toHaveCount(0);
    await expect(page.getByLabel("Hybrid filled")).toBeVisible();

    await setAnswerInputValue(page, "readonly", "tampered-readonly");
    await setAnswerInputValue(page, "readonly-child", "tampered-child");
    await setAnswerInputValue(page, "protected", "tampered-protected");
    await page.getByLabel("Capture only").fill("capture-2");
    await page.getByLabel("Hybrid filled").fill("hybrid-2");

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    let response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "gate")).valueBoolean).toBe(
      false,
    );
    expect(firstAnswer(findItem(response.item, "readonly")).valueString).toBe(
      "server-readonly",
    );
    expect(
      firstAnswer(
        findItem(
          findItem(response.item, "readonly-group").item,
          "readonly-child",
        ),
      ).valueString,
    ).toBe("server-child");
    expect(
      firstAnswer(findItem(response.item, "readonly-radio")).valueCoding,
    ).toEqual({
      system: "http://example.test/readonly",
      code: "high",
      display: "High",
    });
    expect(
      findItem(response.item, "readonly-checks").answer?.map(
        (answer) => answer.valueString,
      ),
    ).toEqual(["First readonly check", "Second readonly check"]);
    expect(firstAnswer(findItem(response.item, "secret")).valueString).toBe(
      "secret-1",
    );
    expect(
      firstAnswer(findItem(response.item, "capture-only")).valueString,
    ).toBe("capture-2");
    expect(
      firstAnswer(findItem(response.item, "hybrid-filled")).valueString,
    ).toBe("hybrid-2");
    expect(findOptionalItem(response.item, "protected")).toBeUndefined();
    expect(findOptionalItem(response.item, "hidden-disabled")).toBeUndefined();
    expect(findOptionalItem(response.item, "plain-disabled")).toBeUndefined();
    expect(findOptionalItem(response.item, "display-only")).toBeUndefined();
    expect(findOptionalItem(response.item, "display-filled")).toBeUndefined();

    await page.getByLabel("Gate").check();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.getByLabel("Protected")).not.toHaveAttribute(
      "readonly",
      "",
    );
    await expect(page.getByLabel("Hidden disabled")).toBeVisible();
    await expect(page.getByLabel("Plain disabled")).toBeVisible();

    await page.getByLabel("Protected").fill("protected-enabled");
    await page.getByLabel("Hidden disabled").fill("hidden-enabled");
    await page.getByLabel("Plain disabled").fill("plain-enabled");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "protected")).valueString).toBe(
      "protected-enabled",
    );
    expect(
      firstAnswer(findItem(response.item, "hidden-disabled")).valueString,
    ).toBe("hidden-enabled");
    expect(
      firstAnswer(findItem(response.item, "plain-disabled")).valueString,
    ).toBe("plain-enabled");

    await page.getByLabel("Gate").uncheck();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.getByLabel("Protected")).toBeVisible();
    await expect(page.getByLabel("Protected")).toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Hidden disabled")).toHaveCount(0);
    await expect(page.getByLabel("Plain disabled")).toHaveCount(0);
    response = await readQuestionnaireResponse(page);
    expect(findOptionalItem(response.item, "protected")).toBeUndefined();
    expect(findOptionalItem(response.item, "hidden-disabled")).toBeUndefined();
    expect(findOptionalItem(response.item, "plain-disabled")).toBeUndefined();
    expect(firstAnswer(findItem(response.item, "readonly")).valueString).toBe(
      "server-readonly",
    );
    expect(
      firstAnswer(findItem(response.item, "readonly-radio")).valueCoding,
    ).toEqual({
      system: "http://example.test/readonly",
      code: "high",
      display: "High",
    });
    expect(
      findItem(response.item, "readonly-checks").answer?.map(
        (answer) => answer.valueString,
      ),
    ).toEqual(["First readonly check", "Second readonly check"]);
    expect(firstAnswer(findItem(response.item, "secret")).valueString).toBe(
      "secret-1",
    );
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("validates and serializes item signatures through HTMX posts", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: signatureQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("Consent details").fill("Accepted");
    await page.getByLabel("Patient name").fill("Alice");
    await page.getByLabel("Witness details").fill("Witnessed");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "false",
    );
    await expect(page.getByText("Signature is required.")).toHaveCount(3);

    await setSignatureValue(page, "consent-group", signatureDataUrl);
    await setSignatureValue(page, "patient-name", signatureDataUrl);
    await setSignatureValue(page, "witness-group", signatureDataUrl);
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "true",
    );
    const response = await readQuestionnaireResponse(page);
    const group = findItem(response.item, "consent-group");
    expect(group.extension).toEqual([
      { url: responseSignatureUrl, valueSignature: signature },
    ]);
    expect(
      firstAnswer(findItem(group.item, "consent-details")).valueString,
    ).toBe("Accepted");

    const question = findItem(response.item, "patient-name");
    expect(question.extension).toEqual([
      { url: responseSignatureUrl, valueSignature: signature },
    ]);
    expect(firstAnswer(question).valueString).toBe("Alice");

    const witnessGroup = findItem(response.item, "witness-group");
    expect(witnessGroup.extension).toEqual([
      { url: responseSignatureUrl, valueSignature: signature },
    ]);
    expect(
      firstAnswer(findItem(witnessGroup.item, "witness-details")).valueString,
    ).toBe("Witnessed");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("validates repeated group targetConstraint through HTMX posts", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: targetConstraintQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByText("Provide a visit note.")).toHaveCount(0);
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "false",
    );
    await expect(page.getByText("Provide a visit note.")).toBeVisible();

    await page.getByLabel("Note").fill("Seen today");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "true",
    );
    await expect(page.getByText("Provide a visit note.")).toHaveCount(0);

    const response = await readQuestionnaireResponse(page);
    const visit = findItem(response.item, "visit");
    expect(firstAnswer(findItem(visit.item, "note")).valueString).toBe(
      "Seen today",
    );
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("recomputes calculated and enableWhen expressions through HTMX posts", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: expressionQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("Base").fill("17");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.getByLabel("Double")).toHaveValue("34");
    await expect(page.getByLabel("Adult note")).toHaveCount(0);

    await page.getByLabel("Base").fill("18");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.getByLabel("Double")).toHaveValue("36");
    await expect(page.getByLabel("Adult note")).toBeVisible();

    await page.getByLabel("Adult note").fill("Visible after calculation");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "base")).valueInteger).toBe(18);
    expect(firstAnswer(findItem(response.item, "double")).valueInteger).toBe(
      36,
    );
    expect(firstAnswer(findItem(response.item, "adult-note")).valueString).toBe(
      "Visible after calculation",
    );
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("applies readOnlyExpression and group read-only cascade through HTMX posts", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: readOnlyExpressionQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByLabel("Detail")).not.toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Child")).not.toHaveAttribute("readonly", "");

    await page.getByLabel("Lock answers?").check();
    await page.getByLabel("Detail").fill("tampered-detail");
    await page.getByLabel("Child").fill("tampered-child");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await expect(page.getByLabel("Detail")).toHaveAttribute("readonly", "");
    await expect(page.getByLabel("Child")).toHaveAttribute("readonly", "");

    const response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "lock")).valueBoolean).toBe(
      true,
    );
    expect(findOptionalItem(response.item, "detail")).toBeUndefined();
    expect(findOptionalItem(response.item, "section")).toBeUndefined();
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("updates answerExpression and answer option toggles through HTMX posts", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: dynamicOptionsQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByRole("radio", { name: "Red" })).toBeDisabled();
    await page.getByLabel("Source").fill("Alpha");
    await page.getByLabel("Enable red option").check();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await expect(page.getByLabel("Mirror").locator("option")).toContainText([
      "",
      "Alpha",
    ]);
    await expect(page.getByRole("radio", { name: "Red" })).not.toBeDisabled();
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("keeps the first repeated answer when repeatsExpression turns repeats off", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: repeatsExpressionQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("Allow multiple").check();
    await page.getByLabel("Favorite").fill("Blue");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await htmxPost(page, page.getByRole("button", { name: "Add another" }));
    await answerField(page, "favorite").nth(1).fill("Green");

    await page.getByLabel("Allow multiple").uncheck();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    const panel = findItem(response.item, "panel");
    expect(findItem(panel.item, "favorite").answer).toEqual([
      { valueString: "Blue" },
    ]);
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("keeps custom quantity units selectable after switching to predefined units", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: quantityUnitQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await answerField(page, "dose", "value").fill("5");
    await answerField(page, "dose", "unit").selectOption({
      label: "Specify other",
    });
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await answerField(page, "dose", "unit").last().fill("tablespoon");
    await htmxPost(
      page,
      page.getByRole("button", { name: strings.en.dialog.submit }),
    );
    await expect(
      answerField(page, "dose", "unit").locator("option", {
        hasText: "tablespoon",
      }),
    ).toHaveCount(1);

    await answerField(page, "dose", "unit").selectOption({ label: "mg" });
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await expect(
      answerField(page, "dose", "unit").locator("option", {
        hasText: "tablespoon",
      }),
    ).toHaveCount(1);
    const response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "dose")).valueQuantity).toEqual({
      value: 5,
      system: ucumSystem,
      code: "mg",
      unit: "mg",
    });
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("opens a blank custom quantity unit form from a predefined unit", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: quantityUnitQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await answerField(page, "dose", "value").fill("5");
    await answerField(page, "dose", "unit").selectOption({ label: "mg" });
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await answerField(page, "dose", "unit").selectOption({
      label: "Specify other",
    });
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    await expect(answerField(page, "dose", "unit").last()).toHaveValue("");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("expands terminology-backed answer and unit options through browser posts", async ({
  page,
}) => {
  const restoreFetch = mockTerminologyFetch({
    [browserAnswerValueSet]: [
      {
        system: "http://example.test/contact",
        code: "email",
        display: "Email",
      },
      {
        system: "http://example.test/contact",
        code: "phone",
        display: "Phone",
      },
    ],
    [browserUnitValueSet]: [
      {
        system: ucumSystem,
        code: "mg",
        display: "mg",
      },
      {
        system: ucumSystem,
        code: "g",
        display: "g",
      },
    ],
  });
  const server = await startServer({ questionnaire: terminologyQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("Contact").selectOption({ label: "Phone" });
    await answerField(page, "dose", "value").fill("250");
    await answerField(page, "dose", "unit").selectOption({ label: "mg" });
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    expect(firstAnswer(findItem(response.item, "contact")).valueCoding).toEqual(
      {
        system: "http://example.test/contact",
        code: "phone",
        display: "Phone",
      },
    );
    expect(firstAnswer(findItem(response.item, "dose")).valueQuantity).toEqual({
      value: 250,
      system: ucumSystem,
      code: "mg",
      unit: "mg",
    });
    expect(failures()).toEqual([]);
  } finally {
    restoreFetch();
    await server.close();
  }
});

test("toggles collapsible items through HTMX posts and preserves child answers", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: collapsibleQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByLabel("Nickname")).toBeHidden();
    await expect(answerField(page, "issue")).toBeHidden();

    await htmxPost(page, collapsibleToggle(page, "demographics"));
    await expect(page.getByLabel("Nickname")).toBeVisible();
    await page.getByLabel("Nickname").fill("Nico");

    await htmxPost(page, collapsibleToggle(page, "issue"));
    await expect(answerField(page, "issue")).toBeVisible();
    await answerField(page, "issue").fill("Headache");
    await page.getByLabel("Issue note").fill("Started today");

    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(
      page.locator('[data-fb-collapsible="demographics"]'),
    ).toHaveAttribute("open", "");
    await expect(page.locator('[data-fb-collapsible="issue"]')).toHaveAttribute(
      "open",
      "",
    );

    let response = await readQuestionnaireResponse(page);
    expect(
      firstAnswer(
        findItem(findItem(response.item, "demographics").item, "nickname"),
      ).valueString,
    ).toBe("Nico");
    const issue = findItem(response.item, "issue");
    expect(firstAnswer(issue).valueString).toBe("Headache");
    expect(
      firstAnswer(findItem(firstAnswer(issue).item, "issue-note")).valueString,
    ).toBe("Started today");

    await htmxPost(page, collapsibleToggle(page, "demographics"));
    await expect(page.getByLabel("Nickname")).toBeHidden();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    response = await readQuestionnaireResponse(page);
    expect(
      firstAnswer(
        findItem(findItem(response.item, "demographics").item, "nickname"),
      ).valueString,
    ).toBe("Nico");
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("replaces exclusive checkbox options across stateless HTMX posts", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: exclusiveQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await page.getByLabel("None of the above").check();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    let response = await readQuestionnaireResponse(page);
    expect(
      findItem(response.item, "symptoms").answer?.map(
        (answer) => answer.valueString,
      ),
    ).toEqual(["None of the above"]);

    await page.getByLabel("Fever").check();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    response = await readQuestionnaireResponse(page);
    expect(
      findItem(response.item, "symptoms").answer?.map(
        (answer) => answer.valueString,
      ),
    ).toEqual(["Fever"]);
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("validates repeated minOccurs and stops add actions at maxOccurs", async ({
  page,
}) => {
  const server = await startServer({ questionnaire: occurrenceQuestionnaire });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(symptomInputs(page)).toHaveCount(2);
    await symptomInputs(page).first().fill("Cough");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "false",
    );
    await expect(page.getByText("least 2")).toBeVisible();

    await symptomInputs(page).nth(1).fill("Fever");
    await htmxPost(page, page.getByRole("button", { name: "Add another" }));
    await expect(symptomInputs(page)).toHaveCount(3);
    await symptomInputs(page).nth(2).fill("Fatigue");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(page.locator("[data-testid='response']")).toHaveAttribute(
      "data-valid",
      "true",
    );
    await expect(page.getByRole("button", { name: "Add another" })).toHaveCount(
      0,
    );

    const response = await readQuestionnaireResponse(page);
    expect(
      findItem(response.item, "symptom").answer?.map(
        (answer) => answer.valueString,
      ),
    ).toEqual(["Cough", "Fever", "Fatigue"]);
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("applies expression-driven repeated group occurrence limits", async ({
  page,
}) => {
  const server = await startServer({
    questionnaire: groupOccurrenceExpressionQuestionnaire,
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    const minNotes = page.locator(
      '[data-fb-question="min-note"] input[data-fb-field="value"]',
    );
    const maxNotes = page.locator(
      '[data-fb-question="max-note"] input[data-fb-field="value"]',
    );
    await expect(minNotes).toHaveCount(1);
    await expect(maxNotes).toHaveCount(1);

    await page.getByLabel("Require two visits").check();
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));
    await expect(minNotes).toHaveCount(2);

    await page.getByLabel("Limit to one visit").check();
    await htmxPost(
      page,
      page.locator('[data-fb-group-list="visit-max"] button').first(),
    );
    await expect(maxNotes).toHaveCount(1);
    await expect(
      page.locator(
        '[data-fb-group-list="visit-max"] button[data-fb-field="add-action"]',
      ),
    ).toHaveCount(0);

    await minNotes.first().fill("First minimum visit");
    await minNotes.nth(1).fill("Second minimum visit");
    await maxNotes.first().fill("Only maximum visit");
    await htmxPost(page, page.getByRole("button", { name: "Submit" }));

    const response = await readQuestionnaireResponse(page);
    const panel = findItem(response.item, "panel");
    const minVisits =
      panel.item?.filter((item) => item.linkId === "visit-min") ?? [];
    const maxVisits =
      panel.item?.filter((item) => item.linkId === "visit-max") ?? [];

    expect(
      minVisits.map(
        (visit) => firstAnswer(findItem(visit.item, "min-note")).valueString,
      ),
    ).toEqual(["First minimum visit", "Second minimum visit"]);
    expect(
      maxVisits.map(
        (visit) => firstAnswer(findItem(visit.item, "max-note")).valueString,
      ),
    ).toEqual(["Only maximum visit"]);
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

test("applies usageMode visibility in display mode", async ({ page }) => {
  const server = await startServer({
    questionnaire: advancedQuestionnaire,
    questionnaireResponse: {
      ...advancedResponse,
      status: "completed",
    },
    mode: "display",
  });
  const failures = collectFailures(page);

  try {
    await page.goto(server.url);
    await page.waitForFunction(() => "htmx" in globalThis);

    await expect(page.getByLabel("Capture only")).toHaveCount(0);
    await expect(page.getByLabel("Display only")).toBeVisible();
    await expect(page.getByLabel("Display filled")).toBeVisible();
    await expect(page.getByLabel("Display empty")).toHaveCount(0);
    await expect(page.getByLabel("Hybrid filled")).toBeVisible();
    expect(failures()).toEqual([]);
  } finally {
    await server.close();
  }
});

function collectFailures(page: Page): () => readonly string[] {
  const failures: string[] = [];

  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (response.url().endsWith("/questionnaire") && !response.ok()) {
      failures.push(`POST /questionnaire returned ${response.status()}`);
    }
  });

  return () => failures;
}

function aliasInputs(page: Page): Locator {
  return page.locator(
    '[data-fb-question="alias"] input[data-fb-field="value"]',
  );
}

function aliasAddButton(page: Page): Locator {
  return page.locator(
    '[data-fb-question="alias"] button[data-fb-field="add-action"]',
  );
}

function aliasRemoveButtons(page: Page): Locator {
  return page.locator(
    '[data-fb-question="alias"] button[data-fb-field="remove-action"]',
  );
}

function symptomAddButton(page: Page): Locator {
  return page.locator(
    '[data-fb-group-list="symptom"] button[data-fb-field="add-action"]',
  );
}

function symptomNameInputs(page: Page): Locator {
  return page.locator(
    '[data-fb-question="symptom-name"] input[data-fb-field="value"]',
  );
}

function symptomInputs(page: Page): Locator {
  return page.locator(
    '[data-fb-question="symptom"] input[data-fb-field="value"]',
  );
}

function hiddenAnswerInput(page: Page, linkId: string): Locator {
  return page.locator(
    `input[type="hidden"][name="fb[answer][${linkId}][value]"]`,
  );
}

function collapsibleToggle(page: Page, linkId: string): Locator {
  return page.locator(`[data-fb-collapsible="${linkId}"] button`).first();
}

function answerField(page: Page, linkId: string, field = "value"): Locator {
  return page.locator(
    `[data-fb-link-id="${linkId}"][data-fb-field="${field}"]`,
  );
}

async function hasRangeUnderflow(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new TypeError("Expected an input element");
    }

    return element.validity.rangeUnderflow;
  });
}

async function hasRangeOverflow(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new TypeError("Expected an input element");
    }

    return element.validity.rangeOverflow;
  });
}

async function hasStepMismatch(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new TypeError("Expected an input element");
    }

    return element.validity.stepMismatch;
  });
}

async function setAnswerInputValue(
  page: Page,
  linkId: string,
  value: string,
): Promise<void> {
  await page
    .locator(`[data-fb-link-id="${linkId}"][data-fb-field="value"]`)
    .evaluate((element, next) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.value = next;
        return;
      }

      throw new Error("Expected an input or textarea element");
    }, value);
}

async function setSignatureValue(
  page: Page,
  linkId: string,
  value: string,
): Promise<void> {
  await answerField(page, linkId, "signature").evaluate((element, next) => {
    if (element instanceof HTMLInputElement) {
      element.value = next;
      return;
    }

    throw new Error("Expected a signature input element");
  }, value);
}

async function htmxPost(page: Page, locator: Locator): Promise<void> {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/questionnaire") &&
      response.request().method() === "POST",
  );
  await locator.click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
}

async function readQuestionnaireResponse<V extends FhirVersion = "r5">(
  page: Page,
): Promise<QuestionnaireResponseOf<V>> {
  const text = await page.locator("[data-testid='response'] pre").textContent();
  if (text === null) {
    throw new Error("QuestionnaireResponse output was not rendered");
  }

  return JSON.parse(text) as QuestionnaireResponseOf<V>;
}

function findItem(
  items: readonly ResponseItem[] | undefined,
  linkId: string,
): ResponseItem {
  const item = items?.find((candidate) => candidate.linkId === linkId);

  if (!item) {
    throw new Error(`QuestionnaireResponse item ${linkId} was not found`);
  }

  return item;
}

function findOptionalItem(
  items: readonly ResponseItem[] | undefined,
  linkId: string,
): ResponseItem | undefined {
  return items?.find((candidate) => candidate.linkId === linkId);
}

function firstAnswer(
  item: ResponseItem,
): NonNullable<ResponseItem["answer"]>[number] {
  const answer = item.answer?.[0];

  if (!answer) {
    throw new Error(`QuestionnaireResponse item ${item.linkId} has no answer`);
  }

  return answer;
}

function mockTerminologyFetch(
  expansions: Record<string, readonly Coding[]>,
): () => void {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input) => {
    const url = getFetchUrl(input);
    const valueSet = new URL(url).searchParams.get("url");
    const contains = valueSet === null ? undefined : expansions[valueSet];

    if (contains === undefined) {
      return new Response(`Unexpected terminology request: ${url}`, {
        status: 500,
      });
    }

    return Response.json(
      { expansion: { contains } },
      {
        headers: { "content-type": "application/fhir+json" },
      },
    );
  }) satisfies typeof fetch;

  return () => {
    globalThis.fetch = originalFetch;
  };
}

function getFetchUrl(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

async function startServer<V extends FhirVersion = "r5">(
  options: TestServerOptions<V>,
): Promise<{
  readonly url: string;
  close(): Promise<void>;
}>;
async function startServer<V extends FhirVersion = "r5">(
  options: TestServerOptions<V>,
): Promise<{
  readonly url: string;
  close(): Promise<void>;
}> {
  const htmxScript = await readFile(htmxScriptPath, "utf8");
  const server = createServer((message, response) => {
    handleRequest(message, response, htmxScript, options).catch(
      (error: unknown) => {
        response.writeHead(500, {
          "content-type": "text/plain; charset=utf-8",
        });
        response.end(error instanceof Error ? error.stack : String(error));
      },
    );
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();

  if (address === null || typeof address === "string") {
    throw new Error("Node test server did not bind to a TCP address");
  }

  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }),
  };
}

async function handleRequest(
  message: IncomingMessage,
  response: ServerResponse,
  htmxScript: string,
  options: TestServerOptions<FhirVersion>,
): Promise<void> {
  const requestUrl = new URL(message.url ?? "/", "http://127.0.0.1");

  if (message.method === "GET" && requestUrl.pathname === "/") {
    sendHtml(response, renderPage(await renderForm(options)));
    return;
  }

  if (message.method === "GET" && requestUrl.pathname === "/htmx.min.js") {
    response.writeHead(200, {
      "content-type": "text/javascript; charset=utf-8",
    });
    response.end(htmxScript);
    return;
  }

  if (message.method === "POST" && requestUrl.pathname === "/questionnaire") {
    sendHtml(response, await renderForm(options, await readFormData(message)));
    return;
  }

  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  response.end("Not found");
}

function renderPage(form: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>HTMX browser test</title>
    <script src="/htmx.min.js"></script>
  </head>
      <body>${form}</body>
</html>`;
}

async function renderForm(
  options: TestServerOptions<FhirVersion>,
  formData?: FormData | undefined,
): Promise<string> {
  let responseHtml = "";
  const renderer = new QuestionnaireRenderer({
    token: "form",
    questionnaire: options.questionnaire,
    questionnaireResponse:
      formData === undefined ? options.questionnaireResponse : undefined,
    fhirVersion: options.fhirVersion ?? "r5",
    mode: options.mode,
    templates: {
      ...defaultTemplates,
      Form({ fields }) {
        return [
          `<div id="questionnaire">`,
          `<form method="post" action="/questionnaire" enctype="multipart/form-data" hx-post="/questionnaire" hx-encoding="multipart/form-data" hx-target="#questionnaire" hx-swap="outerHTML" hx-include="closest form">`,
          fields,
          "</form>",
          responseHtml,
          "</div>",
        ].join("");
      },
    },
  });

  try {
    if (formData) {
      const result = await renderer.process(formData);
      if (result.submitted) {
        responseHtml = renderQuestionnaireResponse(
          renderer.getQuestionnaireResponse(),
          result.valid,
        );
      }
    }

    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

function renderQuestionnaireResponse(
  response: QuestionnaireResponse,
  valid: boolean,
): string {
  return [
    `<section data-testid="response" data-valid="${String(valid)}">`,
    `<h2>QuestionnaireResponse</h2>`,
    `<pre>${escapeHtml(JSON.stringify(response, undefined, 2))}</pre>`,
    `</section>`,
  ].join("");
}

async function readFormData(message: IncomingMessage): Promise<FormData> {
  const chunks: Buffer[] = [];

  for await (const chunk of message) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const contentType = message.headers["content-type"];
  return new Response(Buffer.concat(chunks), {
    headers: {
      "content-type": Array.isArray(contentType)
        ? (contentType[0] ?? "")
        : (contentType ?? ""),
    },
  }).formData();
}

function sendHtml(response: ServerResponse, html: string): void {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
