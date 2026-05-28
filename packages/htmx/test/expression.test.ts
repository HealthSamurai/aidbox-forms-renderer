import { describe, expect, it, vi } from "vitest";

import {
  QuestionnaireRenderer,
  type QuestionnaireRendererOptions,
} from "../lib/index.ts";
import { nativeTemplates } from "./native-templates.ts";

import type {
  ExtensionOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";

type Extension = ExtensionOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type TestRendererOptions = Omit<
  QuestionnaireRendererOptions<"r5">,
  "templates" | "token"
> & {
  readonly templates?: Partial<QuestionnaireRendererOptions<"r5">["templates"]>;
  readonly token?: string | undefined;
};

const enableWhenExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression";
const initialExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression";
const calculatedExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";
const answerExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression";
const variableUrl = "http://hl7.org/fhir/StructureDefinition/variable";
const cqfExpressionUrl =
  "http://hl7.org/fhir/StructureDefinition/cqf-expression";
const launchContextUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext";

function expressionExtension(
  url: string,
  expression: string,
  name?: string,
): Extension {
  return {
    url,
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name === undefined ? {} : { name }),
    },
  };
}

function variable(name: string, expression: string): Extension {
  return expressionExtension(variableUrl, expression, name);
}

function initialExpression(expression: string, name?: string): Extension {
  return expressionExtension(initialExpressionUrl, expression, name);
}

function calculatedExpression(expression: string, name?: string): Extension {
  return expressionExtension(calculatedExpressionUrl, expression, name);
}

function answerExpression(expression: string, name?: string): Extension {
  return expressionExtension(answerExpressionUrl, expression, name);
}

function enableWhenExpression(expression: string, name?: string): Extension {
  return expressionExtension(enableWhenExpressionUrl, expression, name);
}

function cqfExpression(expression: string, name?: string): Extension {
  return expressionExtension(cqfExpressionUrl, expression, name);
}

function launchContext(name: string, type: string): Extension {
  return {
    url: launchContextUrl,
    extension: [
      {
        url: "name",
        valueCoding: {
          system: "http://hl7.org/fhir/uv/sdc/CodeSystem/launchContext",
          code: name,
        },
      },
      { url: "type", valueCode: type },
    ],
  };
}

