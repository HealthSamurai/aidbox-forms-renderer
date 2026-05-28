# @formbox/htmx

Server-rendered HTML renderer for Formbox FHIR Questionnaires.

This package renders FHIR Questionnaire controls as plain HTML that can be
posted with normal browser form submission or HTMX. Consumers do not import
React, hydrate React, or manage MobX.

The main API is built around a short-lived renderer instance:

```ts
import { QuestionnaireRenderer, loadDefaultTemplates } from "@formbox/htmx";

const route = "/questionnaire";
const templates = await loadDefaultTemplates();
const renderer = new QuestionnaireRenderer({
  token: "encounter-questionnaire",
  templates,
  questionnaire,
  fhirVersion: "r5",
  questionnaireResponse: draftResponse,
  action: route,
});

try {
  const result =
    request.method === "POST"
      ? await renderer.process(await request.formData())
      : { submitted: false as const };

  const html = await renderer.render();
  const response = renderer.getQuestionnaireResponse();

  if (result.submitted && result.valid) {
    await saveResponse(response);
  }
} finally {
  renderer.dispose();
}
```

`renderer.render()` returns a complete questionnaire form by default. It is
async because renderer-owned ValueSet expansions can require terminology
requests before the final HTML is usable. Your
application owns the route, layout, authentication, CSRF handling, draft
persistence, and response storage. Pass the route as `action` so the renderer
can generate the form attributes.

Generated controls use normal bracket-style field names such as
`fb[answer][patient-name][value]`, plus `fb[count][...]`, `fb[action]`, and
`fb[page]` for repeat and pagination state. The core renderer passes raw
questionnaire paths into the theme layer; `@formbox/htmx` owns this submitted
field encoding and parses the submitted payload in `renderer.process()`.

## Basic Integration

```ts
import { QuestionnaireRenderer, loadDefaultTemplates } from "@formbox/htmx";

const templates = await loadDefaultTemplates();

async function renderQuestionnaire(request: Request): Promise<Response> {
  const route = "/questionnaire";
  const draftResponse = await loadDraftResponse();
  const renderer = new QuestionnaireRenderer({
    token: "encounter-questionnaire",
    templates,
    questionnaire,
    fhirVersion: "r5",
    questionnaireResponse: draftResponse,
    action: route,
  });

  try {
    const result =
      request.method === "POST"
        ? await renderer.process(await request.formData())
        : { submitted: false as const };

    const form = await renderer.render();

    if (result.submitted && result.valid) {
      await saveResponse(renderer.getQuestionnaireResponse());
    }

    return html(layout(form));
  } finally {
    renderer.dispose();
  }
}
```

## HTMX Integration

The renderer does not own your page shell. If a POST should update more than
the form itself, such as a status label or a rendered `QuestionnaireResponse`
preview beside the form, target an application-owned wrapper and return that
same wrapper for HTMX requests:

```ts
import {
  compileTemplates,
  loadDefaultTemplates,
  loadTemplates,
} from "@formbox/htmx";

const templates = {
  ...(await loadDefaultTemplates()),
  ...(await loadTemplates("./questionnaire-templates")),
  ...compileTemplates({
    Form: `
      <form{{{attrs attributes}}} hx-target="#questionnaire-app">
        {{{fields}}}
      </form>
    `,
  }),
};

async function handler(request: Request): Promise<Response> {
  const rendered = await renderQuestionnaire(request);
  const body =
    request.headers.get("hx-request") === "true"
      ? questionnaireApp(rendered)
      : layout(questionnaireApp(rendered));

  return html(body);
}

function questionnaireApp(rendered: {
  form: string;
  response: unknown;
}): string {
  return `
    <div id="questionnaire-app">
      ${rendered.form}
      <pre>${JSON.stringify(rendered.response, null, 2)}</pre>
    </div>
  `;
}
```

Use the default form swap when the form is the only dynamic region. Use an
application wrapper when the result of `renderer.process(formData)` affects
nearby UI outside the form.

## Lifecycle

Create one renderer instance for one request/render cycle:

1. `new QuestionnaireRenderer(options)` creates a request-local renderer.
2. `await renderer.process(formData)` applies submitted form state and returns submit result.
3. `await renderer.render()` returns HTML fields for the current renderer state.
4. `renderer.getQuestionnaireResponse()` reads the current FHIR response.
5. `renderer.dispose()` releases the underlying renderer store.

Do not keep a renderer instance in a session or reuse it between requests. Persist
the `QuestionnaireResponse` instead, then pass it to the next constructor call
as `questionnaireResponse`.

## API

### `new QuestionnaireRenderer(options)`

Creates a request-local renderer instance.

```ts
const renderer = new QuestionnaireRenderer({
  token: "encounter-questionnaire",
  questionnaire,
  fhirVersion: "r5",
  action,
  questionnaireResponse,
  language,
  strings,
  terminologyServerUrl,
  launchContext,
  mode,
  customExtensions,
  templates,
});
```

