### Core concepts

- rendered (realized) questionnaire response is form managed by `FormStore`, which keeps a registry of top-level nodes
- rendered questionnaire response item is node (one of the node stores implementing `INodeStore`)
- questionnaire item is template for node (`QuestionnaireItem` backing each store)
- nodes can have child nodes (`children` or `instances` on the store)
- node can be either a display, a group, or a question (`DisplayStore`, `GroupStore`/`RepeatingGroupWrapper`, `QuestionStore`)
- display node cannot have child nodes
- question node is answerable node
- display node and group node are not answerable nodes
- group node can be repeated
- question node can be repeated when `repeats` is true
- display node is rendered as text block
- non-repeated group node is rendered as a block with header and list of child nodes
- repeated group node (`RepeatingGroupWrapper`) is rendered as list of instances exposed through its `nodes` collection plus an add button
- each repeating group instance (`GroupStore`) renders a block with header, remove button, and its child nodes while extending the scope registry for nested `linkId`s
- repeated question node is rendered as a block with label, list of answers with remove button, and add button
- non-repeating question node keeps exactly one `AnswerInstance`, hides add/remove controls, and still renders a label with a single input control
- answers are rendered as blocks with input control and optional child nodes, represented by `AnswerInstance`, which keeps a scoped registry for nested items
- input control type depends on question node's template type
- string/text question node is rendered as text input control
- integer question node is rendered as number input control
- decimal question node is rendered as decimal input control
- boolean question node is rendered as checkbox input control
- date question node is rendered as date picker input control
- dateTime question node is rendered as date-time picker input control
- time question node is rendered as time picker input control
- quantity question node is rendered as composite input control for value and unit
- coding question node is rendered as dropdown/select input control
- reference question node is rendered as autocomplete input control
- url question node is rendered as URL input control
- attachment question node is rendered as file upload input control
- repeatable question nodes may render single control for multiple answers
- `AbstractActualNodeStore` forwards registration and lookup through parent scopes so nested nodes can access ancestors
- question answers seed from questionnaire response items so repeated answers load existing values
- repeating group instances seed from matching response items
- repeating groups enforce min/max occurs limits on their instances
- question nodes enforce min/max occurs limits on their answers
- readonly and hidden both consider the items enablement under the hood so isEnabled must not be used in ui components

### Rendering

- Children rule: when a question has child items, render per-answer via `AnswerList` so each answer row can host nested items; single-control multi-select variants are only allowed when there are no child items.
- Radio-button and check-box controls (apply to any item type; rendering of option value depends on the item type):
  - If `repeats` is false and there are no children, even if the control is set to check-box, render a radio group.
  - If `repeats` is true and there are no children, even if the control is set to radio-button, render a single checkbox list that manages all answers at once.
  - If the item has children, render `AnswerList` with one radio-button list row per answer so child nodes can render; for repeatable items in this branch still use `AnswerList`.
  - In radio-button, when `optionsOrString` is set, append a “Specify other” option; when selected render a text input within the radio list; if “Specify other” is unselected, discard the custom value.
  - In radio-button, when `optionsOrType` is set, append a “Specify other” option; when selected render a control of the specified type within the radio list; if “Specify other” is unselected, discard the custom value.
  - In check-box, when `optionsOrString` or `optionsOrType` is set, append a “Specify others” option; when selected render the tokenized dropdown/autocomplete control in multi-select mode with no options (free-text chips for `optionsOrString`, type-specific chips for `optionsOrType`), honoring min/max and per-chip validation.
  - For boolean items with no explicit options, default options to Yes/No/Unanswered.
  - Enforce `minOccurs`/`maxOccurs` by disabling new selections or remove handles as needed and surface per-answer validation issues visibly on the checkbox list.
- Drop-down, autocomplete, and lookup controls (apply to any item type; differ only in presentation):
  - When an item provides options, default to a drop-down control unless a different control is explicitly chosen.
  - Autocomplete and drop-down share behavior; lookup behaves the same but is shown in a modal dialog with suggestions dropdown always visible.
  - Single-select when `repeats` is false; include an inline clear button when a value is selected.
  - When `repeats` is true and there are no children, render a single multi-select experience (chips/inline tags) that manages all answers at once; include remove handles per chip and a clear-all affordance.
  - When `repeats` is true and the item has children, render `AnswerList` with one select/autocomplete/lookup per answer so child nodes can render under each answer.
  - For `optionsOrString` in single-select, include a “Specify other” option that, when chosen, swaps to a text input with a control to return to the option list; for multi-select, selecting “Specify other” adds a text-input chip.
  - For `optionsOrType` in single-select, include a “Specify other” option that swaps to a control of the specified type with a control to return to the option list; for multi-select, selecting “Specify other” opens a dialog to capture the specified type (e.g., Quantity/Reference) and adds it as a chip (chips cannot host complex controls inline).
  - Enforce `minOccurs`/`maxOccurs` by disabling new selections or remove handles as needed and surface per-answer validation issues (e.g., invalid chip) visibly on the multi-select dropdown/tokenized autocomplete/lookup controls.
