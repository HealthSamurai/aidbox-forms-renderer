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

| Renderer component       | Theme slots used                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Form                     | Button, Form, FormHeader, FormErrors, NodeList, FormSection, PageStatus, PageNavigation, EmptyState, FormActions |
| NodeHeader               | NodeHeader                                                                                                       |
| NodeErrors               | Errors                                                                                                           |
| NodeFlyover              | NodeFlyover                                                                                                      |
| NodeLegal                | NodeLegal                                                                                                        |
| NodeHelp                 | NodeHelp                                                                                                         |
| DisplayRenderer          | DisplayRenderer                                                                                                  |
| GroupScaffold            | GroupScaffold, NodeList                                                                                          |
| GroupWrapperScaffold     | GroupWrapperScaffold, Button                                                                                     |
| GroupWrapperScaffoldItem | GroupWrapperScaffoldItem, Button                                                                                 |
| TabContainerRenderer     | TabContainer                                                                                                     |
| GridRenderer             | GridTable, EmptyState                                                                                            |
| GridTableRenderer        | Button, GridTable, EmptyState                                                                                    |
| VerticalTableRenderer    | GroupActions, GridTable, EmptyState, RadioButtonList, CheckboxList                                               |
| HorizontalTableRenderer  | GroupActions, GridTable, EmptyState, RadioButtonList, CheckboxList                                               |
| TableQuestionDetails     | NodeList, OptionsState                                                                                           |
| QuestionScaffold         | QuestionScaffold, OptionsState                                                                                   |
| AnswerList               | Button, AnswerList                                                                                               |
| AnswerScaffold           | Button, AnswerScaffold                                                                                           |
| AnswerErrors             | Errors                                                                                                           |
| TextInput                | TextArea                                                                                                         |
| StringInput              | TextInput                                                                                                        |
| IntegerInput             | NumberInput                                                                                                      |
| DecimalInput             | NumberInput                                                                                                      |
| BooleanInput             | RadioButtonList                                                                                                  |
| QuantityInput            | InputGroup, NumberInput, SelectInput, TextInput                                                                  |
| DateInput                | DateInput                                                                                                        |
| DateTimeInput            | DateTimeInput                                                                                                    |
| TimeInput                | TimeInput                                                                                                        |
| UrlInput                 | TextInput                                                                                                        |
| UrlDisplay               | Link                                                                                                             |
| CodingInput              | InputGroup, TextInput                                                                                            |
| ReferenceInput           | InputGroup, TextInput                                                                                            |
| AttachmentInput          | FileInput                                                                                                        |
| DropdownSelectControl    | SelectInput, Button                                                                                              |
| ListSelectControl        | CheckboxList, AnswerList, Button, RadioButtonList                                                                |
| MultiSelectControl       | Button, MultiSelectInput                                                                                         |
| SliderControl            | SliderInput                                                                                                      |
| SpinnerControl           | SpinnerInput                                                                                                     |

Useful scripts: `npm run dev` (playground), `npm run build` (type-check + bundle), `npm test`, `npm run lint`.
Packages live under `packages/` and the workspace uses pnpm:

- Install deps: `pnpm install`
- Dev: `pnpm --filter @aidbox-forms/renderer dev`
- Build: `pnpm --filter @aidbox-forms/renderer build`
- Lint: `pnpm --filter @aidbox-forms/renderer lint`
- Typecheck: `pnpm --filter @aidbox-forms/renderer typecheck`

See [COVERAGE.md](COVERAGE.md) for the detailed SDC feature checklist.
