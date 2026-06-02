import {
  QuestionnaireRenderer,
  htmlAttributes,
  loadDefaultTemplates,
} from "../dist/index.js";

import type { DemoExample } from "./examples.ts";

const defaultTemplates = await loadDefaultTemplates();

export async function renderIndex(
  examples: readonly DemoExample[],
): Promise<string> {
  const links = examples
    .map(
      (example) => `<li>
        <a href="/examples/${example.id}">${escapeHtml(titleOf(example))}</a>
        <p>${escapeHtml(descriptionOf(example))}</p>
      </li>`,
    )
    .join("");

  return renderPage({
    title: "Formbox HTMX demos",
    description:
      "Server-rendered Questionnaire examples backed by JSON fixtures.",
    header: true,
    content: `<nav class="example-list"><ul>${links}</ul></nav>`,
  });
}

export async function renderExamplePage(
  example: DemoExample,
  request: Request,
): Promise<string> {
  return renderPage({
    title: titleOf(example),
    description: descriptionOf(example),
    header: false,
    content: [
      `<p class="back-link"><a href="/">Back to examples</a></p>`,
      await renderExampleForm(example, request),
    ].join(""),
  });
}

export async function renderExampleForm(
  example: DemoExample,
  request: Request,
): Promise<string> {
  const route = `/examples/${example.id}`;
  const renderer = new QuestionnaireRenderer({
    token: `example-${example.id}`,
    questionnaire: example.questionnaire,
    fhirVersion: "r5",
    action: route,
    templates: {
      ...defaultTemplates,
      Form({ attributes, fields }) {
        return `<form${htmlAttributes({ ...attributes, "hx-swap": "morphdom" })}>${fields}</form>`;
      },
    },
  });

  try {
    let valid: boolean | undefined;
    if (request.method === "POST") {
      const result = await renderer.process(await request.formData());
      if (result.submitted) {
        valid = result.valid;
      }
    }

    return renderWorkspace(
      await renderer.render(),
      renderInspector(
        example.questionnaire,
        renderer.getQuestionnaireResponse(),
        valid,
      ),
    );
  } finally {
    renderer.dispose();
  }
}

function renderWorkspace(form: string, inspector: string): string {
  return [
    `<div class="demo-workspace" hx-target="closest .demo-workspace">`,
    `<section class="form-pane" aria-label="Rendered form">`,
    form,
    "</section>",
    inspector,
    "</div>",
  ].join("");
}

function renderInspector(
  questionnaire: unknown,
  response: unknown,
  valid: boolean | undefined,
): string {
  const showResponse = valid !== undefined;
  const state =
    valid === undefined
      ? ""
      : `<span class="inspector-state" data-valid="${String(valid)}">${valid ? "Valid" : "Invalid"}</span>`;

  return [
    `<aside class="inspector-pane" aria-label="Questionnaire data">`,
    `<input class="inspector-tab-input" id="inspector-questionnaire" type="radio" name="inspector-tab"${showResponse ? "" : " checked"}>`,
    `<input class="inspector-tab-input" id="inspector-response" type="radio" name="inspector-tab"${showResponse ? " checked" : ""}>`,
    `<div class="inspector-tabs" role="tablist" aria-label="Inspector tabs">`,
    `<label for="inspector-questionnaire">Questionnaire</label>`,
    `<label for="inspector-response">Response</label>`,
    state,
    `</div>`,
    renderJsonPanel("questionnaire", questionnaire),
    renderJsonPanel("response", response),
    `</aside>`,
  ].join("");
}

function renderJsonPanel(id: string, value: unknown): string {
  return `<section class="inspector-panel inspector-panel-${id}" aria-label="${id} JSON"><pre>${escapeHtml(JSON.stringify(value, undefined, 2))}</pre></section>`;
}