- Text-box, slider, spinner: do not support managing multiple answers in a single control—non-repeating renders one control; repeating uses per-answer `AnswerList`.

### Question Components Anatomy

- Renderer registry picks a renderer based on question store properties (`type`, `repeats`, `hasChildren`, options hints, extensions, enablement flags).
- Renderer is a React component that receives a `QuestionStore`, chooses a rendering strategy, and wraps its children with `QuestionScaffold`; the concrete children it supplies are what differentiate one renderer from another.
- QuestionScaffold
  - Header: label text, required flag, tooltips (help, legal, flyover).
  - Children: provided by the renderer.
  - Footer: question-level validation errors (not per-answer).
- Children strategies
  - AnswerList path: used when the item has children or when the control cannot manage multiple answers at once. `AnswerList` handles add/remove, min/max occurs, renders one control per `AnswerInstance` (control is supplied by the renderer/registry, not chosen by `AnswerList`), and places nested child nodes under each answer row.
  - Single multi-answer control: used when there are no children and the control can manage all answers itself (e.g., checkbox list, multi-select chips, tokenized autocomplete/lookup); it enforces min/max occurs internally and renders answer-level errors inline.
- Control components
  - Questionnaire-aware; manage answers array, min/max, and render answer-level validation errors.
  - May delegate value editing to InputComponents when a simple value editor is sufficient.
  - Not responsible for rendering nested child nodes.
- List-select controls: `ListSelectControl`, `DropdownSelectControl`, `ModalSelectControl`
  - has `repeats: boolean` property to distinguish single-answer vs. multi-answer variants
  - `ListSelectControl` renders either single-select radio-button list, or multi-select checkbox list
  - Checkbox variant of `ListSelectControl` may embed `DropdownSelectControl` in tokenized multi-select mode (no preset options) to implement the “Specify others” flow for `optionsOrString`/`optionsOrType`, honoring min/max and per-chip validation.
  - `DropdownSelectControl` renders single-select or multi-select dropdown/autocomplete
  - `ModalSelectControl` same as `DropdownSelectControl` but opens a modal dialog instead of inline dropdown
  - For `type=reference`, perform lookup/autocomplete based on reference resource hints (e.g., `questionnaire-referenceResource`) and may use `sdc-questionnaire-lookupQuestionnaire` to create/select a target.
- Freeform controls
  - Examples: text, textarea, integer, decimal, date, dateTime, time, URL, reference, quantity, attachment.
  - Manage one answer at a time; when `repeats=true`, they are rendered per-answer via `AnswerList`.
  - Have no option lists and no “Specify other”; they delegate directly to InputComponents.
- InputComponents: `StringInput`, `TextInput`, `IntegerInput`, `DecimalInput`, `DateInput`, `DateTimeInput`, `TimeInput`, `UrlInput`, `ReferenceInput`, `QuantityInput`, `CodingInput`, `AttachmentInput`
  - Questionnaire-agnostic; operate on FHIR primitive/value types (`date`, `dateTime`, `time`, `quantity`, `reference`, `string`, `text`, `url`, `coding`, `attachment`, `decimal`, `integer`).
  - Receive at least `value` and `onChange`; some are simple (single element) and some are composite (e.g., quantity, coding).
  - `CodingInput` is a composite editor for freeform `system` / `code` / `display` (used when no options/terminology binding are provided, or inside “Specify other” flows that capture a Coding).
  - `QuantityInput` is a composite editor for `value` plus unit metadata:
    - When a units list is provided, render `value` + unit picker (picker supplies system/code/display).
    - When no units list is provided, render `value` + freeform `unit`/`system`/`code`.
  - `ReferenceInput` is the freeform editor for `reference` (resourceType/id or absolute URL) with optional `display`.
- Value renderers: `StringValue`, `TextValue`, `IntegerValue`, `DecimalValue`, `BooleanValue`, `DateValue`, `DateTimeValue`, `TimeValue`, `UrlValue`, `ReferenceValue`, `QuantityValue`, `CodingValue`, `AttachmentValue`
  - Reusable formatter for option/value display (label and any code/system/unit details).
  - Used in radio/checkbox option rows.
  - Used in dropdown/autocomplete/lookup suggestion rows (lookup modal results share the same suggestion rendering).
  - Used to show the current single-select value when the control is collapsed.
  - Used in chips for multi-select (including “Specify other/others” custom entries).
  - Used in multi-select summary or clear-all bars to preview selected labels (e.g., “3 selected: ...”).

