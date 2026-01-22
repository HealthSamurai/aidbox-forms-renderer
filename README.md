# Formbox Renderer

Minimal React renderer for HL7® FHIR® Questionnaires.

Renderer does not ship with a default theme. Pass a Theme object from an
official theme package or implement the `@formbox/theme` contract. Install
`@formbox/theme` as a dev dependency only if you need the TypeScript types
for a custom theme.

```tsx
import {
  Renderer,
  type Questionnaire,
  type QuestionnaireResponse,
} from "@formbox/renderer";
import { theme } from "@formbox/hs-theme";
import "@formbox/hs-theme/style.css";
import { useState } from "react";

const questionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  item: [
    { linkId: "first", text: "First name", type: "string", required: true },
    { linkId: "consent", text: "Consent to treatment", type: "boolean" },
  ],
};

export function IntakeForm() {
  const [response, setResponse] = useState<QuestionnaireResponse | null>(null);

  return (
    <Renderer
      questionnaire={questionnaire}
      initialResponse={response ?? undefined}
      onChange={setResponse}
      onSubmit={setResponse}
      theme={theme}
    />
  );
}
```

To swap to the NHS look and feel, import from `@formbox/nshuk-theme`:

```tsx
import { theme } from "@formbox/nshuk-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```

Mantine-based themes require wrapping the renderer with a provider. `@formbox/mantine-theme` re-exports Mantine’s provider as `Provider`:

```tsx
import { Provider, theme } from "@formbox/mantine-theme";

<Provider>
  <Renderer questionnaire={questionnaire} theme={theme} />
</Provider>;
```

Bring your own theme is supported; see the theme contract and component
reference in [packages/theme/README.md](packages/theme/README.md).

## Compatibility

The workspace TypeScript target is **ES2023**, so published/consumed output assumes a modern JS runtime.
In particular, the codebase uses ES2023 built-ins like `Array.prototype.toSorted`.
Use a modern evergreen browser and Node runtime, or provide a transpile/polyfill step if you need to support older environments.

Useful scripts: `npm run dev` (playground), `npm run build` (type-check + bundle), `npm test`, `npm run lint`.
Packages live under `packages/` and the workspace uses pnpm:

- Install deps: `pnpm install`
- Dev: `pnpm --filter @formbox/renderer dev`
- Build: `pnpm --filter @formbox/renderer build`
- Lint: `pnpm --filter @formbox/renderer lint`
- Typecheck: `pnpm --filter @formbox/renderer typecheck`

See [COVERAGE.md](COVERAGE.md) for the detailed SDC feature checklist.
