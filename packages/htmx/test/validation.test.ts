import { describe, expect, it } from "vitest";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { nativeTemplates } from "./native-templates.ts";

import type {
  CodingOf,
  ExtensionOf,
  QuantityOf,
  QuestionnaireOf,
} from "@formbox/fhir";

type Coding = CodingOf<"r5">;
type Extension = ExtensionOf<"r5">;
type Quantity = QuantityOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;

const mimeTypeUrl = "http://hl7.org/fhir/StructureDefinition/mimeType";
const maxSizeUrl = "http://hl7.org/fhir/StructureDefinition/maxSize";
const maxDecimalPlacesUrl =
  "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces";
const minLengthUrl = "http://hl7.org/fhir/StructureDefinition/minLength";
const minValueUrl = "http://hl7.org/fhir/StructureDefinition/minValue";
const maxValueUrl = "http://hl7.org/fhir/StructureDefinition/maxValue";
const minQuantityUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity";
const maxQuantityUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity";
const unitOptionUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption";
const targetConstraintUrl =
  "http://hl7.org/fhir/StructureDefinition/targetConstraint";
const variableUrl = "http://hl7.org/fhir/StructureDefinition/variable";
const cqfExpressionUrl =
  "http://hl7.org/fhir/StructureDefinition/cqf-expression";

function cqfExpression(expression: string, name?: string): Extension {
  return {
    url: cqfExpressionUrl,
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name === undefined ? {} : { name }),
    },
  };
}

function variable(name: string, expression: string): Extension {
  return {
    url: variableUrl,
    valueExpression: {
      language: "text/fhirpath",
      expression,
      name,
    },
  };
}

function targetConstraint(config: {
  key?: string | undefined;
  severity?: "error" | "warning" | undefined;
  human?: string | undefined;
  expression: string;
  location?: string | undefined;
}): Extension {
  const extension: Extension = {
    url: targetConstraintUrl,
    extension: [
      { url: "severity", valueCode: config.severity ?? "error" },
      {
        url: "expression",
        valueExpression: {
          language: "text/fhirpath",
          expression: config.expression,
        },
      },
    ],
  };

  if (config.key) {
    extension.extension?.push({ url: "key", valueId: config.key });
  }
  if (config.human) {
    extension.extension?.push({ url: "human", valueString: config.human });
  }
  if (config.location) {
    extension.extension?.push({
      url: "location",
      valueString: config.location,
    });
  }

  return extension;
}

function minValueInteger(value: number): Extension {
  return { url: minValueUrl, valueInteger: value } as Extension;
}

function maxValueInteger(value: number): Extension {
  return { url: maxValueUrl, valueInteger: value } as Extension;
}

function maxDecimalPlaces(value: number): Extension {
  return { url: maxDecimalPlacesUrl, valueInteger: value } as Extension;
}

function minLength(value: number): Extension {
  return { url: minLengthUrl, valueInteger: value } as Extension;
}

function minValueDate(value: string): Extension {
  return { url: minValueUrl, valueDate: value } as Extension;
}

function maxValueDate(value: string): Extension {
  return { url: maxValueUrl, valueDate: value } as Extension;
}

function minValueDateTime(value: string): Extension {
  return { url: minValueUrl, valueDateTime: value } as Extension;
}

function maxValueDateTime(value: string): Extension {
  return { url: maxValueUrl, valueDateTime: value } as Extension;
}

function minValueTime(value: string): Extension {
  return { url: minValueUrl, valueTime: value } as Extension;
}

function maxValueTime(value: string): Extension {
  return { url: maxValueUrl, valueTime: value } as Extension;
}

function minValueQuantity(value: Quantity): Extension {
  return { url: minValueUrl, valueQuantity: value } as Extension;
}

function maxValueQuantity(value: Quantity): Extension {
  return { url: maxValueUrl, valueQuantity: value } as Extension;
}

function minQuantity(value: Quantity): Extension {
  return { url: minQuantityUrl, valueQuantity: value } as Extension;
}

function maxQuantity(value: Quantity): Extension {
  return { url: maxQuantityUrl, valueQuantity: value } as Extension;
}

function unitOption(value: Coding): Extension {
  return { url: unitOptionUrl, valueCoding: value } as Extension;
}

function minValueExpression(expression: string, value = 0): Extension {
  return {
    url: minValueUrl,
    valueInteger: value,
    _valueInteger: { extension: [cqfExpression(expression)] },
  } as Extension;
}