### Suggested component file layout (relative to `lib/components/nodes/question/`, one component per file)

```
lib/components/nodes/question/
├─ question-scaffold.tsx         # can reuse form/node-header, node-help, node-legal, node-flyover
├─ renderers/                    # registry lives in `lib/stores/registries/question-control-registry.ts`
│  ├─ string-renderer.tsx
│  ├─ number-renderer.tsx
│  ├─ decimal-renderer.tsx
│  ├─ date-renderer.tsx
│  ├─ datetime-renderer.tsx
│  ├─ time-renderer.tsx
│  ├─ quantity-renderer.tsx
│  ├─ reference-renderer.tsx
│  ├─ coding-renderer.tsx
│  ├─ attachment-renderer.tsx
│  ├─ list-select-renderer.tsx   # radio/checkbox rendering
│  ├─ dropdown-renderer.tsx      # select/autocomplete rendering
│  └─ lookup-renderer.tsx        # modal lookup rendering
├─ answers/
│  ├─ answer-list.tsx
│  └─ answer-row.tsx
├─ controls/
│  ├─ list-select-control.tsx     # toggles radio vs checkbox based on props
│  ├─ dropdown-select-control.tsx # inline dropdown/autocomplete (single & multi)
│  └─ modal-select-control.tsx    # modal-based dropdown
├─ inputs/                        # adapters from stores to base controls
│  ├─ string-input.tsx
│  ├─ text-input.tsx
│  ├─ integer-input.tsx
│  ├─ decimal-input.tsx
│  ├─ date-input.tsx
│  ├─ datetime-input.tsx
│  ├─ time-input.tsx
│  ├─ url-input.tsx
│  ├─ reference-input.tsx
│  ├─ quantity-input.tsx
│  ├─ coding-input.tsx
│  └─ attachment-input.tsx
├─ values/
│  ├─ string-value.tsx
│  ├─ text-value.tsx
│  ├─ integer-value.tsx
│  ├─ decimal-value.tsx
│  ├─ boolean-value.tsx
│  ├─ date-value.tsx
│  ├─ datetime-value.tsx
│  ├─ time-value.tsx
│  ├─ url-value.tsx
│  ├─ reference-value.tsx
│  ├─ quantity-value.tsx
│  ├─ coding-value.tsx
│  └─ attachment-value.tsx
├─ validation/
│  ├─ question-errors.tsx
│  └─ answer-errors.tsx
└─ misc/
   ├─ required-flag.tsx
   └─ specify-other-chip.tsx
```

Component composition examples:

Non-repeating text, no children

```
QuestionRenderer
└─ QuestionScaffold
   ├─ Header
   ├─ Children: Control(TextControl single-answer)
   │   └─ InputComponent(TextInput)
   └─ Footer
```

Repeating choice with children (radio layout)

```
QuestionRenderer
└─ QuestionScaffold
   ├─ Header
   ├─ Children: AnswerList
   │   ├─ AnswerRow 1
   │   │   └─ Control(RadioListRow)
   │   │       └─ Option group (+ Specify other input)
   │   ├─ AnswerRow 2
   │   └─ Add/remove handles
   └─ Footer
```

Repeating choice without children using multi-answer control

```
QuestionRenderer
└─ QuestionScaffold
   ├─ Header
   ├─ Children: Control(CheckboxList multi-answer)
   │   ├─ Checkbox options (+ Specify others chip editor)
   │   └─ Answer-level errors
   └─ Footer
```

### Node hierarchy

```
IPresentableNode
├── IActualNode
│   ├── DisplayStore implements IActualNode
│   ├── GroupStore implements IActualNode
│   └── QuestionStore implements IActualNode
└── IRepeatingGroupWrapper extends IPresentableNode
    └── RepeatingGroupWrapper implements IRepeatingGroupWrapper

AbstractPresentableNode (base class for every IPresentableNode implementation)
└── AbstractActualNodeStore extends AbstractPresentableNode (base for all IActualNode implementations)
    ├── DisplayStore
    ├── GroupStore
    └── QuestionStore
```

### Coding guidelines

- do not call `makeObservable` with explicit annotations or `makeAutoObservable` in stores
- rely on MobX decorators instead and call `makeObservable(this)` in constructor
- prefer undefined over null to encode absence of value
- when writing tests use describe/it functions extensively to group related checks and assertions with meaningful text
- prefer small isolated tests with dedicated test data
- prefer having functions over class methods if `this` is not used
- exactOptionalPropertyTypes is enabled so when defining types prefer union with undefined over optional properties