function withRenderer<T>(
  options: TestRendererOptions,
  run: (renderer: QuestionnaireRenderer<"r5">) => T | Promise<T>,
): Promise<T> {
  const { templates, ...rendererOptions } = options;
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: { ...nativeTemplates, ...templates },
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

async function renderQuestionnaireResponse(options: TestRendererOptions) {
  return await withRenderer(options, async (renderer) => {
    await renderer.render();
    return renderer.getQuestionnaireResponse();
  });
}

async function processQuestionnaire(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
  options: TestRendererOptions,
) {
  return await withRenderer(options, async (renderer) => {
    const formData = formDataFromHtml(html, entries);
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  });
}

async function processForm(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
  options: TestRendererOptions,
) {
  return await withRenderer(options, async (renderer) => {
    const formData = formDataFromHtml(html, entries);
    const result = await renderer.process(formData);
    const renderedHtml = await renderer.render();
    return {
      result,
      html: renderedHtml,
      response: renderer.getQuestionnaireResponse(),
    };
  });
}

async function processAndRender(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
  options: TestRendererOptions,
): Promise<string> {
  return await withRenderer(options, async (renderer) => {
    const formData = formDataFromHtml(html, entries);
    await renderer.process(formData);
    return await renderer.render();
  });
}

function formDataFromHtml(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
): FormData {
  const formData = hiddenFormData(html);
  for (const [linkId, value] of entries) {
    if (linkId.startsWith("fb[")) {
      formData.set(linkId, value);
    } else {
      formData.set(attributeFrom(html, linkId, "name"), value);
    }
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

function fieldNamesFrom(
  html: string,
  linkId: string,
  field = "value",
): string[] {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const escapedField = escapeRegExp(encodeURIComponent(field));
  const pattern = new RegExp(
    String.raw`<[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\bdata-fb-field="${escapedField}"[^>]*\bname="([^"]+)"`,
    "gu",
  );

  return Array.from(html.matchAll(pattern), (match) =>
    decodeEntities(match[1] ?? ""),
  );
}

function inputValueFrom(html: string, linkId: string): string {
  return attributeFrom(html, linkId, "value");
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

describe("@formbox/htmx expression parity", () => {
  it("renders dynamic item text from _text expressions after submitted answers change", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-dynamic-text-expression",
      item: [
        {
          linkId: "panel",
          text: "Panel",
          type: "group",
          extension: [
            variable(
              "latestName",
              "%context.item.where(linkId='name').answer.valueString.last()",
            ),
          ],
          item: [
            { linkId: "name", text: "Respondent name", type: "string" },
            {
              linkId: "greeting",
              text: "Hello guest",
              _text: {
                extension: [
                  cqfExpression(
                    "iif(%latestName.exists(), 'Hello ' & %latestName, 'Hello guest')",
                  ),
                ],
              },
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
    const updated = await processForm(
      html,
      [
        ["name", "Ada"],
        ["greeting", "Confirmed"],
      ],
      {
        questionnaire,
        fhirVersion: "r5",
      },
    );

    expect(html).toContain("Hello guest");
    expect(updated.html).toContain("Hello Ada");
    expect(updated.response.item?.[0]?.item?.[1]?.text).toBe("Hello Ada");
  });

  it("renders issues from failing _text expressions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-dynamic-text-expression-error",
      item: [
        {
          linkId: "detail",
          text: "Static label",
          type: "string",
          _text: {
            extension: [cqfExpression("%missingLabel")],
          },
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate text expression");
    expect(html).toContain("because it references unavailable data");
  });

  it("applies initialExpression when an item becomes enabled through a full-form post", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-expression",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "name",
          text: "Name",
          type: "string",
          extension: [initialExpression("'prefill'")],
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await processQuestionnaire(html, [["gate", "true"]], {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      { linkId: "gate", text: "Gate", answer: [{ valueBoolean: true }] },
      { linkId: "name", text: "Name", answer: [{ valueString: "prefill" }] },
    ]);
  });

  it("runs initialExpression once when the item is disabled and re-enabled across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-expression-once",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "name",
          text: "Name",
          type: "string",
          extension: [initialExpression("'prefill'", "namePrefill")],
          enableWhen: [
            { question: "gate", operator: "=", answerBoolean: true },
          ],
        },
      ],
    };
    const firstHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const enabled = await processForm(firstHtml, [["gate", "true"]], {
      questionnaire,
      fhirVersion: "r5",
    });
    const customized = await processForm(
      enabled.html,
      [
        ["gate", "true"],
        ["name", "custom"],
      ],
      {
        questionnaire,
        questionnaireResponse: enabled.response,
        fhirVersion: "r5",
      },
    );
    const disabled = await processForm(
      customized.html,
      [
        ["gate", "false"],
        ["name", "custom"],
      ],
      {
        questionnaire,
        questionnaireResponse: customized.response,
        fhirVersion: "r5",
      },
    );
    const reenabled = await processForm(disabled.html, [["gate", "true"]], {
      questionnaire,
      questionnaireResponse: disabled.response,
      fhirVersion: "r5",
    });

    expect(disabled.html).toContain("custom");
    expect(disabled.response.item).toEqual([
      { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
    ]);
    expect(reenabled.response.item).toEqual([
      { linkId: "gate", text: "Gate", answer: [{ valueBoolean: true }] },
      { linkId: "name", text: "Name", answer: [{ valueString: "custom" }] },
    ]);
  });

  it("allows initialExpression to override template defaults", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-overrides-template",
      item: [
        {
          linkId: "favorite",
          text: "Favorite color",
          type: "string",
          initial: [{ valueString: "Template" }],
          extension: [initialExpression("'Expression'")],
        },
      ],
    };
    const response = await renderQuestionnaireResponse({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      {
        linkId: "favorite",
        text: "Favorite color",
        answer: [{ valueString: "Expression" }],
      },
    ]);
  });

  it("caps repeating initialExpression seeding to maxOccurs limits", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-repeats-max",
      item: [
        {
          linkId: "history",
          text: "History",
          type: "string",
          repeats: true,
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
              valueInteger: 2,
            },
            initialExpression("'Alpha' | 'Beta' | 'Gamma'"),
          ],
        },
      ],
    };
    const response = await renderQuestionnaireResponse({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      {
        linkId: "history",
        text: "History",
        answer: [{ valueString: "Alpha" }, { valueString: "Beta" }],
      },
    ]);
  });

  it("exposes named initialExpression values for descendants", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-named-descendant",
      item: [
        {
          linkId: "parent",
          text: "Parent",
          type: "group",
          item: [
            {
              linkId: "answer",
              text: "Answer",
              type: "string",
              extension: [initialExpression("'value'", "baseInit")],
              item: [
                {
                  linkId: "mirror",
                  text: "Mirror",
                  type: "string",
                  extension: [calculatedExpression("%baseInit")],
                },
              ],
            },
          ],
        },
      ],
    };
    const response = await renderQuestionnaireResponse({
      questionnaire,
      fhirVersion: "r5",
    });
    const parent = response.item?.find((item) => item.linkId === "parent");
    const answer = parent?.item?.find((item) => item.linkId === "answer");
    const mirror = answer?.answer?.[0]?.item?.find(
      (item) => item.linkId === "mirror",
    );

    expect(mirror?.answer?.[0]?.valueString).toBe("value");
  });

  it("renders unavailable-data errors from initialExpression", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-missing-variable",
      item: [
        {
          linkId: "target",
          text: "Target",
          type: "string",
          extension: [initialExpression("%missingInit")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate initial expression");
    expect(html).toContain("because it references unavailable data");
  });

  it("renders syntax errors from initialExpression", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-initial-syntax-error",
      item: [
        {
          linkId: "target",
          text: "Target",
          type: "string",
          extension: [initialExpression("1 +")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate initial expression");
    expect(html).toContain("because the expression has a syntax error");
  });

  it("recalculates calculatedExpression values instead of accepting stale submitted control values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-expression",
      item: [
        {
          linkId: "metrics",
          text: "Metrics",
          type: "group",
          extension: [
            variable(
              "heightValue",
              "%context.item.where(linkId='height').answer.valueDecimal.last()",
            ),
            variable(
              "weightValue",
              "%context.item.where(linkId='weight').answer.valueDecimal.last()",
            ),
          ],
          item: [
            { linkId: "height", text: "Height", type: "decimal" },
            { linkId: "weight", text: "Weight", type: "decimal" },
            {
              linkId: "bmi",
              text: "BMI",
              type: "decimal",
              extension: [
                calculatedExpression(
                  "%weightValue / ((%heightValue / 100) * (%heightValue / 100))",
                ),
              ],
            },
          ],
        },
      ],
    };
    const firstHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const secondHtml = await processAndRender(
      firstHtml,
      [
        ["height", "180"],
        ["weight", "80"],
        ["bmi", ""],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const response = await processQuestionnaire(
      secondHtml,
      [
        ["height", "180"],
        ["weight", "90"],
        ["bmi", inputValueFrom(secondHtml, "bmi")],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const metrics = response.item?.find((item) => item.linkId === "metrics");
    const bmi = metrics?.item?.find((item) => item.linkId === "bmi");

    expect(bmi?.answer?.[0]?.valueDecimal).toBeCloseTo(27.78, 2);
  });

  it("keeps user overrides for calculatedExpression values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-expression-override",
      item: [
        { linkId: "source", text: "Source", type: "decimal" },
        {
          linkId: "result",
          text: "Result",
          type: "decimal",
          extension: [
            calculatedExpression(
              "%resource.item.where(linkId='source').answer.valueDecimal.last() + 1",
            ),
          ],
        },
      ],
    };
    const firstHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const secondHtml = await processAndRender(
      firstHtml,
      [
        ["source", "1"],
        ["result", ""],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const response = await processQuestionnaire(
      secondHtml,
      [
        ["source", "2"],
        ["result", "99"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );

    expect(
      response.item?.find((item) => item.linkId === "result")?.answer?.[0]
        ?.valueDecimal,
    ).toBe(99);
  });

  it("preserves existing answers when initial QuestionnaireResponse differs from calculatedExpression", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-existing-override",
      item: [
        {
          linkId: "metrics",
          text: "Metrics",
          type: "group",
          extension: [
            variable(
              "heightValue",
              "%context.item.where(linkId='height').answer.valueDecimal.last()",
            ),
            variable(
              "weightValue",
              "%context.item.where(linkId='weight').answer.valueDecimal.last()",
            ),
          ],
          item: [
            { linkId: "height", text: "Height", type: "decimal" },
            { linkId: "weight", text: "Weight", type: "decimal" },
            {
              linkId: "bmi",
              text: "BMI",
              type: "decimal",
              extension: [
                calculatedExpression(
                  "%weightValue / ((%heightValue / 100) * (%heightValue / 100))",
                ),
              ],
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-calculated-existing-override",
      status: "in-progress",
      item: [
        {
          linkId: "metrics",
          text: "Metrics",
          item: [
            {
              linkId: "height",
              text: "Height",
              answer: [{ valueDecimal: 175 }],
            },
            {
              linkId: "weight",
              text: "Weight",
              answer: [{ valueDecimal: 70 }],
            },
            { linkId: "bmi", text: "BMI", answer: [{ valueDecimal: 42 }] },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const response = await processQuestionnaire(
      html,
      [
        ["height", "180"],
        ["weight", "90"],
        ["bmi", inputValueFrom(html, "bmi")],
      ],
      { questionnaire, questionnaireResponse, fhirVersion: "r5" },
    );
    const metrics = response.item?.find((item) => item.linkId === "metrics");
    const bmi = metrics?.item?.find((item) => item.linkId === "bmi");

    expect(bmi?.answer?.[0]?.valueDecimal).toBe(42);
  });

  it("supports repeating-question multi-value calculatedExpression results", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-repeats",
      item: [
        {
          linkId: "multi",
          text: "Multi",
          type: "string",
          repeats: true,
          extension: [calculatedExpression("'A' | 'B' | 'C'")],
        },
      ],
    };
    const response = await renderQuestionnaireResponse({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      {
        linkId: "multi",
        text: "Multi",
        answer: [
          { valueString: "A" },
          { valueString: "B" },
          { valueString: "C" },
        ],
      },
    ]);
  });

  it("overwrites template initial values when calculatedExpression runs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-overwrites-initial",
      item: [
        {
          linkId: "result",
          text: "Result",
          type: "decimal",
          initial: [{ valueDecimal: 5 }],
          extension: [calculatedExpression("10")],
        },
      ],
    };
    const response = await renderQuestionnaireResponse({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(response.item).toEqual([
      { linkId: "result", text: "Result", answer: [{ valueDecimal: 10 }] },
    ]);
  });

  it("allows named calculatedExpression values to be reused by child items", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-named-reuse",
      item: [
        {
          linkId: "group",
          text: "Group",
          type: "group",
          extension: [
            variable(
              "baseValue",
              "%context.item.where(linkId='base').answer.valueDecimal.last()",
            ),
          ],
          item: [
            { linkId: "base", text: "Base", type: "decimal" },
            {
              linkId: "derived",
              text: "Derived",
              type: "decimal",
              extension: [
                calculatedExpression("%baseValue + 1", "basePlusOne"),
              ],
              item: [
                {
                  linkId: "mirror",
                  text: "Mirror",
                  type: "decimal",
                  extension: [calculatedExpression("%basePlusOne")],
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
    const response = await processQuestionnaire(html, [["base", "5"]], {
      questionnaire,
      fhirVersion: "r5",
    });
    const group = response.item?.find((item) => item.linkId === "group");
    const derived = group?.item?.find((item) => item.linkId === "derived");
    const mirror = derived?.answer?.[0]?.item?.find(
      (item) => item.linkId === "mirror",
    );

    expect(mirror?.answer?.[0]?.valueDecimal).toBe(6);
  });

  it("renders circular dependency errors from calculatedExpression", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-cycle",
      item: [
        {
          linkId: "loop",
          text: "Loop",
          type: "group",
          extension: [
            variable(
              "aAnswer",
              "%context.item.where(linkId='a').answer.valueDecimal.last()",
            ),
            variable(
              "bAnswer",
              "%context.item.where(linkId='b').answer.valueDecimal.last()",
            ),
          ],
          item: [
            {
              linkId: "a",
              text: "A",
              type: "decimal",
              initial: [{ valueDecimal: 0 }],
              extension: [calculatedExpression("%bAnswer + 1")],
            },
            {
              linkId: "b",
              text: "B",
              type: "decimal",
              initial: [{ valueDecimal: 0 }],
              extension: [calculatedExpression("%aAnswer + 1")],
            },
          ],
        },
      ],
    };

    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate calculated expression");
    expect(html).toContain("dependency cycle");
  });

  it("renders syntax errors from calculatedExpression", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-syntax-error",
      item: [
        { linkId: "source", text: "Source", type: "decimal" },
        {
          linkId: "result",
          text: "Result",
          type: "decimal",
          extension: [calculatedExpression("1 +")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate calculated expression");
    expect(html).toContain("because the expression has a syntax error");
  });

  it("renders runtime errors from calculatedExpression", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-runtime-error",
      item: [
        { linkId: "source", text: "Source", type: "decimal" },
        {
          linkId: "result",
          text: "Result",
          type: "decimal",
          extension: [calculatedExpression("1.total()")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate calculated expression");
    expect(html).toContain("because it calls an unsupported function");
  });

  it("overwrites read-only answers with calculatedExpression results", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-calculated-readonly-overwrite",
      item: [
        {
          linkId: "metrics",
          text: "Metrics",
          type: "group",
          extension: [
            variable(
              "heightValue",
              "%context.item.where(linkId='height').answer.valueDecimal.last()",
            ),
            variable(
              "weightValue",
              "%context.item.where(linkId='weight').answer.valueDecimal.last()",
            ),
          ],
          item: [
            { linkId: "height", text: "Height", type: "decimal" },
            { linkId: "weight", text: "Weight", type: "decimal" },
            {
              linkId: "bmi",
              text: "BMI",
              type: "decimal",
              readOnly: true,
              extension: [
                calculatedExpression(
                  "%weightValue / ((%heightValue / 100) * (%heightValue / 100))",
                ),
              ],
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-calculated-readonly-overwrite",
      status: "in-progress",
      item: [
        {
          linkId: "metrics",
          text: "Metrics",
          item: [
            {
              linkId: "height",
              text: "Height",
              answer: [{ valueDecimal: 160 }],
            },
            {
              linkId: "weight",
              text: "Weight",
              answer: [{ valueDecimal: 70 }],
            },
            { linkId: "bmi", text: "BMI", answer: [{ valueDecimal: 42 }] },
          ],
        },
      ],
    };
    const initial = await renderQuestionnaireResponse({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const response = await processQuestionnaire(
      html,
      [
        ["height", "180"],
        ["weight", "90"],
        ["bmi", "999"],
      ],
      { questionnaire, questionnaireResponse, fhirVersion: "r5" },
    );
    const initialMetrics = initial.item?.find(
      (item) => item.linkId === "metrics",
    );
    const initialBmi = initialMetrics?.item?.find(
      (item) => item.linkId === "bmi",
    );
    const metrics = response.item?.find((item) => item.linkId === "metrics");
    const bmi = metrics?.item?.find((item) => item.linkId === "bmi");

    expect(initialBmi?.answer?.[0]?.valueDecimal).toBeCloseTo(27.34, 2);
    expect(bmi?.answer?.[0]?.valueDecimal).toBeCloseTo(27.78, 2);
  });

  it("updates answerExpression options after submitted answers change", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-expression",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
              "sourceValues",
              "%context.item.where(linkId='source').answer.valueString",
            ),
          ],
          item: [
            { linkId: "source", text: "Source", type: "string" },
            {
              linkId: "mirror",
              text: "Mirror",
              type: "string",
              extension: [answerExpression("%sourceValues")],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const updated = await processAndRender(html, [["source", "Alpha"]], {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(updated).toContain("Alpha");
    expect(updated).toContain(attributeFrom(updated, "mirror", "name"));
  });

  it("builds answer options from answerExpression output", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-expression-static",
      item: [
        {
          linkId: "color",
          text: "Preferred color",
          type: "string",
          extension: [answerExpression("('Red' | 'Green' | 'Blue')")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await processQuestionnaire(html, [["color", "Green"]], {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Red");
    expect(html).toContain("Green");
    expect(html).toContain("Blue");
    expect(response.item).toEqual([
      {
        linkId: "color",
        text: "Preferred color",
        answer: [{ valueString: "Green" }],
      },
    ]);
  });

  it("renders selected answerExpression options without dependency cycle warnings", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-answer-expression-selected-no-cycle",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
              "sourceValues",
              "%context.item.where(linkId='source').answer.valueString",
            ),
          ],
          item: [
            { linkId: "source", text: "Source", type: "string" },
            {
              linkId: "mirror",
              text: "Mirror",
              type: "string",
              extension: [answerExpression("%sourceValues")],
            },
          ],
        },
      ],
    };
    const firstHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const optionsHtml = await processAndRender(
      firstHtml,
      [["source", "Alpha"]],
      {
        questionnaire,
        fhirVersion: "r5",
      },
    );
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      const result = await processForm(
        optionsHtml,
        [
          ["source", "Alpha"],
          ["mirror", optionValue(optionsHtml, "Alpha")],
        ],
        {
          questionnaire,
          fhirVersion: "r5",
        },
      );

      const panel = result.response.item?.find(
        (item) => item.linkId === "panel",
      );
      const mirror = panel?.item?.find((item) => item.linkId === "mirror");

      expect(mirror?.answer?.[0]?.valueString).toBe("Alpha");
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("applies enableWhenExpression during full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-enable-expression",
      item: [
        { linkId: "age", text: "Age", type: "integer" },
        {
          linkId: "adult",
          text: "Adult",
          type: "string",
          extension: [
            enableWhenExpression(
              "%resource.item.where(linkId='age').answer.valueInteger.last() >= 18",
            ),
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(
      await processAndRender(html, [["age", "17"]], {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).not.toContain('data-fb-question="adult"');
    expect(
      await processAndRender(html, [["age", "18"]], {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toContain('data-fb-question="adult"');
  });

  it("exposes named enableWhenExpression values to answer descendants", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-named-enable-expression",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            variable(
              "controlFlag",
              "%context.item.where(linkId='control').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "control", type: "boolean" },
            {
              linkId: "dependent",
              type: "boolean",
              extension: [
                enableWhenExpression("%controlFlag", "dependentFlag"),
              ],
              item: [
                {
                  linkId: "mirror",
                  type: "boolean",
                  extension: [calculatedExpression("%dependentFlag")],
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
    const response = await processQuestionnaire(html, [["control", "true"]], {
      questionnaire,
      fhirVersion: "r5",
    });
    const group = response.item?.find((item) => item.linkId === "group");
    const dependent = group?.item?.find((item) => item.linkId === "dependent");
    const mirror = dependent?.answer?.[0]?.item?.find(
      (item) => item.linkId === "mirror",
    );

    expect(mirror?.answer?.[0]?.valueBoolean).toBe(true);
  });

  it("treats ancestor-to-descendant enableWhenExpression as unsatisfiable", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "htmx-cyclic-enable-expression",
      status: "active",
      url: "Questionnaire/htmx-cyclic-enable-expression",
      item: [
        {
          linkId: "repeating-group",
          type: "group",
          repeats: true,
          extension: [
            enableWhenExpression("%controlFlag"),
            variable(
              "controlFlag",
              "%context.item.where(linkId='control').answer.valueBoolean.last()",
            ),
          ],
          item: [{ linkId: "control", type: "boolean" }],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await processQuestionnaire(
      html,
      [
        ["fb[count][repeating-group]", "1"],
        ["fb[answer][repeating-group][i:0][control][value]", "true"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const rendered = await processAndRender(
      html,
      [
        ["fb[count][repeating-group]", "1"],
        ["fb[answer][repeating-group][i:0][control][value]", "true"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );

    expect(response.item ?? []).toHaveLength(0);
    expect(rendered).not.toContain('data-fb-link-id="control"');
  });

  it("renders issues from failing enableWhenExpression after submit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-enable-expression-error",
      item: [
        {
          linkId: "controlled",
          text: "Controlled",
          type: "string",
          extension: [enableWhenExpression("%missingFlag")],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const result = await processForm(html, [["fb[action]", "submit"]], {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(result.result).toEqual({ submitted: true, valid: true });
    expect(result.html).toContain("Failed to evaluate enable-when expression");
    expect(result.html).toContain("because it references unavailable data");
  });

  it("applies readOnlyExpression during full-form posts and ignores submitted read-only values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-readonly-expression",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
              "lockFlag",
              "%context.item.where(linkId='lock').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "lock", text: "Lock", type: "boolean" },
            {
              linkId: "detail",
              text: "Detail",
              type: "string",
              _readOnly: { extension: [cqfExpression("%lockFlag")] },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const response = await processQuestionnaire(
      html,
      [
        ["lock", "true"],
        ["detail", "tampered"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const rendered = await processAndRender(
      html,
      [
        ["lock", "true"],
        ["detail", "tampered"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const panel = response.item?.find((item) => item.linkId === "panel");

    expect(panel?.item?.some((item) => item.linkId === "detail")).toBe(false);
    expect(rendered).toContain('data-fb-question="detail"');
    expect(rendered).toContain("readonly");
  });

  it("cascades readOnlyExpression from groups to descendants during full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-readonly-expression-group",
      item: [
        {
          linkId: "section",
          type: "group",
          extension: [
            variable(
              "lockFlag",
              "%context.item.where(linkId='lock').answer.valueBoolean.last()",
            ),
          ],
          _readOnly: {
            extension: [cqfExpression("%lockFlag")],
          },
          item: [
            { linkId: "lock", text: "Lock", type: "boolean" },
            { linkId: "child", text: "Child", type: "string" },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const { html: rendered, response } = await processForm(
      html,
      [
        ["lock", "true"],
        ["child", "tampered"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const section = response.item?.find((item) => item.linkId === "section");

    expect(section?.item?.some((item) => item.linkId === "child")).toBe(false);
    expect(rendered).toContain('data-fb-question="child"');
    expect(rendered).toContain("readonly");
  });

  it("renders readOnlyExpression errors and keeps controls interactive", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-readonly-expression-error",
      item: [
        {
          linkId: "detail",
          text: "Detail",
          type: "string",
          _readOnly: {
            extension: [cqfExpression("%missingFlag")],
          },
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate read-only expression");
    expect(html).toContain("because it references unavailable data");
    expect(html).not.toContain("readonly");
  });

  it("applies requiredExpression during submit validation", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-required-expression",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
              "gateFlag",
              "%context.item.where(linkId='gate').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "gate", text: "Gate", type: "boolean" },
            {
              linkId: "detail",
              text: "Detail",
              type: "string",
              _required: { extension: [cqfExpression("%gateFlag")] },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const { result, html: submittedHtml } = await processForm(
      html,
      [
        ["gate", "true"],
        ["fb[action]", "submit"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );

    expect(result).toEqual({ submitted: true, valid: false });
    expect(submittedHtml).toContain("required");
  });

  it("applies repeatsExpression to expose repeat actions after a full-form post", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeats-expression",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
              "allowMultiple",
              "%context.item.where(linkId='allow').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "allow", text: "Allow multiple", type: "boolean" },
            {
              linkId: "favorite",
              text: "Favorite",
              type: "string",
              _repeats: { extension: [cqfExpression("%allowMultiple")] },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const rendered = await processAndRender(html, [["allow", "true"]], {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(rendered).toContain('data-fb-link-id="favorite"');
    expect(rendered).toContain('data-fb-field="add-action"');
  });

  it("drops extra submitted answers when repeatsExpression turns repeats off", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeats-expression-shrink",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            variable(
              "allowMultiple",
              "%context.item.where(linkId='allow').answer.valueBoolean.last()",
            ),
          ],
          item: [
            { linkId: "allow", text: "Allow multiple", type: "boolean" },
            {
              linkId: "favorite",
              text: "Favorite",
              type: "string",
              _repeats: { extension: [cqfExpression("%allowMultiple")] },
            },
          ],
        },
      ],
    };
    const firstHtml = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });
    const repeatingHtml = await processAndRender(
      firstHtml,
      [
        ["allow", "true"],
        ["favorite", "Blue"],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const twoAnswerHtml = await processAndRender(
      repeatingHtml,
      [
        ["allow", "true"],
        ["favorite", "Blue"],
        [
          "fb[action]",
          attributeFrom(repeatingHtml, "favorite", "value", "add-action"),
        ],
      ],
      { questionnaire, fhirVersion: "r5" },
    );
    const formData = hiddenFormData(twoAnswerHtml);
    const favoriteNames = fieldNamesFrom(twoAnswerHtml, "favorite");

    expect(favoriteNames).toHaveLength(2);

    formData.set(attributeFrom(twoAnswerHtml, "allow", "name"), "false");
    formData.set(favoriteNames[0] ?? "", "Blue");
    formData.set(favoriteNames[1] ?? "", "Green");

    const response = await withRenderer(
      { questionnaire, fhirVersion: "r5" },
      async (renderer) => {
        await renderer.process(formData);
        return renderer.getQuestionnaireResponse();
      },
    );
    const panel = response.item?.find((item) => item.linkId === "panel");
    const favorite = panel?.item?.find((item) => item.linkId === "favorite");

    expect(favorite?.answer).toEqual([{ valueString: "Blue" }]);
  });

  it("renders repeatsExpression errors and keeps single-answer controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeats-expression-error",
      item: [
        {
          linkId: "item",
          text: "Item",
          type: "string",
          _repeats: {
            extension: [cqfExpression("%missingFlag")],
          },
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Failed to evaluate repeats expression");
    expect(html).toContain("because it references unavailable data");
    expect(html).not.toContain('data-fb-field="add-action"');
  });

  it("evaluates questionnaire variables and launchContext values", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-launch-context",
      extension: [
        variable("globalValue", "'root-scope'"),
        launchContext("patient", "Patient"),
      ],
      item: [
        {
          linkId: "global",
          text: "Global",
          type: "string",
          extension: [calculatedExpression("%globalValue")],
        },
        {
          linkId: "patient-name",
          text: "Patient name",
          type: "string",
          extension: [
            calculatedExpression("%patient.name.given.first().first()"),
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
      launchContext: {
        patient: {
          resourceType: "Patient",
          id: "p-1",
          name: [{ given: ["Alice"] }],
        },
      },
    });
    const response = await processQuestionnaire(html, [], {
      questionnaire,
      fhirVersion: "r5",
      launchContext: {
        patient: {
          resourceType: "Patient",
          id: "p-1",
          name: [{ given: ["Alice"] }],
        },
      },
    });

    expect(response.item).toEqual([
      {
        linkId: "global",
        text: "Global",
        answer: [{ valueString: "root-scope" }],
      },
      {
        linkId: "patient-name",
        text: "Patient name",
        answer: [{ valueString: "Alice" }],
      },
    ]);
  });

  it("renders launchContext declaration issues", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-launch-context-issues",
      extension: [
        {
          url: launchContextUrl,
          extension: [{ url: "type", valueCode: "Patient" }],
        },
        {
          url: launchContextUrl,
          extension: [
            {
              url: "name",
              valueCoding: {
                system: "http://hl7.org/fhir/uv/sdc/CodeSystem/launchContext",
                code: "encounter",
              },
            },
          ],
        },
        launchContext("patient", "Practitioner"),
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("LaunchContext extension #1 is missing name.code.");
    expect(html).toContain(
      "LaunchContext &quot;encounter&quot; is missing at least one type.",
    );
    expect(html).toContain(
      "LaunchContext &quot;patient&quot; has invalid type(s)",
    );
  });

  it("renders reserved and duplicate launchContext variable names", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-launch-context-name-issues",
      extension: [
        launchContext("context", "Patient"),
        launchContext("patient", "Patient"),
        variable("patient", "'override'"),
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Variable name &quot;context&quot; is reserved");
    expect(html).toContain("Variable name collision for &quot;patient&quot;");
  });
});
