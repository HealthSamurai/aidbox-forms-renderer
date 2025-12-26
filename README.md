# Aidbox Forms Renderer

Minimal React renderer for HL7® FHIR® Questionnaires

```tsx
import {
  Renderer,
  type Questionnaire,
  type QuestionnaireResponse,
} from "@aidbox-forms/renderer";
import { theme, HSThemeVariables } from "@aidbox-forms/hs-theme";
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

To swap to the NHS look and feel, import from `@aidbox-forms/nshuk-theme`:

```tsx
import { theme } from "@aidbox-forms/nshuk-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```

Bring your own theme is supported; see the theme contract and component reference in [packages/theme/README.md](packages/theme/README.md).

Useful scripts: `npm run dev` (playground), `npm run build` (type-check + bundle), `npm test`, `npm run lint`.
Packages live under `packages/` and the workspace uses pnpm:

- Install deps: `pnpm install`
- Dev: `pnpm --filter @aidbox-forms/renderer dev`
- Build: `pnpm --filter @aidbox-forms/renderer build`
- Lint: `pnpm --filter @aidbox-forms/renderer lint`
- Typecheck: `pnpm --filter @aidbox-forms/renderer typecheck`

See [COVERAGE.md](COVERAGE.md) for the detailed SDC feature checklist.