`questionnaireResponse` is optional initial state.
`token` is required and must be unique for each rendered form on the same page.
`templates` is required; call `await loadDefaultTemplates()` for the package
defaults, or merge those templates with application overrides.

### `renderer.process(formData)`

Applies a submitted form payload to the renderer.

It handles:

- scalar values and complex FHIR answer values
- repeated question and group add/remove actions
- pagination actions
- enableWhen and expression recomputation through the renderer store
- validation when the submitted action is `submit`

The generated fields include hidden state needed to preserve off-page and
hidden answers across full-form posts.

It returns a promise:

```ts
type ProcessResult = { submitted: false } | { submitted: true; valid: boolean };
```

`submitted` is true only for the final submit action. `valid` is present only
when submit validation ran.

### `renderer.render()`

Returns a promise for rendered questionnaire HTML. The default Form template
includes a surrounding `<form>`, hidden state, rendered controls,
repeat/pagination action buttons, validation messages, and the default submit
button.

With the default Form template, pass `action` so the renderer can generate the
required form attributes:

```ts
const renderer = new QuestionnaireRenderer({
  token: "encounter-questionnaire",
  templates,
  questionnaire,
  fhirVersion: "r5",
  action: route,
});

const html = await renderer.render();
```

Use a custom `Form` template when the application needs to add shell markup or
adjust attributes:

```ts
import { compileTemplates, loadDefaultTemplates } from "@formbox/htmx";

const templates = {
  ...(await loadDefaultTemplates()),
  ...compileTemplates({
    Form: `
      <form{{{attrs attributes}}}>
        ${csrf}
        {{{fields}}}
      </form>
    `,
  }),
};

const renderer = new QuestionnaireRenderer({
  token: "encounter-questionnaire",
  questionnaire,
  fhirVersion: "r5",
  action: route,
  templates,
});

const html = await renderer.render();
```

### Templates

The renderer consumes callback templates:

```ts
type Template<T> = (properties: T) => string;
```

For simple markup customization, use Handlebars strings and compile them into
the same callback interface:

```ts
import { compileTemplates } from "@formbox/htmx";

const templates = compileTemplates({
  TextInput: `
    <input
      {{{fieldAttributes}}}
      {{{attr "id" id}}}
      {{{attr "type" type}}}
      {{{attr "value" value}}}
      {{#if disabled}}readonly{{/if}}
    >
  `,
});
```

Callbacks and Handlebars strings can be mixed:

```ts
const templates = compileTemplates({
  TextInput: `<input{{{fieldAttributes}}}{{{attr "id" id}}}>`,
  Form({ attributes, fields }) {
    return `<form${htmlAttributes(attributes)}>${fields}</form>`;
  },
});
```

Load the default templates explicitly:

```ts
import { loadDefaultTemplates } from "@formbox/htmx";

const templates = await loadDefaultTemplates();
```

If you prefer overrides as files, load a directory of `*.html.hbs` files and
merge the result with the default templates:

```ts
import { loadDefaultTemplates, loadTemplates } from "@formbox/htmx";

const templates = {
  ...(await loadDefaultTemplates()),
  ...(await loadTemplates("./questionnaire-templates")),
};
```

File names map to template names:

```txt
questionnaire-templates/
  Form.html.hbs
  TextInput.html.hbs
  SelectInput.html.hbs
```

Unknown template file names throw, so misspellings fail early.

Available Handlebars helpers:

- `{{{attr "name" value}}}` renders one escaped HTML attribute, including the leading space.
- `{{{attrs attributes}}}` renders an object of escaped HTML attributes.
- `{{{fieldAttributes}}}` renders `data-fb-link-id`, `data-fb-field`, `name`, and `hx-include` for the current field.

Use triple braces for renderer-provided HTML slots such as `fields`, `children`,
`label`, `errors`, and `customOptionForm`.

Default templates and user templates use the same data shape. The package does
not keep a separate JSX fallback path.

### `renderer.getQuestionnaireResponse()`

Returns the current FHIR `QuestionnaireResponse`.

Disabled-by-enableWhen items are omitted from the response. Hidden-but-enabled
values and protected read-only values are preserved through generated hidden
fields where needed.

### `renderer.dispose()`

Disposes the underlying renderer store. Call this in a `finally` block.

## Bun Demo

Run the package demo with Bun:

```sh
cd packages/htmx
bun run demo
```

The demo server uses `Bun.serve`, returns an application-owned layout through
the shared render helper, loads the morphdom HTMX extension from a CDN, and
posts full form payloads back through `await renderer.process(formData)`.

## Notes

- The server remains stateless. Recreate form state from a submitted
  `QuestionnaireResponse` plus `FormData`.
- HTMX is only a browser transport. The server APIs use standard `Request`,
  `FormData`, HTML strings, and FHIR resources.
- The package uses `@formbox/renderer` internally for store behavior,
  expressions, enableWhen, visibility, validation, and response generation.
