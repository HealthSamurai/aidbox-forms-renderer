# Aidbox Forms Renderer

Minimal React renderer for HL7® FHIR® Questionnaires. State is always a canonical `QuestionnaireResponse`, so the data you display is the data you can submit.

```tsx
import { Renderer, type Questionnaire, type QuestionnaireResponse } from "aidbox-forms-renderer";
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
    />
  );
}
```

Useful scripts: `npm run dev` (playground), `npm run build` (type-check + bundle), `npm test`, `npm run lint`.

Architecture and rationale live as doc comments in the source (`lib/state/`, `lib/form-provider.tsx`, `lib/questionnaire-renderer.tsx`).
