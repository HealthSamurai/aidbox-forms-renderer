import { describe, expect, it } from "vitest";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { nativeTemplates } from "./native-templates.ts";

import type {
  ExtensionOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";

type Extension = ExtensionOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

const minOccursUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs";
const maxOccursUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs";
const variableUrl = "http://hl7.org/fhir/StructureDefinition/variable";
const cqfExpressionUrl =
  "http://hl7.org/fhir/StructureDefinition/cqf-expression";
const calculatedExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";

function minOccurs(value: number): Extension {
  return { url: minOccursUrl, valueInteger: value } as Extension;
}

function maxOccurs(value: number): Extension {
  return { url: maxOccursUrl, valueInteger: value } as Extension;
}

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

function calculatedExpression(expression: string): Extension {
  return {
    url: calculatedExpressionUrl,
    valueExpression: {
      language: "text/fhirpath",
      expression,
    },
  };
}

function minOccursExpression(expression: string, name?: string): Extension {
  return {
    url: minOccursUrl,
    valueInteger: 0,
    _valueInteger: { extension: [cqfExpression(expression, name)] },
  } as Extension;
}

function maxOccursExpression(expression: string, name?: string): Extension {
  return {
    url: maxOccursUrl,
    valueInteger: 0,
    _valueInteger: { extension: [cqfExpression(expression, name)] },
  } as Extension;
}

async function render(
  questionnaire: Questionnaire,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
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
    templates: nativeTemplates,
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
    templates: nativeTemplates,
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

function attributeFrom(
  html: string,
  linkId: string,
  attribute: string,
  field = "value",
): string {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const escapedField = escapeRegExp(field);
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

function countValue(html: string, linkId: string): string {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const pattern = new RegExp(
    String.raw`<input\b[^>]*\bname="fb\[count\](?:\[[^\]]+\])*\[${escapedLinkId}\]"[^>]*\bvalue="([^"]+)"`,
    "u",
  );
  const match = pattern.exec(html);
  if (!match?.[1]) {
    throw new Error(`Missing count for ${linkId} in ${html}`);
  }
  return decodeEntities(match[1]);
}

function fieldValues(html: string, linkId: string): string[] {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const pattern = new RegExp(
    String.raw`<input\b[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\bdata-fb-field="value"[^>]*\bvalue="([^"]*)"`,
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

describe("@formbox/htmx occurrence parity", () => {
  it("renders questionnaire initial values and min/max occurrence limits", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-occurrence",
      item: [
        {
          linkId: "symptom",
          text: "Symptoms",
          type: "string",
          repeats: true,
          extension: [minOccurs(3), maxOccurs(3)],
          initial: [{ valueString: "Cough" }, { valueString: "Fever" }],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(questionnaire, hiddenFormData(html));

    expect(countValue(html, "symptom")).toBe("3");
    expect(fieldValues(html, "symptom")).toEqual(["Cough", "Fever", ""]);
    expect(html).not.toContain('data-fb-field="add-action"');
    expect(response.item).toEqual([
      {
        linkId: "symptom",
        text: "Symptoms",
        answer: [{ valueString: "Cough" }, { valueString: "Fever" }],
      },
    ]);
  });

  it("truncates overflowing repeated initial values to maxOccurs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-max-occurs",
      item: [
        {
          linkId: "meds",
          text: "Medications",
          type: "string",
          repeats: true,
          extension: [maxOccurs(2)],
          initial: [
            { valueString: "Aspirin" },
            { valueString: "Ibuprofen" },
            { valueString: "Naproxen" },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await process(questionnaire, hiddenFormData(html));

    expect(countValue(html, "meds")).toBe("2");
    expect(fieldValues(html, "meds")).toEqual(["Aspirin", "Ibuprofen"]);
    expect(html).not.toContain('data-fb-field="add-action"');
    expect(response.item).toEqual([
      {
        linkId: "meds",
        text: "Medications",
        answer: [{ valueString: "Aspirin" }, { valueString: "Ibuprofen" }],
      },
    ]);
  });

  it("seeds repeated question controls to minOccurs and validates populated occurrence count", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-question-min-occurs",
      item: [
        {
          linkId: "symptom",
          text: "Symptoms",
          type: "string",
          repeats: true,
          extension: [minOccurs(2), maxOccurs(3)],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set("fb[answer][symptom][i:0][value]", "Cough");
    valid.set("fb[answer][symptom][i:1][value]", "Fever");
    const response = await process(questionnaire, valid);

    expect(countValue(html, "symptom")).toBe("2");
    expect(fieldValues(html, "symptom")).toHaveLength(2);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("least 2");
    expect(response.item).toEqual([
      {
        linkId: "symptom",
        text: "Symptoms",
        answer: [{ valueString: "Cough" }, { valueString: "Fever" }],
      },
    ]);
  });

  it("preserves repeated question maxOccurs across rendered controls and tampered add actions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-question-max-occurs",
      item: [
        {
          linkId: "priority",
          text: "Top priorities",
          type: "string",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(2)],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-question-max-occurs",
      status: "in-progress",
      item: [
        {
          linkId: "priority",
          text: "Top priorities",
          answer: [{ valueString: "Stability" }, { valueString: "Speed" }],
        },
      ],
    };
    const html = await render(questionnaire, questionnaireResponse);
    const formData = hiddenFormData(html);
    formData.append("fb[action]", "add-answer[priority]");
    const response = await process(
      questionnaire,
      formData,
      questionnaireResponse,
    );

    expect(countValue(html, "priority")).toBe("2");
    expect(html).not.toContain('data-fb-field="add-action"');
    expect(response.item?.[0]?.answer).toHaveLength(2);
  });

  it("preserves repeated group maxOccurs across rendered controls and tampered add actions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-max-occurs",
      item: [
        {
          linkId: "visit",
          text: "Visit",
          type: "group",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(2)],
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-group-max-occurs",
      status: "in-progress",
      item: [
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
    const html = await render(questionnaire, questionnaireResponse);
    const formData = hiddenFormData(html);
    formData.append("fb[action]", "add-group[visit]");
    const response = await process(
      questionnaire,
      formData,
      questionnaireResponse,
    );

    expect(countValue(html, "visit")).toBe("2");
    expect(html).not.toContain('data-fb-field="add-action"');
    expect(response.item).toHaveLength(2);
    expect(response.item?.map((item) => item.item?.[0]?.answer?.[0])).toEqual([
      { valueString: "First" },
      { valueString: "Second" },
    ]);
  });

  it("seeds repeated group rows to minOccurs and validates descendant content", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-min-occurs",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          extension: [minOccurs(1), maxOccurs(2)],
          item: [
            {
              linkId: "condition",
              text: "Condition",
              type: "string",
              required: true,
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalid = hiddenFormData(html);
    const invalidResult = await submit(questionnaire, invalid);
    const valid = hiddenFormData(html);
    valid.set("fb[answer][family-history][i:0][condition][value]", "Diabetes");
    const validResult = await submit(questionnaire, valid);

    expect(countValue(html, "family-history")).toBe("1");
    expect(attributeFrom(html, "condition", "name")).toBe(
      "fb[answer][family-history][i:0][condition][value]",
    );
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("occurrence");
    expect(validResult.valid).toBe(true);
  });

  it("validates non-repeating group minOccurs when descendants are empty", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-min-occurs-descendants",
      item: [
        {
          linkId: "lifestyle",
          text: "Lifestyle",
          type: "group",
          extension: [minOccurs(1)],
          item: [
            {
              linkId: "exercise",
              text: "Exercise details",
              type: "string",
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const invalidResult = await submit(questionnaire, hiddenFormData(html));
    const valid = hiddenFormData(html);
    valid.set(attributeFrom(html, "exercise", "name"), "Runs daily");
    const validResult = await submit(questionnaire, valid);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.html).toContain("At least one answer");
    expect(validResult.valid).toBe(true);
  });

  it("recomputes expression-driven minOccurs during full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-min-occurs-expression",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "requireTwo",
              "%context.item.where(linkId='gate').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "gate", text: "Gate", type: "boolean" },
            {
              linkId: "target",
              text: "Target",
              type: "string",
              repeats: true,
              extension: [
                minOccursExpression(
                  "iif(%requireTwo.exists() and %requireTwo, 2, 1)",
                ),
                maxOccurs(5),
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "gate", "name"), "true");
    const updated = await processAndRender(questionnaire, formData);

    expect(countValue(html, "target")).toBe("1");
    expect(countValue(updated, "target")).toBe("2");
    expect(fieldValues(updated, "target")).toHaveLength(2);
  });

  it("recomputes expression-driven minOccurs for repeated groups during full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-min-occurs-expression",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "requireTwo",
              "%context.item.where(linkId='gate').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "gate", text: "Gate", type: "boolean" },
            {
              linkId: "visit",
              text: "Visit",
              type: "group",
              repeats: true,
              extension: [
                minOccursExpression(
                  "iif(%requireTwo.exists() and %requireTwo, 2, 1)",
                ),
                maxOccurs(3),
              ],
              item: [{ linkId: "note", text: "Note", type: "string" }],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "gate", "name"), "true");
    const updated = await processAndRender(questionnaire, formData);

    expect(countValue(html, "visit")).toBe("1");
    expect(countValue(updated, "visit")).toBe("2");
    expect(updated).toContain(
      'name="fb[answer][panel][visit][i:1][note][value]"',
    );
  });

  it("exposes named repeated group occurrence expressions to descendant items", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-named-group-min-occurs-expression",
      item: [
        {
          linkId: "visit",
          text: "Visit",
          type: "group",
          repeats: true,
          extension: [minOccursExpression("2", "visitMinimum")],
          item: [
            {
              linkId: "minimum",
              text: "Minimum",
              type: "integer",
              extension: [calculatedExpression("%visitMinimum")],
            },
          ],
        },
      ],
    };

    const response = await process(questionnaire, new FormData());

    expect(
      response.item?.map((item) => item.item?.[0]?.answer?.[0]?.valueInteger),
    ).toEqual([2, 2]);
  });

  it("evaluates repeated group occurrence expressions against item variables", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-occurs-item-variable",
      item: [
        {
          linkId: "visit",
          text: "Visit",
          type: "group",
          repeats: true,
          extension: [
            variable("visitMinimumSource", "2"),
            minOccursExpression("%visitMinimumSource"),
          ],
          item: [{ linkId: "note", text: "Note", type: "string" }],
        },
      ],
    };

    const html = await render(questionnaire);

    expect(countValue(html, "visit")).toBe("2");
    expect(fieldValues(html, "note")).toHaveLength(2);
  });

  it("recomputes expression-driven maxOccurs before applying add actions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-max-occurs-expression",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "limitOne",
              "%context.item.where(linkId='gate').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "gate", text: "Gate", type: "boolean" },
            {
              linkId: "target",
              text: "Target",
              type: "string",
              repeats: true,
              extension: [
                minOccurs(1),
                maxOccursExpression(
                  "iif(%limitOne.exists() and %limitOne, 1, 3)",
                ),
              ],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "gate", "name"), "true");
    formData.set("fb[answer][panel][target][i:0][value]", "First");
    formData.append("fb[action]", "add-answer[panel][target]");
    const updated = await processAndRender(questionnaire, formData);

    expect(countValue(updated, "target")).toBe("1");
    expect(updated).not.toContain('data-fb-field="add-action"');
  });

  it("recomputes expression-driven maxOccurs for repeated groups before applying add actions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-max-occurs-expression",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "limitOne",
              "%context.item.where(linkId='gate').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "gate", text: "Gate", type: "boolean" },
            {
              linkId: "visit",
              text: "Visit",
              type: "group",
              repeats: true,
              extension: [
                minOccurs(1),
                maxOccursExpression(
                  "iif(%limitOne.exists() and %limitOne, 1, 3)",
                ),
              ],
              item: [{ linkId: "note", text: "Note", type: "string" }],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "gate", "name"), "true");
    formData.set("fb[answer][panel][visit][i:0][note][value]", "First");
    formData.append("fb[action]", "add-group[panel][visit]");
    const updated = await processAndRender(questionnaire, formData);

    expect(countValue(updated, "visit")).toBe("1");
    expect(updated).not.toContain('data-fb-field="add-action"');
  });
});
