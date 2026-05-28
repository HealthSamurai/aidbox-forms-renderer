import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import strings from "@formbox/strings";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { defaultTemplates } from "./default-templates.ts";

import type {
  CodingOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";

type Coding = CodingOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

const unitOptionUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption";
const unitOpenUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-unitOpen";
const unitValueSetUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet";
const unitSupplementalSystemUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-unitSupplementalSystem";
const DOSE_UNITS_VALUE_SET = "http://example.test/ValueSet/dose-units";
const RATE_UNITS_VALUE_SET = "http://example.test/ValueSet/rate-units";
const UCUM_SYSTEM = "http://unitsofmeasure.org";

const doseUnitOptions: Coding[] = [
  {
    system: "http://unitsofmeasure.org",
    code: "mg",
    display: "mg",
  },
  {
    system: "http://unitsofmeasure.org",
    code: "g",
    display: "g",
  },
];

const rateUnitOptions: Coding[] = [
  {
    system: "http://unitsofmeasure.org",
    code: "mL/h",
    display: "mL/hour",
  },
  {
    system: "http://unitsofmeasure.org",
    code: "L/h",
    display: "L/hour",
  },
];

async function render(questionnaire: Questionnaire): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function renderWithResponse(
  questionnaire: Questionnaire,
  questionnaireResponse: QuestionnaireResponse,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    questionnaireResponse,
    fhirVersion: "r5",
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function process(
  questionnaire: Questionnaire,
  formData: FormData,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<QuestionnaireResponse> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    questionnaireResponse,
    fhirVersion: "r5",
  });
  try {
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

async function processAndRender(
  questionnaire: Questionnaire,
  formData: FormData,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    questionnaireResponse,
    fhirVersion: "r5",
  });
  try {
    await renderer.process(formData);
    return await renderer.render();
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
  field: string,
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

function optionValue(html: string, label: string): string {
  const pattern = new RegExp(
    String.raw`<option\b[^>]*\bvalue="([^"]+)"[^>]*>(?:<span>)?${escapeRegExp(label)}(?:</span>)?</option>`,
    "u",
  );
  const match = pattern.exec(html);
  if (!match?.[1]) {
    throw new Error(`Missing option ${label} in ${html}`);
  }
  return decodeEntities(match[1]);
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

describe("@formbox/htmx quantity parity", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn<typeof globalThis, "fetch">>;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) =>
        buildFetchResponse(
          getRequestedCanonical(input) === DOSE_UNITS_VALUE_SET
            ? doseUnitOptions
            : getRequestedCanonical(input) === RATE_UNITS_VALUE_SET
              ? rateUnitOptions
              : [],
        ),
      );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("renders and processes custom free-text quantity units", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-unit",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const firstData = hiddenFormData(firstHtml);
    firstData.set(attributeFrom(firstHtml, "dose", "name", "value"), "5");
    firstData.set(
      attributeFrom(firstHtml, "dose", "name", "unit"),
      optionValue(firstHtml, "Specify other"),
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: defaultTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    let secondHtml: string;
    try {
      await renderer.process(firstData);
      secondHtml = await renderer.render();
    } finally {
      renderer.dispose();
    }
    const secondData = hiddenFormData(secondHtml);
    secondData.set(attributeFrom(secondHtml, "dose", "name", "value"), "5");
    secondData.set(
      attributeFrom(secondHtml, "dose", "name", "unit"),
      "tablespoon",
    );

    const response = await process(questionnaire, secondData);

    expect(secondHtml).toContain("__custom");
    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [
          {
            valueQuantity: { value: 5, unit: "tablespoon" },
          },
        ],
      },
    ]);
  });

  it("commits a custom free-text quantity unit when Add is submitted", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-unit-add",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const firstData = hiddenFormData(firstHtml);
    firstData.set(attributeFrom(firstHtml, "dose", "name", "value"), "5");
    firstData.set(
      attributeFrom(firstHtml, "dose", "name", "unit"),
      optionValue(firstHtml, "Specify other"),
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: defaultTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      await renderer.process(firstData);
      const customHtml = await renderer.render();
      const formData = hiddenFormData(customHtml);
      const unitName = attributeFrom(customHtml, "dose", "name", "unit");
      formData.set(attributeFrom(customHtml, "dose", "name", "value"), "5");
      formData.append(unitName, optionValue(customHtml, "Specify other"));
      formData.append(unitName, "tablespoon");
      formData.append("fb[action]", "submit-custom");

      await renderer.process(formData);
      const html = await renderer.render();

      expect(html).not.toContain(
        `value="submit-custom">${strings.en.dialog.submit}</button>`,
      );
      expect(html).toContain(">tablespoon<");
      expect(renderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "dose",
          text: "Dose",
          answer: [
            {
              valueQuantity: {
                value: 5,
                unit: "tablespoon",
              },
            },
          ],
        },
      ]);
    } finally {
      renderer.dispose();
    }
  });

  it("does not apply a single unit option when only a quantity value is submitted", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-single-unit-value-only",
      item: [
        {
          linkId: "temperature",
          text: "Temperature",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "Cel",
                display: "C",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "temperature", "name", "value"), "37.5");

    const response = await process(questionnaire, formData);

    expect(response.item).toEqual([
      {
        linkId: "temperature",
        text: "Temperature",
        answer: [{ valueQuantity: { value: 37.5 } }],
      },
    ]);
  });

  it("does not auto-select a single unit option for an initial quantity value", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-single-unit-initial-value",
      item: [
        {
          linkId: "temperature",
          text: "Temperature",
          type: "quantity",
          initial: [{ valueQuantity: { value: 39 } }],
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "Cel",
                display: "C",
              },
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);

    const response = await process(questionnaire, formData);

    expect(html).toContain('data-fb-field="unit"');
    expect(response.item).toEqual([
      {
        linkId: "temperature",
        text: "Temperature",
        answer: [{ valueQuantity: { value: 39 } }],
      },
    ]);
  });

  it("does not reintroduce a legacy unit fallback after clearing a new unit selection", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-legacy-unit-clear",
      item: [
        {
          linkId: "rate",
          text: "Infusion rate",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "mL/h",
                display: "mL/hour",
              },
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-legacy-unit-clear",
      status: "in-progress",
      item: [
        {
          linkId: "rate",
          answer: [{ valueQuantity: { value: 50, unit: "mL/day" } }],
        },
      ],
    };
    const html = await renderWithResponse(questionnaire, questionnaireResponse);
    const selectUnit = hiddenFormData(html);
    selectUnit.set(attributeFrom(html, "rate", "name", "value"), "50");
    selectUnit.set(
      attributeFrom(html, "rate", "name", "unit"),
      optionValue(html, "mL/hour"),
    );
    const selectedResponse = await process(
      questionnaire,
      selectUnit,
      questionnaireResponse,
    );
    const selectedHtml = await renderWithResponse(
      questionnaire,
      selectedResponse,
    );
    const clearUnit = hiddenFormData(selectedHtml);
    clearUnit.set(attributeFrom(selectedHtml, "rate", "name", "value"), "50");
    clearUnit.set(attributeFrom(selectedHtml, "rate", "name", "unit"), "");

    const response = await process(questionnaire, clearUnit, selectedResponse);

    expect(selectedHtml).not.toContain("mL/day");
    expect(response.item).toEqual([
      {
        linkId: "rate",
        text: "Infusion rate",
        answer: [{ valueQuantity: { value: 50 } }],
      },
    ]);
  });

  it("keeps submitted custom units selectable after switching to a predefined unit across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-unit-reuse",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "mg",
                display: "mg",
              },
            },
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
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
    };
    const firstHtml = await render(questionnaire);
    const openCustomForm = hiddenFormData(firstHtml);
    openCustomForm.set(attributeFrom(firstHtml, "dose", "name", "value"), "5");
    openCustomForm.set(
      attributeFrom(firstHtml, "dose", "name", "unit"),
      optionValue(firstHtml, "Specify other"),
    );
    const customFormHtml = await processAndRender(
      questionnaire,
      openCustomForm,
    );
    const submitCustom = hiddenFormData(customFormHtml);
    const unitName = attributeFrom(customFormHtml, "dose", "name", "unit");
    submitCustom.set(
      attributeFrom(customFormHtml, "dose", "name", "value"),
      "5",
    );
    submitCustom.append(unitName, optionValue(customFormHtml, "Specify other"));
    submitCustom.append(unitName, "tablespoon");
    submitCustom.append("fb[action]", "submit-custom");
    const customSubmittedHtml = await processAndRender(
      questionnaire,
      submitCustom,
    );
    const switchToPredefined = hiddenFormData(customSubmittedHtml);
    switchToPredefined.set(
      attributeFrom(customSubmittedHtml, "dose", "name", "value"),
      "5",
    );
    switchToPredefined.set(
      attributeFrom(customSubmittedHtml, "dose", "name", "unit"),
      optionValue(customSubmittedHtml, "mg"),
    );
    const predefinedHtml = await processAndRender(
      questionnaire,
      switchToPredefined,
    );

    expect(customSubmittedHtml).toContain(">tablespoon<");
    expect(customSubmittedHtml).toContain("fb[unit][dose]");
    expect(customSubmittedHtml).not.toContain("fb[custom-unit][dose]");
    expect(predefinedHtml).toContain(">tablespoon<");
  });

  it("opens a blank custom unit form when switching from a predefined unit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-unit-blank",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "mg",
                display: "mg",
              },
            },
            {
              url: unitOpenUrl,
              valueCode: "optionsOrType",
            },
          ],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const selectPredefined = hiddenFormData(firstHtml);
    selectPredefined.set(
      attributeFrom(firstHtml, "dose", "name", "value"),
      "5",
    );
    selectPredefined.set(
      attributeFrom(firstHtml, "dose", "name", "unit"),
      optionValue(firstHtml, "mg"),
    );
    const predefinedHtml = await processAndRender(
      questionnaire,
      selectPredefined,
    );
    const openCustom = hiddenFormData(predefinedHtml);
    openCustom.set(attributeFrom(predefinedHtml, "dose", "name", "value"), "5");
    openCustom.set(
      attributeFrom(predefinedHtml, "dose", "name", "unit"),
      optionValue(predefinedHtml, "Specify other"),
    );
    const customHtml = await processAndRender(questionnaire, openCustom);

    expect(customHtml).toContain(`>${strings.en.dialog.submit}</button>`);
    expect(customHtml).toContain('data-fb-field="system"');
    expect(customHtml).toContain('data-fb-field="code"');
    expect(customHtml).toContain('data-fb-field="display"');
    expect(customHtml).not.toContain('value="mg"');
    expect(customHtml).not.toContain('value="http://unitsofmeasure.org"');
  });

  it("rejects tampered custom units when unitOpen is optionsOnly", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-options-only-unit",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "mg",
                display: "mg",
              },
            },
            {
              url: unitOpenUrl,
              valueCode: "optionsOnly",
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "dose", "name", "value"), "5");
    formData.set(attributeFrom(html, "dose", "name", "unit"), "tablespoon");

    const response = await process(questionnaire, formData);

    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [{ valueQuantity: { value: 5 } }],
      },
    ]);
  });

  it("rejects tampered custom quantity codings outside unitSupplementalSystem", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-supplemental-system",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOpenUrl,
              valueCode: "optionsOrType",
            },
            {
              url: unitSupplementalSystemUrl,
              valueCanonical: UCUM_SYSTEM,
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const firstData = hiddenFormData(html);
    firstData.set(attributeFrom(html, "dose", "name", "value"), "5");
    firstData.set(
      attributeFrom(html, "dose", "name", "unit"),
      optionValue(html, "Specify other"),
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: defaultTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    let customHtml: string;
    try {
      await renderer.process(firstData);
      customHtml = await renderer.render();
    } finally {
      renderer.dispose();
    }
    const formData = hiddenFormData(customHtml);
    formData.set(attributeFrom(customHtml, "dose", "name", "value"), "5");
    formData.set(
      attributeFrom(customHtml, "dose", "name", "system"),
      "http://bad.test",
    );
    formData.set(attributeFrom(customHtml, "dose", "name", "code"), "tblsp");
    formData.set(
      attributeFrom(customHtml, "dose", "name", "display"),
      "tablespoon",
    );

    const response = await process(questionnaire, formData);

    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [{ valueQuantity: { value: 5 } }],
      },
    ]);
  });

  it("accepts custom quantity codings inside unitSupplementalSystem", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-supplemental-system-match",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOpenUrl,
              valueCode: "optionsOrType",
            },
            {
              url: unitSupplementalSystemUrl,
              valueCanonical: UCUM_SYSTEM,
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const firstData = hiddenFormData(html);
    firstData.set(attributeFrom(html, "dose", "name", "value"), "5");
    firstData.set(
      attributeFrom(html, "dose", "name", "unit"),
      optionValue(html, "Specify other"),
    );
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: defaultTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    let customHtml: string;
    try {
      await renderer.process(firstData);
      customHtml = await renderer.render();
    } finally {
      renderer.dispose();
    }
    const formData = hiddenFormData(customHtml);
    formData.set(attributeFrom(customHtml, "dose", "name", "value"), "5");
    formData.set(
      attributeFrom(customHtml, "dose", "name", "system"),
      UCUM_SYSTEM,
    );
    formData.set(attributeFrom(customHtml, "dose", "name", "code"), "tblsp");
    formData.set(
      attributeFrom(customHtml, "dose", "name", "display"),
      "tablespoon",
    );

    const response = await process(questionnaire, formData);

    expect(response.item).toEqual([
      {
        linkId: "dose",
        text: "Dose",
        answer: [
          {
            valueQuantity: {
              value: 5,
              unit: "tablespoon",
              system: UCUM_SYSTEM,
              code: "tblsp",
            },
          },
        ],
      },
    ]);
  });

  it("renders an off-list response unit as legacy when it does not match unitSupplementalSystem", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-supplemental-legacy-response",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "mg",
                display: "mg",
              },
            },
            {
              url: unitOpenUrl,
              valueCode: "optionsOrType",
            },
            {
              url: unitSupplementalSystemUrl,
              valueCanonical: UCUM_SYSTEM,
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-unit-supplemental-legacy-response",
      status: "in-progress",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          answer: [
            {
              valueQuantity: {
                value: 1,
                system: "http://example.org/custom",
                code: "tblsp",
                unit: "tablespoon",
              },
            },
          ],
        },
      ],
    };
    const html = await renderWithResponse(questionnaire, questionnaireResponse);

    expect(html).toContain(">tablespoon<");
    expect(html).toContain("disabled selected");
  });

  it("renders an off-list response unit as custom when it matches unitSupplementalSystem", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-supplemental-custom-response",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: UCUM_SYSTEM,
                code: "mg",
                display: "mg",
              },
            },
            {
              url: unitOpenUrl,
              valueCode: "optionsOrType",
            },
            {
              url: unitSupplementalSystemUrl,
              valueCanonical: UCUM_SYSTEM,
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-unit-supplemental-custom-response",
      status: "in-progress",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          answer: [
            {
              valueQuantity: {
                value: 1,
                system: UCUM_SYSTEM,
                code: "tblsp",
                unit: "tablespoon",
              },
            },
          ],
        },
      ],
    };
    const html = await renderWithResponse(questionnaire, questionnaireResponse);

    expect(html).toContain(">tablespoon<");
    expect(html).not.toContain("disabled selected");
  });

  it("expands unitValueSet options before rendering and processing", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-value-set",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitValueSetUrl,
              valueCanonical: DOSE_UNITS_VALUE_SET,
            },
          ],
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
      const html = await renderer.render();
      const formData = hiddenFormData(html);
      formData.set(attributeFrom(html, "dose", "name", "value"), "5");
      formData.set(
        attributeFrom(html, "dose", "name", "unit"),
        optionValue(html, "g"),
      );

      await renderer.process(formData);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(renderer.getQuestionnaireResponse().item).toEqual([
        {
          linkId: "dose",
          text: "Dose",
          answer: [
            {
              valueQuantity: {
                value: 5,
                system: "http://unitsofmeasure.org",
                code: "g",
                unit: "g",
              },
            },
          ],
        },
      ]);
    } finally {
      renderer.dispose();
    }
  });

  it("prefers unitValueSet over unitOption when both are present", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-value-set-precedence",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            {
              url: unitOptionUrl,
              valueCoding: {
                system: "http://example.test/local",
                code: "tablet",
                display: "tablet",
              },
            },
            {
              url: unitValueSetUrl,
              valueCanonical: DOSE_UNITS_VALUE_SET,
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain(">mg<");
    expect(html).toContain(">g<");
    expect(html).not.toContain("tablet");
  });

  it("renders an options issue when unitValueSet expansion fails", async () => {
    fetchSpy.mockImplementation(async () => buildFetchErrorResponse());
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-value-set-error",
      item: [
        {
          linkId: "failed-units",
          text: "Failed units",
          type: "quantity",
          extension: [
            {
              url: unitValueSetUrl,
              valueCanonical: DOSE_UNITS_VALUE_SET,
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Failed to expand ValueSet");
    expect(html).not.toContain("Specify other");
  });

  it("keeps a legacy response unit visible when unitValueSet expansion fails", async () => {
    fetchSpy.mockImplementation(async () => buildFetchErrorResponse());
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-value-set-legacy-error",
      item: [
        {
          linkId: "rate",
          text: "Infusion rate",
          type: "quantity",
          extension: [
            {
              url: unitValueSetUrl,
              valueCanonical: RATE_UNITS_VALUE_SET,
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-unit-value-set-legacy-error",
      status: "in-progress",
      item: [
        {
          linkId: "rate",
          answer: [
            {
              valueQuantity: {
                value: 125,
                system: "http://unitsofmeasure.org",
                code: "mL/d",
                unit: "mL/day",
              },
            },
          ],
        },
      ],
    };
    const html = await renderWithResponse(questionnaire, questionnaireResponse);

    expect(html).toContain("mL/day");
    expect(html).toContain("disabled");
    expect(html).toContain("Failed to expand ValueSet");
  });

  it("shows a legacy response unit as a disabled fallback until a unitValueSet option is selected", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-unit-value-set-legacy-fallback",
      item: [
        {
          linkId: "rate",
          text: "Infusion rate",
          type: "quantity",
          extension: [
            {
              url: unitValueSetUrl,
              valueCanonical: RATE_UNITS_VALUE_SET,
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-unit-value-set-legacy-fallback",
      status: "in-progress",
      item: [
        {
          linkId: "rate",
          answer: [
            {
              valueQuantity: {
                value: 125,
                system: "http://unitsofmeasure.org",
                code: "mL/d",
                unit: "mL/day",
              },
            },
          ],
        },
      ],
    };
    const html = await renderWithResponse(questionnaire, questionnaireResponse);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "rate", "name", "value"), "125");
    formData.set(
      attributeFrom(html, "rate", "name", "unit"),
      optionValue(html, "mL/hour"),
    );
    const response = await process(
      questionnaire,
      formData,
      questionnaireResponse,
    );

    expect(html).toContain("mL/day");
    expect(html).toContain("mL/hour");
    expect(response.item).toEqual([
      {
        linkId: "rate",
        text: "Infusion rate",
        answer: [
          {
            valueQuantity: {
              value: 125,
              system: "http://unitsofmeasure.org",
              code: "mL/h",
              unit: "mL/hour",
            },
          },
        ],
      },
    ]);
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

function buildFetchErrorResponse() {
  return {
    ok: false,
    status: 500,
    statusText: "Server Error",
    json: () => Promise.resolve({}),
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
