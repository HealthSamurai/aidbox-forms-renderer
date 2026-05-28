import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import * as renderer from "@formbox/renderer";
import strings from "@formbox/strings";

import {
  QuestionnaireRenderer,
  compileTemplates,
  htmlAttributes,
  loadNativeTemplates,
  loadTemplates,
  type QuestionnaireRendererOptions,
} from "../lib/index.ts";
import { templateNames } from "../lib/template.ts";
import { nativeTemplates } from "./native-templates.ts";

import type { QuestionnaireOf, QuestionnaireResponseOf } from "@formbox/fhir";

type QuestionnaireR4 = QuestionnaireOf<"r4">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponseR4 = QuestionnaireResponseOf<"r4">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type TestRendererOptions = Omit<
  QuestionnaireRendererOptions<"r5">,
  "templates" | "token"
> & {
  readonly templates?: Partial<QuestionnaireRendererOptions<"r5">["templates"]>;
  readonly token?: string | undefined;
};

function itemControlExtension(code: string) {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
    valueCodeableConcept: {
      coding: [
        {
          system: "http://hl7.org/fhir/questionnaire-item-control",
          code,
        },
      ],
    },
  };
}

const baseQuestionnaire = {
  resourceType: "Questionnaire",
  status: "active",
  url: "Questionnaire/basic",
  item: [
    {
      linkId: "name",
      text: "Patient name",
      type: "string",
    },
  ],
} satisfies Questionnaire;

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
  options: Partial<TestRendererOptions> = {},
): Promise<string> {
  return await withRenderer(
    {
      fhirVersion: "r5",
      questionnaire: baseQuestionnaire,
      ...options,
    },
    (renderer) => renderer.render(),
  );
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
  if (field !== "add-action" && field !== "remove-action") {
    const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
    const escapedField = escapeRegExp(encodeURIComponent(field));
    const pattern = new RegExp(
      String.raw`<[^>]*\b${attribute}="([^"]*\[${escapedLinkId}\][^"]*\[${escapedField}\])"`,
      "u",
    );
    const match = pattern.exec(html);
    if (!match?.[1]) {
      throw new Error(`Missing ${attribute} for ${linkId}.${field} in ${html}`);
    }
    return decodeEntities(match[1]);
  }

  const escapedLinkId = escapeRegExp(linkId);
  const escapedField = escapeRegExp(field);
  const dataAttributePattern = new RegExp(
    `<[^>]*data-fb-link-id="${escapedLinkId}"[^>]*data-fb-field="${escapedField}"[^>]*${attribute}="([^"]+)"`,
    "u",
  );
  const dataAttributeMatch = dataAttributePattern.exec(html);
  if (dataAttributeMatch?.[1]) {
    return decodeEntities(dataAttributeMatch[1]);
  }

  const actionPattern = new RegExp(
    String.raw`<button[^>]*data-fb-field="${escapedField}"[^>]*${attribute}="([^"]*\[${escapeRegExp(encodeURIComponent(linkId))}\][^"]*)"`,
    "u",
  );
  const match = actionPattern.exec(html);
  if (!match?.[1]) {
    throw new Error(`Missing ${attribute} for ${linkId}.${field} in ${html}`);
  }
  return decodeEntities(match[1]);
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
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

function decodeEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function callbackTextInput(): string {
  return "<input data-callback-template>";
}

describe("@formbox/htmx", () => {
  it("uses materialized store path references", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "alias", text: "Alias", type: "string", repeats: true }],
    };
    const store = new renderer.FormStore(
      strings.en,
      "r5",
      "form",
      questionnaire,
    );
    try {
      const node = store.nodes[0] as renderer.IQuestionNode;
      node.addAnswer();
      node.addAnswer();

      expect(store.findNodeByPath([{ linkId: "alias" }])).toBe(node);

      const secondAnswer = node.answers[1];
      expect(secondAnswer?.path).toEqual([{ linkId: "alias", index: 1 }]);

      node.removeAnswer(node.answers[0]!);

      expect(node.answers[0]).toBe(secondAnswer);
      expect(node.answers[0]?.path).toEqual([{ linkId: "alias", index: 0 }]);
    } finally {
      store.dispose();
    }
  });

  it("updates repeated group child paths when rows are removed", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "contact",
          text: "Contact",
          type: "group",
          repeats: true,
          item: [{ linkId: "phone", text: "Phone", type: "string" }],
        },
      ],
    };
    const store = new renderer.FormStore(
      strings.en,
      "r5",
      "form",
      questionnaire,
    );
    try {
      const list = store.nodes[0] as renderer.IGroupList;
      list.addNode();
      list.addNode();

      const secondGroup = list.nodes[1];
      const secondQuestion = secondGroup?.nodes[0];

      expect(secondGroup?.path).toEqual([{ linkId: "contact", index: 1 }]);
      expect(secondQuestion?.path).toEqual([
        { linkId: "contact", index: 1 },
        { linkId: "phone" },
      ]);

      list.removeNode(list.nodes[0]!);

      expect(list.nodes[0]).toBe(secondGroup);
      expect(secondGroup?.path).toEqual([{ linkId: "contact", index: 0 }]);
      expect(secondQuestion?.path).toEqual([
        { linkId: "contact", index: 0 },
        { linkId: "phone" },
      ]);
    } finally {
      store.dispose();
    }
  });

  it("uses deterministic question tokens across fresh stores", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "color",
          text: "Color",
          type: "string",
          answerConstraint: "optionsOrString",
          answerOption: [{ valueString: "red" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      item: [
        {
          linkId: "color",
          answer: [{ valueString: "blue" }],
        },
      ],
    };
    const first = new renderer.FormStore(
      strings.en,
      "r5",
      "form",
      questionnaire,
      questionnaireResponse,
    );
    const second = new renderer.FormStore(
      strings.en,
      "r5",
      "form",
      questionnaire,
      questionnaireResponse,
    );
    try {
      const firstQuestion = first.nodes[0] as renderer.IQuestionNode<"string">;
      const secondQuestion = second
        .nodes[0] as renderer.IQuestionNode<"string">;

      expect(firstQuestion.token).toBe(secondQuestion.token);
      expect(firstQuestion.answerOption.select.selectedOptions[0]?.token).toBe(
        secondQuestion.answerOption.select.selectedOptions[0]?.token,
      );
    } finally {
      first.dispose();
      second.dispose();
    }
  });

  it("namespaces question tokens by form token", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "name", text: "Name", type: "string" }],
    };
    const first = new renderer.FormStore(
      strings.en,
      "r5",
      "first-form",
      questionnaire,
    );
    const second = new renderer.FormStore(
      strings.en,
      "r5",
      "second-form",
      questionnaire,
    );
    try {
      const firstQuestion = first.nodes[0] as renderer.IQuestionNode<"string">;
      const secondQuestion = second
        .nodes[0] as renderer.IQuestionNode<"string">;

      expect(firstQuestion.token).toBe("first-form__name");
      expect(secondQuestion.token).toBe("second-form__name");
    } finally {
      first.dispose();
      second.dispose();
    }
  });

  it("supports renderer instances through the class API", async () => {
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire: baseQuestionnaire,
      fhirVersion: "r5",
    });
    try {
      const html = await renderer.render();
      const formData = formDataFromHtml(html, [["name", "Alice"]]);

      expect(html).toContain("<form");
      expect(html).toContain('name="fb[page]"');

      const result = await renderer.process(formData);

      expect(result).toEqual({ submitted: false });
      expect(renderer.getQuestionnaireResponse()).toEqual({
        resourceType: "QuestionnaireResponse",
        status: "in-progress",
        questionnaire: "Questionnaire/basic",
        item: [
          {
            linkId: "name",
            text: "Patient name",
            answer: [{ valueString: "Alice" }],
          },
        ],
      });
    } finally {
      renderer.dispose();
    }
  });

  it("wraps generated fields through the Form template", async () => {
    const renderer = new QuestionnaireRenderer({
      token: "form",
      questionnaire: baseQuestionnaire,
      fhirVersion: "r5",
      action: "/questionnaire",
      templates: {
        ...nativeTemplates,
        Form(properties) {
          const { attributes, fields } = properties;
          expect(attributes).toEqual({
            method: "post",
            action: "/questionnaire",
            enctype: "multipart/form-data",
            "hx-post": "/questionnaire",
            "hx-trigger": "submit, change delay:100ms",
            "hx-encoding": "multipart/form-data",
            "hx-swap": "outerHTML",
            "hx-include": "closest form",
          });
          return `<form${htmlAttributes(attributes)}>${fields}</form>`;
        },
      },
    });
    try {
      const html = await renderer.render();

      expect(html).toContain("<form");
      expect(html).toContain('action="/questionnaire"');
      expect(html).toContain('hx-post="/questionnaire"');
      expect(html).toContain('hx-trigger="submit, change delay:100ms"');
      expect(html).toContain('name="fb[page]"');
      expect(html).toContain("Patient name");
    } finally {
      renderer.dispose();
    }
  });

  it("renders stable control and label ids across fresh stores", async () => {
    const first = await renderQuestionnaire();
    const second = await renderQuestionnaire();

    expect(first).toContain('id="form__name__0__control"');
    expect(second).toContain('id="form__name__0__control"');
    expect(first).toContain(
      '<label id="form__name__label" for="form__name__0__control"',
    );
    expect(first).toContain('aria-labelledby="form__name__label"');
  });

  it("keeps generated hidden fields inside custom Form template output", async () => {
    const questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/custom-form-hidden-fields",
      item: [
        {
          linkId: "readonly",
          text: "Read only",
          type: "string",
          readOnly: true,
        },
      ],
    } satisfies Questionnaire;
    const questionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/custom-form-hidden-fields",
      item: [{ linkId: "readonly", answer: [{ valueString: "server" }] }],
    } satisfies QuestionnaireResponse;
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      templates: {
        Form({ attributes, fields }) {
          return `<form${htmlAttributes(attributes)}>${fields}</form>`;
        },
      },
    });
    const form = /<form\b[^>]*>(?<content>[\s\S]*)<\/form>/u.exec(html)
      ?.groups?.["content"];

    expect(form).toContain('name="fb[page]"');
    expect(form).toContain('name="fb[readonly][readonly]"');
    expect(form).toContain('value="server"');
  });

  it("keeps built-in template markup in .html.hbs files", async () => {
    const files = await readdir(new URL("../lib/templates/", import.meta.url));

    expect(
      files.filter((file) => file.endsWith(".html.hbs")).toSorted(),
    ).toEqual(templateNames.map((name) => `${name}.html.hbs`).toSorted());
  });

  it("documents and formats built-in template files", async () => {
    const directory = new URL("../lib/templates/", import.meta.url);

    for (const name of templateNames) {
      const source = await readFile(
        new URL(`${name}.html.hbs`, directory),
        "utf8",
      );

      expect(source, name).toMatch(
        new RegExp(
          String.raw`^\{\{!--\nTemplate: ${name}\n\nInputs:\n(?:- .+\n)+--\}\}\n`,
          "u",
        ),
      );
      expect(source, name).toBe(source.trimEnd() + "\n");
      for (const line of source.split("\n")) {
        expect(line, name).not.toMatch(/[ \t]+$/u);
      }
    }
  });

  it("loads native templates through the file template loader", async () => {
    const templates = await loadNativeTemplates();
    const html = templates.TextInput({
      id: "patient-name",
      inputType: "text",
      value: "Alice",
      ariaLabelledBy: "patient-name-label",
      field: "value",
      name: "fb[answer][name][value]",
      "data-fb-link-id": "name",
      "data-fb-field": "value",
      "hx-include": "closest form",
    });

    expect(html).toContain("<input");
    expect(html).toContain('id="patient-name"');
    expect(html).toContain('name="fb[answer][name][value]"');
    expect(html).toContain('value="Alice"');
  });

  it("compiles Handlebars template strings with HTML helpers", () => {
    const templates = compileTemplates({
      TextInput: `<input{{{fieldAttributes}}}{{{attr "id" id}}}{{{attr "type" type}}}{{{attr "value" value}}}><span>{{value}}</span>`,
    });

    const html = templates.TextInput?.({
      id: "patient-name",
      type: "text",
      value: 'Alice "A"',
      ariaLabelledBy: "patient-name-label",
      field: "value",
      name: "fb[answer][name][value]",
      "data-fb-link-id": "name",
      "data-fb-field": "value",
      "hx-include": "closest form",
    });

    expect(html).toContain("<input");
    expect(html).toContain('id="patient-name"');
    expect(html).toContain('name="fb[answer][name][value]"');
    expect(html).toContain('value="Alice &quot;A&quot;"');
    expect(html).toContain("<span>Alice &quot;A&quot;</span>");
  });

  it("preserves callback templates when compiling template sources", () => {
    const templates = compileTemplates({
      TextInput: callbackTextInput,
      Form: `<form{{{attrs attributes}}}>{{{fields}}}</form>`,
    });

    expect(templates.TextInput).toBe(callbackTextInput);
    expect(
      templates.Form?.({
        attributes: {
          method: "post",
          action: "/questionnaire",
        },
        fields: "<input>",
        children: "",
        submitLabel: "Submit",
      }),
    ).toBe('<form method="post" action="/questionnaire"><input></form>');
  });

  it("loads Handlebars templates from .html.hbs files", async () => {
    const directory = await mkdtemp(
      path.join(os.tmpdir(), "formbox-htmx-templates-"),
    );
    try {
      await writeFile(
        path.join(directory, "TextInput.html.hbs"),
        `<input data-loaded-template="true"{{{fieldAttributes}}}{{{attr "id" id}}}>`,
      );

      const html = await renderQuestionnaire({
        templates: await loadTemplates(directory),
      });

      expect(html).toContain('data-loaded-template="true"');
      expect(html).toContain('name="fb[answer][name][value]"');
      expect(html).toContain('id="form__name__0__control"');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects unknown template files", async () => {
    const directory = await mkdtemp(
      path.join(os.tmpdir(), "formbox-htmx-templates-"),
    );
    try {
      await writeFile(path.join(directory, "Typo.html.hbs"), "");

      await expect(loadTemplates(directory)).rejects.toThrow(
        "Unknown template file: Typo.html.hbs",
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("renders template HTML without exposing the internal HTML tag", async () => {
    const renderer = new QuestionnaireRenderer({
      token: "form",
      questionnaire: baseQuestionnaire,
      fhirVersion: "r5",
      templates: {
        ...nativeTemplates,
        TextInput(properties) {
          return `<input data-custom-input="true" name="${String(properties.name)}">`;
        },
      },
    });
    try {
      const html = await renderer.render();

      expect(html).toContain('data-custom-input="true"');
      expect(html).toContain('name="fb[answer][name][value]"');
      expect(html).not.toContain("x-html");
    } finally {
      renderer.dispose();
    }
  });

  it("returns submit validity after processing a submitted form", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/required-api",
      item: [
        {
          linkId: "required-name",
          text: "Required name",
          type: "string",
          required: true,
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
      const formData = hiddenFormData(await renderer.render());
      formData.set("fb[action]", "submit");

      const result = await renderer.process(formData);

      expect(result).toEqual({ submitted: true, valid: false });
      expect(await renderer.render()).toContain("At least one");
    } finally {
      renderer.dispose();
    }
  });

  it("renders initial Questionnaire HTML fields", async () => {
    const html = await renderQuestionnaire();

    expect(html).toContain("<form");
    expect(html).toContain('hx-include="closest form"');
    expect(html).toContain("Patient name");
    expect(attributeFrom(html, "name", "name")).toBe("fb[answer][name][value]");
  });

  it("reproduces seeded QuestionnaireResponse content", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/prepopulated",
      status: "active",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "group",
          repeats: true,
          item: [
            { linkId: "description", text: "Description", type: "text" },
            { linkId: "onset", text: "Onset date", type: "date" },
          ],
        },
        {
          linkId: "consent",
          text: "Consent to share data",
          type: "boolean",
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/prepopulated",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          item: [
            {
              linkId: "description",
              text: "Description",
              answer: [{ valueString: "Fever" }],
            },
            {
              linkId: "onset",
              text: "Onset date",
              answer: [{ valueDate: "2024-04-01" }],
            },
          ],
        },
        {
          linkId: "symptoms",
          text: "Symptoms",
          item: [
            {
              linkId: "description",
              text: "Description",
              answer: [{ valueString: "Cough" }],
            },
            {
              linkId: "onset",
              text: "Onset date",
              answer: [{ valueDate: "2024-04-03" }],
            },
          ],
        },
        {
          linkId: "consent",
          text: "Consent to share data",
          answer: [{ valueBoolean: true }],
        },
      ],
    };

    await withRenderer(
      { questionnaire, questionnaireResponse, fhirVersion: "r5" },
      (renderer) => {
        expect(renderer.getQuestionnaireResponse()).toEqual(
          questionnaireResponse,
        );
      },
    );
  });

  it("falls back to a local Questionnaire reference when canonical URL is absent", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "local-form",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          type: "string",
        },
      ],
    };
    const html = await renderQuestionnaire({ questionnaire });
    const formData = formDataFromHtml(html, [["nickname", "Oli"]]);

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/local-form",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          answer: [{ valueString: "Oli" }],
        },
      ],
    });
  });

  it("renders fields through the server React theme scaffold", async () => {
    const html = await renderQuestionnaire();

    expect(html).toMatch(
      /<label[^>]+id="form__name__label"[^>]+for="form__name__0__control"/u,
    );
    expect(html).toMatch(/<input[^>]+id="form__name__0__control"/u);
  });

  it("generates stable input names across fresh stores", async () => {
    const first = await renderQuestionnaire();
    const second = await renderQuestionnaire();

    expect(attributeFrom(first, "name", "name")).toBe(
      "fb[answer][name][value]",
    );
    expect(attributeFrom(first, "name", "name")).toBe(
      attributeFrom(second, "name", "name"),
    );
  });

  it("parses submitted native controls into a QuestionnaireResponse", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/types",
      item: [
        { linkId: "name", text: "Name", type: "string" },
        { linkId: "age", text: "Age", type: "integer" },
        { linkId: "agreed", text: "Agreed", type: "boolean" },
        {
          linkId: "priority",
          text: "Priority",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.test/priority",
                code: "high",
                display: "High",
              },
            },
          ],
        },
        { linkId: "dose", text: "Dose", type: "quantity" },
        { linkId: "subject", text: "Subject", type: "reference" },
      ],
    };
    const html = await renderQuestionnaire({ questionnaire });
    const formData = formDataFromHtml(html, [
      ["name", "Alice"],
      ["age", "42"],
      ["agreed", "true"],
      [
        "priority",
        JSON.stringify({
          system: "http://example.test/priority",
          code: "high",
          display: "High",
        }),
      ],
      ["dose", "5"],
      ["subject", "Patient/123"],
    ]);
    formData.set(attributeFrom(html, "dose", "name", "unit"), "mg");
    formData.set(attributeFrom(html, "subject", "name", "display"), "Alice");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/types",
      item: [
        { linkId: "name", text: "Name", answer: [{ valueString: "Alice" }] },
        { linkId: "age", text: "Age", answer: [{ valueInteger: 42 }] },
        {
          linkId: "agreed",
          text: "Agreed",
          answer: [{ valueBoolean: true }],
        },
        {
          linkId: "priority",
          text: "Priority",
          answer: [
            {
              valueCoding: {
                system: "http://example.test/priority",
                code: "high",
                display: "High",
              },
            },
          ],
        },
        {
          linkId: "dose",
          text: "Dose",
          answer: [{ valueQuantity: { value: 5, unit: "mg" } }],
        },
        {
          linkId: "subject",
          text: "Subject",
          answer: [
            {
              valueReference: {
                reference: "Patient/123",
                display: "Alice",
              },
            },
          ],
        },
      ],
    });
  });

  it("rounds submitted integer controls like the core renderer input", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/integer-rounding",
      item: [{ linkId: "age", text: "Age", type: "integer" }],
    };
    const html = await renderQuestionnaire({ questionnaire });
    const formData = formDataFromHtml(html, [["age", "42.6"]]);

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/integer-rounding",
      item: [{ linkId: "age", text: "Age", answer: [{ valueInteger: 43 }] }],
    });
  });

  it("keeps unanswered boolean checkboxes out of QuestionnaireResponse", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/boolean-unanswered",
      item: [{ linkId: "agreed", text: "Agreed", type: "boolean" }],
    };
    const html = await renderQuestionnaire({ questionnaire });

    expect(
      await responseFromFormData(hiddenFormData(html), {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/boolean-unanswered",
    });
  });

  it("renders and processes R4 questionnaires", async () => {
    const questionnaire: QuestionnaireR4 = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/r4-basic",
      item: [
        { linkId: "name", text: "Name", type: "string" },
        { linkId: "active", text: "Active", type: "boolean" },
      ],
    };
    const html = await withRenderer(
      { questionnaire, fhirVersion: "r4" },
      (instance) => instance.render(),
    );
    const formData = hiddenFormData(html);
    formData.append(attributeFrom(html, "name", "name"), "Alice");
    formData.append(attributeFrom(html, "active", "name"), "true");
    const response = await withRenderer(
      { questionnaire, fhirVersion: "r4" },
      async (instance): Promise<QuestionnaireResponseR4> => {
        await instance.process(formData);
        return instance.getQuestionnaireResponse();
      },
    );

    expect(response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/r4-basic",
      item: [
        { linkId: "name", text: "Name", answer: [{ valueString: "Alice" }] },
        { linkId: "active", text: "Active", answer: [{ valueBoolean: true }] },
      ],
    });
  });

  it("recomputes enableWhen visibility from submitted answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/enable-when",
      item: [
        { linkId: "show-details", text: "Show details", type: "boolean" },
        {
          linkId: "details",
          text: "Details",
          type: "string",
          enableWhen: [
            {
              question: "show-details",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({ questionnaire });

    const hiddenHtml = await processAndRender(
      formDataFromHtml(html, [["show-details", "false"]]),
      { questionnaire, fhirVersion: "r5" },
    );
    expect(hiddenHtml).not.toContain('data-fb-link-id="details"');

    const visibleHtml = await processAndRender(
      formDataFromHtml(html, [["show-details", "true"]]),
      { questionnaire, fhirVersion: "r5" },
    );
    expect(visibleHtml).toContain('data-fb-question="details"');
  });

  it("adds and removes repeated question and group rows with HTMX actions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/repeats",
      item: [
        { linkId: "alias", text: "Alias", type: "string", repeats: true },
        {
          linkId: "symptom",
          text: "Symptom",
          type: "group",
          repeats: true,
          item: [{ linkId: "label", text: "Label", type: "string" }],
        },
      ],
    };
    const initial = await renderQuestionnaire({ questionnaire });
    const addAliasAction = attributeFrom(
      initial,
      "alias",
      "value",
      "add-action",
    );
    const addGroupAction = attributeFrom(
      initial,
      "symptom",
      "value",
      "add-action",
    );
    const addData = hiddenFormData(initial);
    addData.append("fb[action]", addAliasAction);
    addData.append("fb[action]", addGroupAction);

    const addedHtml = await processAndRender(addData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect([
      ...addedHtml.matchAll(/name="fb\[answer\]\[alias\]\[i:\d+\]\[value\]"/gu),
    ]).toHaveLength(2);
    expect([
      ...addedHtml.matchAll(
        /name="fb\[answer\]\[symptom\]\[i:\d+\]\[label\]\[value\]"/gu,
      ),
    ]).toHaveLength(1);

    const removeAliasAction = attributeFrom(
      addedHtml,
      "alias",
      "value",
      "remove-action",
    );
    const removeData = hiddenFormData(addedHtml);
    removeData.append("fb[action]", removeAliasAction);
    const removedHtml = await processAndRender(removeData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect([
      ...removedHtml.matchAll(
        /name="fb\[answer\]\[alias\]\[i:\d+\]\[value\]"/gu,
      ),
    ]).toHaveLength(1);
  });

  it("preserves off-page answers across paginated HTMX posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/pages",
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-1", text: "Question 1", type: "string" }],
        },
        {
          linkId: "page-2",
          text: "Page 2",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-2", text: "Question 2", type: "string" }],
        },
      ],
    };
    const firstPageHtml = await renderQuestionnaire({ questionnaire });
    const nextData = formDataFromHtml(firstPageHtml, [
      ["question-1", "first page answer"],
    ]);
    nextData.append("fb[action]", "page-next");

    const secondPageHtml = await processAndRender(nextData, {
      questionnaire,
      fhirVersion: "r5",
    });
    const finalData = formDataFromHtml(secondPageHtml, [
      ["question-2", "second page answer"],
    ]);
    const response = await responseFromFormData(finalData, {
      questionnaire,
      fhirVersion: "r5",
    });
    const serialized = JSON.stringify(response);

    expect(secondPageHtml).toContain('value="first page answer"');
    expect(serialized).toContain('"valueString":"first page answer"');
    expect(serialized).toContain('"valueString":"second page answer"');
  });

  it("clamps restored page numbers to the last available page", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/page-clamp",
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-1", text: "Question 1", type: "string" }],
        },
        {
          linkId: "page-2",
          text: "Page 2",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-2", text: "Question 2", type: "string" }],
        },
      ],
    };
    const formData = hiddenFormData(
      await renderQuestionnaire({ questionnaire }),
    );
    formData.set("fb[page]", "99");

    const html = await processAndRender(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Page 2");
    expect(html).toContain('value="2"');
  });

  it("ignores malformed restored page numbers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/page-malformed",
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-1", text: "Question 1", type: "string" }],
        },
        {
          linkId: "page-2",
          text: "Page 2",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-2", text: "Question 2", type: "string" }],
        },
      ],
    };
    const formData = hiddenFormData(
      await renderQuestionnaire({ questionnaire }),
    );
    formData.set("fb[page]", "2x");

    const html = await processAndRender(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Page 1");
    expect(html).toContain('value="1"');
  });

  it("preserves off-page answer child items across paginated HTMX posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/answer-child-pages",
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [
            {
              linkId: "parent",
              text: "Parent",
              type: "string",
              item: [{ linkId: "child", text: "Child", type: "string" }],
            },
          ],
        },
        {
          linkId: "page-2",
          text: "Page 2",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [{ linkId: "question-2", text: "Question 2", type: "string" }],
        },
      ],
    };
    const firstPageHtml = await renderQuestionnaire({ questionnaire });
    const nextData = formDataFromHtml(firstPageHtml, [
      ["parent", "parent answer"],
      ["child", "child answer"],
    ]);
    nextData.append("fb[action]", "page-next");

    const secondPageHtml = await processAndRender(nextData, {
      questionnaire,
      fhirVersion: "r5",
    });
    const finalData = formDataFromHtml(secondPageHtml, [
      ["question-2", "second page answer"],
    ]);
    const response = await responseFromFormData(finalData, {
      questionnaire,
      fhirVersion: "r5",
    });
    const serialized = JSON.stringify(response);

    expect(secondPageHtml).toContain('value="child answer"');
    expect(serialized).toContain('"valueString":"parent answer"');
    expect(serialized).toContain('"valueString":"child answer"');
  });

  it("uses submitted File values for attachment answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/attachment",
      item: [{ linkId: "scan", text: "Scan", type: "attachment" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/attachment",
      item: [
        {
          linkId: "scan",
          text: "Scan",
          answer: [
            {
              valueAttachment: {
                title: "old.txt",
                contentType: "text/plain",
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = hiddenFormData(html);
    formData.append(
      attributeFrom(html, "scan", "name"),
      new File(["new"], "new.txt", { type: "text/plain" }),
    );

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/attachment",
      item: [
        {
          linkId: "scan",
          text: "Scan",
          answer: [
            {
              valueAttachment: {
                title: "new.txt",
                contentType: "text/plain",
                size: 3,
                data: "bmV3",
              },
            },
          ],
        },
      ],
    });
  });

  it("renders a submit control that clears existing attachment answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/attachment-clear",
      item: [{ linkId: "scan", text: "Scan", type: "attachment" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/attachment-clear",
      item: [
        {
          linkId: "scan",
          text: "Scan",
          answer: [
            {
              valueAttachment: {
                title: "old.txt",
                contentType: "text/plain",
                data: "b2xk",
                size: 3,
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = hiddenFormData(html);
    formData.append(attributeFrom(html, "scan", "name"), "");

    expect(html).toContain(">Clear<");
    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/attachment-clear",
    });
  });

  it("preserves coded quantity metadata from visible controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/coded-quantity",
      item: [{ linkId: "dose", text: "Dose", type: "quantity" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/coded-quantity",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          answer: [
            {
              valueQuantity: {
                value: 5,
                unit: "milligram",
                system: "http://unitsofmeasure.org",
                code: "mg",
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = formDataFromHtml(html, [["dose", "5"]]);
    formData.set(attributeFrom(html, "dose", "name", "unit"), "milligram");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual(questionnaireResponse);
  });

  it("preserves quantity comparators from visible controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/quantity-comparator",
      item: [{ linkId: "dose", text: "Dose", type: "quantity" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/quantity-comparator",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          answer: [
            {
              valueQuantity: {
                comparator: "<",
                value: 5,
                unit: "mg",
                system: "http://unitsofmeasure.org",
                code: "mg",
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = formDataFromHtml(html, [["dose", "5"]]);
    formData.set(attributeFrom(html, "dose", "name", "unit"), "mg");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual(questionnaireResponse);
  });

  it("preserves coding metadata from visible controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/coding-metadata",
      item: [{ linkId: "diagnosis", text: "Diagnosis", type: "coding" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/coding-metadata",
      item: [
        {
          linkId: "diagnosis",
          text: "Diagnosis",
          answer: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                version: "2024-03",
                code: "195967001",
                display: "Asthma",
                userSelected: true,
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = hiddenFormData(html);
    formData.set(
      attributeFrom(html, "diagnosis", "name", "system"),
      "http://snomed.info/sct",
    );
    formData.set(attributeFrom(html, "diagnosis", "name"), "195967001");
    formData.set(attributeFrom(html, "diagnosis", "name", "display"), "Asthma");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual(questionnaireResponse);
  });

  it("preserves reference metadata from visible controls", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/reference-metadata",
      item: [{ linkId: "subject", text: "Subject", type: "reference" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/reference-metadata",
      item: [
        {
          linkId: "subject",
          text: "Subject",
          answer: [
            {
              valueReference: {
                type: "Patient",
                reference: "Patient/123",
                identifier: { system: "urn:mrn", value: "123" },
                display: "Alice",
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = hiddenFormData(html);
    formData.set(attributeFrom(html, "subject", "name"), "Patient/123");
    formData.set(attributeFrom(html, "subject", "name", "display"), "Alice");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual(questionnaireResponse);
  });

  it("clears existing complex answers when visible controls are emptied", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/clear-complex-values",
      item: [
        { linkId: "diagnosis", text: "Diagnosis", type: "coding" },
        { linkId: "subject", text: "Subject", type: "reference" },
        { linkId: "dose", text: "Dose", type: "quantity" },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/clear-complex-values",
      item: [
        {
          linkId: "diagnosis",
          text: "Diagnosis",
          answer: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                code: "195967001",
                display: "Asthma",
              },
            },
          ],
        },
        {
          linkId: "subject",
          text: "Subject",
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
          linkId: "dose",
          text: "Dose",
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
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = hiddenFormData(html);

    formData.set(attributeFrom(html, "diagnosis", "name", "system"), "");
    formData.set(attributeFrom(html, "diagnosis", "name"), "");
    formData.set(attributeFrom(html, "diagnosis", "name", "display"), "");
    formData.set(attributeFrom(html, "subject", "name"), "");
    formData.set(attributeFrom(html, "subject", "name", "display"), "");
    formData.set(attributeFrom(html, "dose", "name"), "");
    formData.set(attributeFrom(html, "dose", "name", "unit"), "");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/clear-complex-values",
    });
  });

  it("drops coding version metadata when visible coding controls are emptied", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/clear-coding-version",
      item: [{ linkId: "diagnosis", text: "Diagnosis", type: "coding" }],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/clear-coding-version",
      item: [
        {
          linkId: "diagnosis",
          text: "Diagnosis",
          answer: [
            {
              valueCoding: {
                system: "http://snomed.info/sct",
                version: "20240101",
                code: "195967001",
                display: "Asthma",
              },
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
    });
    const formData = hiddenFormData(html);

    formData.set(attributeFrom(html, "diagnosis", "name", "system"), "");
    formData.set(attributeFrom(html, "diagnosis", "name"), "");
    formData.set(attributeFrom(html, "diagnosis", "name", "display"), "");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/clear-coding-version",
    });
  });

  it("ignores malformed repeat action payloads", async () => {
    const formData = new FormData();
    formData.append("fb[action]", "add-answer:not-base64");
    formData.append("fb[action]", "add-answer[%");
    formData.append("fb[action]", "add-answer[%ZZ]");

    const html = await processAndRender(formData, {
      questionnaire: baseQuestionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Patient name");
  });

  it("ignores malformed submitted repeat counts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/malformed-repeat-count",
      item: [
        {
          linkId: "alias",
          text: "Alias",
          type: "string",
          repeats: true,
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/malformed-repeat-count",
      item: [
        {
          linkId: "alias",
          text: "Alias",
          answer: [{ valueString: "kept" }],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      fhirVersion: "r5",
    });
    const formData = hiddenFormData(html);
    const countName = [...formData.keys()].find(
      (name) => name === "fb[count][alias]",
    );

    expect(countName).toBeDefined();
    if (!countName) {
      throw new Error("Missing alias repeat count");
    }

    formData.set(countName, "0x");
    formData.set(attributeFrom(html, "alias", "name"), "kept");

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        questionnaireResponse,
        fhirVersion: "r5",
      }),
    ).toMatchObject({
      item: [
        {
          linkId: "alias",
          answer: [{ valueString: "kept" }],
        },
      ],
    });
  });

  it("preserves hidden enabled values and protected disabled values without leaking disabled answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/hidden",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "secret",
          text: "Secret",
          type: "string",
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
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
          linkId: "display-only",
          text: "Display only",
          type: "string",
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-usageMode",
              valueCode: "display",
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden",
      item: [
        { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
        { linkId: "secret", text: "Secret", answer: [{ valueString: "s1" }] },
        {
          linkId: "protected",
          text: "Protected",
          answer: [{ valueString: "p1" }],
        },
        {
          linkId: "display-only",
          text: "Display only",
          answer: [{ valueString: "d1" }],
        },
      ],
    };

    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      mode: "capture",
    });

    expect(html).toContain('type="hidden"');
    expect(html).toContain('value="s1"');
    expect(html).toContain('value="p1"');
    expect(html).not.toContain('data-fb-link-id="display-only"');

    const formData = formDataFromHtml(html, [
      ["gate", "false"],
      ["secret", "s1"],
      ["protected", "p1"],
    ]);

    expect(
      await responseFromFormData(formData, {
        questionnaire,
        fhirVersion: "r5",
        mode: "capture",
      }),
    ).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden",
      item: [
        { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
        { linkId: "secret", text: "Secret", answer: [{ valueString: "s1" }] },
      ],
    });
  });

  it("does not preserve explicitly hidden answers while enableWhen disables the item", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/hidden-disabled",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "hidden-disabled",
          text: "Hidden disabled",
          type: "string",
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
              valueBoolean: true,
            },
          ],
          enableWhen: [
            {
              question: "gate",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden-disabled",
      item: [
        { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
        {
          linkId: "hidden-disabled",
          text: "Hidden disabled",
          answer: [{ valueString: "stale-disabled" }],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      mode: "capture",
    });
    const formData = formDataFromHtml(html, [["gate", "false"]]);
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });

    expect(html).not.toContain('data-fb-link-id="hidden-disabled"');
    expect(response.item).toEqual([
      { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
    ]);
  });

  it("does not preserve disabled child answers through a hidden parent group", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/hidden-parent-disabled-child",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "hidden-group",
          text: "Hidden group",
          type: "group",
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
              valueBoolean: true,
            },
          ],
          item: [
            {
              linkId: "disabled-child",
              text: "Disabled child",
              type: "string",
              enableWhen: [
                {
                  question: "gate",
                  operator: "=",
                  answerBoolean: true,
                },
              ],
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden-parent-disabled-child",
      item: [
        { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
        {
          linkId: "hidden-group",
          text: "Hidden group",
          item: [
            {
              linkId: "disabled-child",
              text: "Disabled child",
              answer: [{ valueString: "stale-disabled" }],
            },
          ],
        },
      ],
    };
    const html = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      mode: "capture",
    });
    const formData = formDataFromHtml(html, [["gate", "false"]]);
    const response = await responseFromFormData(formData, {
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });

    expect(html).not.toContain('data-fb-link-id="disabled-child"');
    expect(response.item).toEqual([
      { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
    ]);
  });

  it("keeps protected disabled values available across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/protected-disabled-state",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
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
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/protected-disabled-state",
      item: [
        { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
        {
          linkId: "protected",
          text: "Protected",
          answer: [{ valueString: "server-protected" }],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      mode: "capture",
    });
    const firstPost = formDataFromHtml(initialHtml, [
      ["gate", "false"],
      ["protected", "server-protected"],
    ]);
    const secondHtml = await processAndRender(firstPost, {
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });

    expect(secondHtml).toContain('data-fb-question="protected"');
    expect(secondHtml).toContain('value="server-protected"');
  });

  it("keeps protected disabled repeated option values across stateless posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/protected-disabled-repeated-options",
      item: [
        { linkId: "gate", text: "Gate", type: "boolean" },
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "string",
          repeats: true,
          disabledDisplay: "protected",
          extension: [itemControlExtension("check-box")],
          enableWhen: [
            {
              question: "gate",
              operator: "=",
              answerBoolean: true,
            },
          ],
          answerOption: [{ valueString: "Fever" }, { valueString: "Cough" }],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/protected-disabled-repeated-options",
      item: [
        { linkId: "gate", text: "Gate", answer: [{ valueBoolean: false }] },
        {
          linkId: "symptoms",
          text: "Symptoms",
          answer: [{ valueString: "Fever" }, { valueString: "Cough" }],
        },
      ],
    };
    const initialHtml = await renderQuestionnaire({
      questionnaire,
      questionnaireResponse,
      mode: "capture",
    });
    const disabledHtml = await processAndRender(hiddenFormData(initialHtml), {
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });
    const enableData = hiddenFormData(disabledHtml);
    enableData.set(attributeFrom(disabledHtml, "gate", "name"), "true");
    const response = await responseFromFormData(enableData, {
      questionnaire,
      fhirVersion: "r5",
      mode: "capture",
    });

    expect(
      response.item?.find((item) => item.linkId === "symptoms")?.answer,
    ).toEqual([{ valueString: "Fever" }, { valueString: "Cough" }]);
  });

  it("renders validation errors after submit", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/required",
      item: [
        {
          linkId: "required-name",
          text: "Required name",
          type: "string",
          required: true,
        },
      ],
    };
    const formData = new FormData();
    formData.set("fb[action]", "submit");
    const html = await processAndRender(formData, {
      questionnaire,
      fhirVersion: "r5",
    });

    expect(html).toContain("Required name");
    expect(html).toContain("At least one");
  });
});