function renderPage({
  title,
  description,
  header,
  content,
}: {
  readonly title: string;
  readonly description: string;
  readonly header: boolean;
  readonly content: string;
}): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <script src="/htmx.min.js"></script>
    <script src="https://unpkg.com/morphdom@2.7.8/dist/morphdom-umd.min.js"></script>
    <script src="https://unpkg.com/htmx-ext-morphdom-swap@2.0.0/morphdom-swap.js"></script>
    <style>
      :root {
        color-scheme: light;
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
        background: #f4f7f8;
        color: #172026;
      }

      body { margin: 0; }

      main {
        width: min(1440px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 40px 0 56px;
      }

      header { margin-bottom: 24px; }

      h1 {
        margin: 0 0 8px;
        font-size: 32px;
        line-height: 1.15;
      }

      p {
        margin: 0;
        color: #4f5f66;
      }

      a { color: #176d77; }

      .back-link { margin-bottom: 16px; }

      .demo-workspace {
        align-items: start;
        display: grid;
        gap: 18px;
        grid-template-columns: minmax(0, 1fr) minmax(360px, 0.92fr);
      }

      .example-list ul {
        display: grid;
        gap: 12px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .example-list li,
      .form-pane,
      .inspector-pane {
        background: #ffffff;
        border: 1px solid #d8e0e3;
        border-radius: 8px;
        box-shadow: 0 18px 48px rgb(23 32 38 / 10%);
        padding: 24px;
      }

      .example-list a {
        display: inline-block;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 6px;
      }

      form {
        display: grid;
        gap: 18px;
      }

      fieldset,
      section,
      [data-fb-question] {
        display: grid;
        gap: 10px;
        min-width: 0;
      }

      fieldset {
        border: 1px solid #d8e0e3;
        border-radius: 8px;
        padding: 16px;
      }

      legend,
      label,
      h2 {
        color: #172026;
        font-weight: 700;
      }

      legend { padding: 0 6px; }

      h2 {
        margin: 0;
        font-size: 20px;
      }

      input,
      select,
      textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #bac8ce;
        border-radius: 6px;
        padding: 10px 12px;
        font: inherit;
      }

      input[type="checkbox"],
      input[type="radio"] {
        width: auto;
      }

      button {
        justify-self: start;
        border: 0;
        border-radius: 6px;
        background: #176d77;
        color: #ffffff;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 10px 14px;
      }

      button:hover { background: #0f5962; }

      [data-fb-field="remove-action"] { background: #7a3440; }

      .fb-errors {
        margin: 0;
        padding-left: 20px;
        color: #9a2f3d;
      }

      .inspector-pane {
        display: grid;
        gap: 12px;
        max-height: calc(100vh - 96px);
        position: sticky;
        top: 24px;
      }

      .inspector-tab-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .inspector-tabs {
        align-items: center;
        border-bottom: 1px solid #d8e0e3;
        display: flex;
        gap: 6px;
        padding-bottom: 12px;
      }

      .inspector-tabs label {
        border-radius: 6px;
        color: #4f5f66;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        padding: 7px 10px;
      }

      #inspector-questionnaire:checked ~ .inspector-tabs label[for="inspector-questionnaire"],
      #inspector-response:checked ~ .inspector-tabs label[for="inspector-response"] {
        background: #dceff1;
        color: #123f45;
      }

      .inspector-state {
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        margin-left: auto;
        padding: 4px 8px;
      }

      .inspector-state[data-valid="true"] {
        background: #dff3e8;
        color: #256144;
      }

      .inspector-state[data-valid="false"] {
        background: #f8e1e5;
        color: #8a2635;
      }

      .inspector-panel {
        display: none;
        min-height: 0;
      }

      #inspector-questionnaire:checked ~ .inspector-panel-questionnaire,
      #inspector-response:checked ~ .inspector-panel-response {
        display: block;
      }

      .inspector-panel pre {
        background: #172026;
        border-radius: 6px;
        color: #e8f0f2;
        margin: 0;
        overflow: auto;
        padding: 16px;
        max-height: calc(100vh - 190px);
        white-space: pre;
      }

      @media (max-width: 980px) {
        .demo-workspace {
          grid-template-columns: 1fr;
        }

        .inspector-pane {
          max-height: none;
          position: static;
        }

        .inspector-panel pre {
          max-height: 520px;
        }
      }
    </style>
  </head>
  <body hx-ext="morphdom-swap">
    <main>
      ${
        header
          ? `<header>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </header>`
          : ""
      }
      ${content}
    </main>
  </body>
</html>`;
}

function titleOf(example: DemoExample): string {
  return String(example.questionnaire["title"] ?? example.id);
}

function descriptionOf(example: DemoExample): string {
  return String(example.questionnaire["description"] ?? "");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