function maxValueExpression(expression: string, value = 0): Extension {
  return {
    url: maxValueUrl,
    valueInteger: value,
    _valueInteger: { extension: [cqfExpression(expression)] },
  } as Extension;
}

function minQuantityExpression(expression: string, base: Quantity): Extension {
  return {
    url: minQuantityUrl,
    valueQuantity: { ...base, extension: [cqfExpression(expression)] },
  } as Extension;
}

function maxQuantityExpression(expression: string, base: Quantity): Extension {
  return {
    url: maxQuantityUrl,
    valueQuantity: { ...base, extension: [cqfExpression(expression)] },
  } as Extension;
}

async function render(questionnaire: Questionnaire): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
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
    throw new Error(`Missing ${attribute} for ${linkId} in ${html}`);
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

async function submit(
  questionnaire: Questionnaire,
  formData: FormData,
): Promise<{ readonly valid: boolean; readonly html: string }> {
  formData.append("fb[action]", "submit");
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    const result = await renderer.process(formData);
    return {
      valid: result.submitted ? result.valid : false,
      html: await renderer.render(),
    };
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

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

describe("@formbox/htmx validation parity", () => {
  it("enforces questionnaire-level targetConstraint extensions on submit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-root-target-constraint",
      item: [
        {
          linkId: "consent",
          text: "Do you consent?",
          type: "boolean",
        },
      ],
      extension: [
        targetConstraint({
          key: "consent-required",
          human: "Consent answer is required.",
          expression: "item.where(linkId='consent').answer.valueBoolean = true",
        }),
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "consent", "name"), "true");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("Consent answer is required.");
    expect(validResult.valid).toBe(true);
    expect(validResult.html).not.toContain("Consent answer is required.");
  });

  it("enforces item-level targetConstraint extensions on submit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-item-target-constraint",
      item: [
        {
          linkId: "nickname",
          text: "Preferred nickname",
          type: "string",
          extension: [
            targetConstraint({
              key: "nickname-required",
              human: "Provide a nickname.",
              expression: "answer.exists()",
              location: "QuestionnaireResponse.item.where(linkId='nickname')",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "nickname", "name"), "Sam");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("Provide a nickname.");
    expect(validResult.valid).toBe(true);
    expect(validResult.html).not.toContain("Provide a nickname.");
  });

  it("treats warning targetConstraint extensions as non-blocking", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-warning-target-constraint",
      item: [
        {
          linkId: "optional-note",
          text: "Optional note",
          type: "string",
          extension: [
            targetConstraint({
              key: "note-warning",
              severity: "warning",
              human: "Consider adding a note.",
              expression: "answer.exists()",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    const result = await submit(questionnaire, formData);

    expect(result.valid).toBe(true);
    expect(result.html).toContain("Consider adding a note.");
  });

  it("evaluates custom targetConstraint expressions on submitted values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-custom-target-constraint",
      item: [
        {
          linkId: "given-name",
          text: "Given name",
          type: "string",
          extension: [
            targetConstraint({
              key: "given-name-uppercase",
              human: "Start the given name with a capital letter.",
              expression:
                "answer.valueString.all($this = '' or $this.substring(0, 1) = $this.substring(0, 1).upper())",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "given-name", "name"), "maria");
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "given-name", "name"), "Maria");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("capital letter");
    expect(validResult.valid).toBe(true);
    expect(validResult.html).not.toContain("capital letter");
  });

  it("enforces repeated-group targetConstraint extensions only on submit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeated-group-target-constraint",
      item: [
        {
          linkId: "visit",
          text: "Visit",
          type: "group",
          repeats: true,
          required: true,
          extension: [
            targetConstraint({
              key: "visit-note-required",
              human: "Provide a visit note.",
              expression: "item.where(linkId='note').answer.exists()",
            }),
          ],
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "note", "name"), "Seen today");
    const validResult = await submit(questionnaire, valid);

    expect(html).not.toContain("Provide a visit note.");
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("Provide a visit note.");
    expect(validResult.valid).toBe(true);
    expect(validResult.html).not.toContain("Provide a visit note.");
  });

  it("enforces minLength and maxDecimalPlaces during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-text-decimal-precision",
      item: [
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
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [maxDecimalPlaces(2)],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "nickname", "name"), "Jo");
    invalid.set(attributeFrom(html, "amount", "name"), "12.345");
    invalid.set(attributeFrom(html, "dose", "name", "value"), "1.234");
    invalid.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "nickname", "name"), "Joan");
    valid.set(attributeFrom(html, "amount", "name"), "12.34");
    valid.set(attributeFrom(html, "dose", "name", "value"), "1.23");
    valid.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("at least 3");
    expect(invalidResult.html).toContain("decimal place");
    expect(validResult.valid).toBe(true);
  });

  it("counts decimal places for scientific notation during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-scientific-decimal-precision",
      item: [
        {
          linkId: "concentration",
          text: "Concentration",
          type: "decimal",
          extension: [maxDecimalPlaces(2)],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "concentration", "name"), "1.23e-4");
    const result = await submit(questionnaire, formData);

    expect(result.valid).toBe(false);
    expect(result.html).toContain("decimal place");
  });

  it("enforces maxLength during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-max-length",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
          maxLength: 5,
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "notes", "name"), "Too long");
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "notes", "name"), "short");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("maximum length");
    expect(validResult.valid).toBe(true);
  });

  it("requires enabled groups to contain at least one child answer", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-required-group",
      item: [
        {
          linkId: "group",
          text: "Group",
          type: "group",
          required: true,
          item: [{ linkId: "child", text: "Child", type: "string" }],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "child", "name"), "Filled");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("least one");
    expect(validResult.valid).toBe(true);
  });

  it("applies required validation only when enableWhen conditions are met", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-required-enable-when",
      item: [
        { linkId: "toggle", text: "Toggle", type: "boolean" },
        {
          linkId: "details",
          text: "Details",
          type: "string",
          required: true,
          enableWhen: [
            { question: "toggle", operator: "=", answerBoolean: true },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const disabled = hiddenFormData(html);
    const enabled = hiddenFormData(html);
    enabled.set(attributeFrom(html, "toggle", "name"), "true");

    const disabledResult = await submit(questionnaire, disabled);
    const enabledResult = await submit(questionnaire, enabled);
    const filled = hiddenFormData(enabledResult.html);
    filled.set(attributeFrom(enabledResult.html, "toggle", "name"), "true");
    filled.set(attributeFrom(enabledResult.html, "details", "name"), "Filled");
    const filledResult = await submit(questionnaire, filled);

    expect(disabledResult.valid).toBe(true);
    expect(enabledResult.valid).toBe(false);
    expect(enabledResult.html).toContain("required");
    expect(filledResult.valid).toBe(true);
  });

  it("ignores required validation on read-only questions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-readonly-required",
      item: [
        {
          linkId: "readonly-question",
          text: "Read only value",
          type: "string",
          required: true,
          readOnly: true,
        },
      ],
    };

    expect(await submit(questionnaire, new FormData())).toMatchObject({
      valid: true,
    });
  });

  it("enforces static numeric minimum and maximum values during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-static-numeric-bounds",
      item: [
        {
          linkId: "age",
          text: "Age",
          type: "integer",
          extension: [minValueInteger(0), maxValueInteger(120)],
        },
      ],
    };
    const html = await render(questionnaire);
    const low = hiddenFormData(html);
    low.set(attributeFrom(html, "age", "name"), "-1");
    const lowResult = await submit(questionnaire, low);
    const high = hiddenFormData(html);
    high.set(attributeFrom(html, "age", "name"), "130");
    const highResult = await submit(questionnaire, high);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "age", "name"), "35");
    const validResult = await submit(questionnaire, valid);

    expect(lowResult.valid).toBe(false);
    expect(lowResult.html).toContain("greater than or equal to");
    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to");
    expect(validResult.valid).toBe(true);
  });

  it("enforces static quantity minimum and maximum values during submit validation", async () => {
    const kg: Quantity = {
      value: 0,
      unit: "kg",
      system: "http://unitsofmeasure.org",
      code: "kg",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-static-quantity-bounds",
      item: [
        {
          linkId: "weight",
          text: "Weight",
          type: "quantity",
          extension: [
            minValueQuantity({ ...kg, value: 10 }),
            maxValueQuantity({ ...kg, value: 200 }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const low = hiddenFormData(html);
    low.set(attributeFrom(html, "weight", "name", "value"), "5");
    low.set(attributeFrom(html, "weight", "name", "unit"), "kg");
    const lowResult = await submit(questionnaire, low);
    const high = hiddenFormData(html);
    high.set(attributeFrom(html, "weight", "name", "value"), "250");
    high.set(attributeFrom(html, "weight", "name", "unit"), "kg");
    const highResult = await submit(questionnaire, high);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "weight", "name", "value"), "75");
    valid.set(attributeFrom(html, "weight", "name", "unit"), "kg");
    const validResult = await submit(questionnaire, valid);

    expect(lowResult.valid).toBe(false);
    expect(lowResult.html).toContain("greater than or equal to");
    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to");
    expect(validResult.valid).toBe(true);
  });

  it("uses SDC minQuantity over core minValue during submit validation", async () => {
    const mg: Quantity = {
      value: 0,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-sdc-min-quantity-precedence",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            minQuantity({ ...mg, value: 10 }),
            minValueQuantity({ ...mg, value: 30 }),
            unitOption({
              system: "http://unitsofmeasure.org",
              code: "mg",
              display: "mg",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const valueName = attributeFrom(html, "dose", "name", "value");
    const unitName = attributeFrom(html, "dose", "name", "unit");
    const unitValue = optionValue(html, "mg");
    const valid = hiddenFormData(html);
    valid.set(valueName, "12");
    valid.set(unitName, unitValue);
    const low = hiddenFormData(html);
    low.set(valueName, "8");
    low.set(unitName, unitValue);
    const lowResult = await submit(questionnaire, low);

    expect(await submit(questionnaire, valid)).toMatchObject({ valid: true });
    expect(lowResult.valid).toBe(false);
    expect(lowResult.html).toContain("greater than or equal to 10");
  });

  it("uses SDC maxQuantity over core maxValue during submit validation", async () => {
    const mg: Quantity = {
      value: 0,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-sdc-max-quantity-precedence",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            maxQuantity({ ...mg, value: 20 }),
            maxValueQuantity({ ...mg, value: 10 }),
            unitOption({
              system: "http://unitsofmeasure.org",
              code: "mg",
              display: "mg",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const valueName = attributeFrom(html, "dose", "name", "value");
    const unitName = attributeFrom(html, "dose", "name", "unit");
    const unitValue = optionValue(html, "mg");
    const valid = hiddenFormData(html);
    valid.set(valueName, "15");
    valid.set(unitName, unitValue);
    const high = hiddenFormData(html);
    high.set(valueName, "25");
    high.set(unitName, unitValue);
    const highResult = await submit(questionnaire, high);

    expect(await submit(questionnaire, valid)).toMatchObject({ valid: true });
    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to 20");
  });

  it("converts UCUM units for static quantity bounds during submit validation", async () => {
    const gram: Quantity = {
      value: 0,
      unit: "g",
      system: "http://unitsofmeasure.org",
      code: "g",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-quantity-bounds-ucum-conversion",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            minQuantity({ ...gram, value: 1 }),
            maxQuantity({ ...gram, value: 2 }),
            unitOption({
              system: "http://unitsofmeasure.org",
              code: "mg",
              display: "mg",
            }),
            unitOption({
              system: "http://unitsofmeasure.org",
              code: "g",
              display: "g",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const valueName = attributeFrom(html, "dose", "name", "value");
    const unitName = attributeFrom(html, "dose", "name", "unit");
    const mg = optionValue(html, "mg");
    const low = hiddenFormData(html);
    low.set(valueName, "500");
    low.set(unitName, mg);
    const lowResult = await submit(questionnaire, low);
    const high = hiddenFormData(html);
    high.set(valueName, "2500");
    high.set(unitName, mg);
    const highResult = await submit(questionnaire, high);
    const valid = hiddenFormData(html);
    valid.set(valueName, "1500");
    valid.set(unitName, mg);
    const validResult = await submit(questionnaire, valid);

    expect(lowResult.valid).toBe(false);
    expect(lowResult.html).toContain("greater than or equal to");
    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to");
    expect(validResult.valid).toBe(true);
  });

  it("enforces static date and dateTime boundaries during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-static-temporal-bounds",
      item: [
        {
          linkId: "birth",
          text: "Date of birth",
          type: "date",
          extension: [minValueDate("2000-01-01"), maxValueDate("2020-12-31")],
        },
        {
          linkId: "check-in",
          text: "Check-in",
          type: "dateTime",
          extension: [
            minValueDateTime("2024-01-01T00:00:00Z"),
            maxValueDateTime("2024-12-31T23:59:59Z"),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const early = hiddenFormData(html);
    early.set(attributeFrom(html, "birth", "name"), "1999-12-31");
    early.set(attributeFrom(html, "check-in", "name"), "2023-12-31T23:59:59Z");
    const earlyResult = await submit(questionnaire, early);
    const late = hiddenFormData(html);
    late.set(attributeFrom(html, "birth", "name"), "2021-01-01");
    late.set(attributeFrom(html, "check-in", "name"), "2025-01-01T00:00:00Z");
    const lateResult = await submit(questionnaire, late);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "birth", "name"), "2010-05-05");
    valid.set(attributeFrom(html, "check-in", "name"), "2024-06-01T12:00:00Z");
    const validResult = await submit(questionnaire, valid);

    expect(earlyResult.valid).toBe(false);
    expect(earlyResult.html).toContain("not be earlier");
    expect(lateResult.valid).toBe(false);
    expect(lateResult.html).toContain("not be later");
    expect(validResult.valid).toBe(true);
  });

  it("enforces static time boundaries during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-static-time-bounds",
      item: [
        {
          linkId: "appointment",
          text: "Appointment",
          type: "time",
          extension: [minValueTime("09:00:00"), maxValueTime("17:00:00")],
        },
      ],
    };
    const html = await render(questionnaire);
    const early = hiddenFormData(html);
    early.set(attributeFrom(html, "appointment", "name"), "08:59:59");
    const earlyResult = await submit(questionnaire, early);
    const late = hiddenFormData(html);
    late.set(attributeFrom(html, "appointment", "name"), "17:00:01");
    const lateResult = await submit(questionnaire, late);
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "appointment", "name"), "12:30:00");
    const validResult = await submit(questionnaire, valid);

    expect(earlyResult.valid).toBe(false);
    expect(earlyResult.html).toContain("not be earlier");
    expect(lateResult.valid).toBe(false);
    expect(lateResult.html).toContain("not be later");
    expect(validResult.valid).toBe(true);
  });

  it("ignores conflicting static integer bounds", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-conflicting-static-bounds",
      item: [
        {
          linkId: "priority",
          text: "Priority",
          type: "integer",
          extension: [minValueInteger(5), maxValueInteger(3)],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "priority", "name"), "4");

    expect(await submit(questionnaire, formData)).toMatchObject({
      valid: true,
    });
  });

  it("enforces calculated minimum and maximum values during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-numeric-bounds",
      item: [
        {
          linkId: "min-score",
          text: "Min score",
          type: "integer",
          extension: [minValueExpression("10")],
        },
        {
          linkId: "max-score",
          text: "Max score",
          type: "integer",
          extension: [maxValueExpression("15")],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "min-score", "name"), "5");
    invalid.set(attributeFrom(html, "max-score", "name"), "20");
    const invalidResult = await submit(questionnaire, invalid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("greater than or equal to 10");
    expect(invalidResult.html).toContain("less than or equal to 15");

    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "min-score", "name"), "10");
    valid.set(attributeFrom(html, "max-score", "name"), "15");

    expect(await submit(questionnaire, valid)).toMatchObject({ valid: true });
  });

  it("uses calculated numeric bounds instead of static extension values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-bound-precedence",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [minValueExpression("25", 10)],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "score", "name"), "20");
    const invalidResult = await submit(questionnaire, invalid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("greater than or equal to 25");

    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "score", "name"), "30");

    expect(await submit(questionnaire, valid)).toMatchObject({ valid: true });
  });

  it("uses only the first calculated numeric bound result", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-bound-first-result",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [minValueExpression("true | 40", 10)],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "score", "name"), "5");

    expect(await submit(questionnaire, formData)).toMatchObject({
      valid: true,
    });
  });

  it("uses calculated maximum bounds instead of static extension values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-maximum-precedence",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [maxValueExpression("15", 25)],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "score", "name"), "20");
    const invalidResult = await submit(questionnaire, invalid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("less than or equal to 15");

    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "score", "name"), "10");

    expect(await submit(questionnaire, valid)).toMatchObject({ valid: true });
  });

  it("uses only the first calculated maximum bound result", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-maximum-first-result",
      item: [
        {
          linkId: "score",
          text: "Score",
          type: "integer",
          extension: [maxValueExpression("true | 2", 25)],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "score", "name"), "20");

    expect(await submit(questionnaire, formData)).toMatchObject({
      valid: true,
    });
  });

  it("recomputes calculated numeric bounds from submitted answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-dynamic-calculated-numeric-bounds",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "minScore",
              "%context.item.where(linkId='min-score').answer.valueInteger.last()",
            ),
            variable(
              "maxScore",
              "%context.item.where(linkId='max-score').answer.valueInteger.last()",
            ),
          ],
          item: [
            { linkId: "min-score", text: "Min score", type: "integer" },
            { linkId: "max-score", text: "Max score", type: "integer" },
            {
              linkId: "score",
              text: "Score",
              type: "integer",
              extension: [
                minValueExpression("%minScore"),
                maxValueExpression("%maxScore"),
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const low = hiddenFormData(html);
    low.set(attributeFrom(html, "min-score", "name"), "10");
    low.set(attributeFrom(html, "max-score", "name"), "20");
    low.set(attributeFrom(html, "score", "name"), "5");
    const lowResult = await submit(questionnaire, low);

    expect(lowResult.valid).toBe(false);
    expect(lowResult.html).toContain("greater than or equal to 10");

    const high = hiddenFormData(html);
    high.set(attributeFrom(html, "min-score", "name"), "10");
    high.set(attributeFrom(html, "max-score", "name"), "20");
    high.set(attributeFrom(html, "score", "name"), "25");
    const highResult = await submit(questionnaire, high);

    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to 20");

    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "min-score", "name"), "10");
    valid.set(attributeFrom(html, "max-score", "name"), "20");
    valid.set(attributeFrom(html, "score", "name"), "15");

    expect(await submit(questionnaire, valid)).toMatchObject({ valid: true });
  });

  it("enforces calculated quantity floors and ceilings during submit validation", async () => {
    const mg: Quantity = {
      value: 0,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-quantity-bounds",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "minDose",
              "%context.item.where(linkId='min-limit').answer.valueQuantity.last()",
            ),
            variable(
              "maxDose",
              "%context.item.where(linkId='max-limit').answer.valueQuantity.last()",
            ),
          ],
          item: [
            { linkId: "min-limit", text: "Min limit", type: "quantity" },
            { linkId: "max-limit", text: "Max limit", type: "quantity" },
            {
              linkId: "dose",
              text: "Dose",
              type: "quantity",
              extension: [
                minQuantityExpression("%minDose", mg),
                maxQuantityExpression("%maxDose", mg),
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    invalid.set(attributeFrom(html, "min-limit", "name", "value"), "20");
    invalid.set(attributeFrom(html, "min-limit", "name", "unit"), "mg");
    invalid.set(attributeFrom(html, "max-limit", "name", "value"), "50");
    invalid.set(attributeFrom(html, "max-limit", "name", "unit"), "mg");
    invalid.set(attributeFrom(html, "dose", "name", "value"), "10");
    invalid.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const invalidResult = await submit(questionnaire, invalid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("greater than or equal to");

    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "min-limit", "name", "value"), "20");
    valid.set(attributeFrom(html, "min-limit", "name", "unit"), "mg");
    valid.set(attributeFrom(html, "max-limit", "name", "value"), "50");
    valid.set(attributeFrom(html, "max-limit", "name", "unit"), "mg");
    valid.set(attributeFrom(html, "dose", "name", "value"), "60");
    valid.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const highResult = await submit(questionnaire, valid);

    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to");
  });

  it("uses calculated quantity bounds instead of static extension values", async () => {
    const mg: Quantity = {
      value: 0,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-quantity-precedence",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "minDose",
              "%context.item.where(linkId='min-limit').answer.valueQuantity.last()",
            ),
            variable(
              "maxDose",
              "%context.item.where(linkId='max-limit').answer.valueQuantity.last()",
            ),
          ],
          item: [
            { linkId: "min-limit", text: "Min limit", type: "quantity" },
            { linkId: "max-limit", text: "Max limit", type: "quantity" },
            {
              linkId: "dose",
              text: "Dose",
              type: "quantity",
              extension: [
                minQuantityExpression("%minDose", mg),
                maxQuantityExpression("%maxDose", mg),
                minQuantity({ ...mg, value: 5 }),
                maxQuantity({ ...mg, value: 100 }),
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const low = hiddenFormData(html);
    low.set(attributeFrom(html, "min-limit", "name", "value"), "20");
    low.set(attributeFrom(html, "min-limit", "name", "unit"), "mg");
    low.set(attributeFrom(html, "max-limit", "name", "value"), "80");
    low.set(attributeFrom(html, "max-limit", "name", "unit"), "mg");
    low.set(attributeFrom(html, "dose", "name", "value"), "10");
    low.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const lowResult = await submit(questionnaire, low);

    expect(lowResult.valid).toBe(false);
    expect(lowResult.html).toContain("greater than or equal to 20");

    const high = hiddenFormData(html);
    high.set(attributeFrom(html, "min-limit", "name", "value"), "20");
    high.set(attributeFrom(html, "min-limit", "name", "unit"), "mg");
    high.set(attributeFrom(html, "max-limit", "name", "value"), "80");
    high.set(attributeFrom(html, "max-limit", "name", "unit"), "mg");
    high.set(attributeFrom(html, "dose", "name", "value"), "90");
    high.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const highResult = await submit(questionnaire, high);

    expect(highResult.valid).toBe(false);
    expect(highResult.html).toContain("less than or equal to 80");
  });

  it("uses only the first calculated quantity bound result", async () => {
    const mg: Quantity = {
      value: 0,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    };
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-quantity-first-result",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "minDose",
              "%context.item.where(linkId='min-limit').answer.valueQuantity.last()",
            ),
          ],
          item: [
            { linkId: "min-limit", text: "Min limit", type: "quantity" },
            {
              linkId: "dose",
              text: "Dose",
              type: "quantity",
              extension: [minQuantityExpression("true | %minDose", mg)],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "min-limit", "name", "value"), "20");
    formData.set(attributeFrom(html, "min-limit", "name", "unit"), "mg");
    formData.set(attributeFrom(html, "dose", "name", "value"), "10");
    formData.set(attributeFrom(html, "dose", "name", "unit"), "mg");

    expect(await submit(questionnaire, formData)).toMatchObject({
      valid: true,
    });
  });

  it("renders calculated quantity expression errors", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-quantity-error",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            minQuantityExpression("1.total()", {
              value: 0,
              unit: "mg",
              system: "http://unitsofmeasure.org",
              code: "mg",
            }),
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "dose", "name", "value"), "15");
    formData.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    const result = await submit(questionnaire, formData);

    expect(result.valid).toBe(false);
    expect(result.html).toContain("Failed to evaluate min-quantity expression");
  });

  it("uses uploaded File size and content type for attachment validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-attachment-validation",
      item: [
        {
          linkId: "photo",
          text: "Upload photo",
          type: "attachment",
          extension: [
            { url: mimeTypeUrl, valueCode: "image/png" },
            { url: maxSizeUrl, valueDecimal: 4 },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.append(
      attributeFrom(html, "photo", "name"),
      new File(["too-large"], "photo.png", { type: "image/png" }),
    );
    formData.append("fb[action]", "submit");

    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });
    try {
      const result = await renderer.process(formData);

      expect(result).toEqual({ submitted: true, valid: false });
      expect(await renderer.render()).toContain("exceed 4 bytes");
    } finally {
      renderer.dispose();
    }
  });

  it("rejects serialized attachments with disallowed content types", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-serialized-attachment-mime-type",
      item: [
        {
          linkId: "photo",
          text: "Upload photo",
          type: "attachment",
          extension: [
            { url: mimeTypeUrl, valueCode: "image/png" },
            { url: mimeTypeUrl, valueCode: "image/jpeg" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(
      attributeFrom(html, "photo", "name"),
      JSON.stringify({
        contentType: "image/gif",
        size: 200,
      }),
    );
    const result = await submit(questionnaire, formData);

    expect(result.valid).toBe(false);
    expect(result.html).toContain("allowed content types");
  });

  it("estimates maxSize from serialized attachment base64 data", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-serialized-attachment-max-size",
      item: [
        {
          linkId: "document",
          text: "Document",
          type: "attachment",
          extension: [{ url: maxSizeUrl, valueDecimal: 2 }],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(
      attributeFrom(html, "document", "name"),
      JSON.stringify({
        contentType: "text/plain",
        data: "TWFu",
      }),
    );
    const result = await submit(questionnaire, formData);

    expect(result.valid).toBe(false);
    expect(result.html).toContain("exceed 2 bytes");
  });
});
