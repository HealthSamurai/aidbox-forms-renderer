# @aidbox-forms/theme

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Install](#install)
- [Quick start](#quick-start)
- [Theme contract](#theme-contract)
- [Conventions](#conventions)
- [Component reference](#component-reference)
  - [Link](#link)
  - [EmptyState](#emptystate)
  - [Errors](#errors)
- [OptionsLoading](#optionsloading)
  - [NodeHelp](#nodehelp)
  - [NodeLegal](#nodelegal)
  - [NodeFlyover](#nodeflyover)
  - [NodeHeader](#nodeheader)
  - [InputGroup](#inputgroup)
  - [TextInput](#textinput)
  - [TextArea](#textarea)
  - [NumberInput](#numberinput)
  - [DateInput](#dateinput)
  - [DateTimeInput](#datetimeinput)
  - [TimeInput](#timeinput)
  - [SliderInput](#sliderinput)
  - [SpinnerInput](#spinnerinput)
  - [SelectInput](#selectinput)
  - [RadioButtonList](#radiobuttonlist)
  - [CheckboxList](#checkboxlist)
  - [MultiSelectInput](#multiselectinput)
  - [CustomOptionForm](#customoptionform)
  - [FileInput](#fileinput)
  - [AnswerAddButton](#answeraddbutton)
  - [AnswerRemoveButton](#answerremovebutton)
  - [GroupAddButton](#groupaddbutton)
  - [GroupRemoveButton](#groupremovebutton)
  - [FormSubmitButton](#formsubmitbutton)
  - [FormResetButton](#formresetbutton)
  - [OpenChoiceBackButton](#openchoicebackbutton)
  - [AnswerList](#answerlist)
  - [AnswerScaffold](#answerscaffold)
  - [QuestionScaffold](#questionscaffold)
  - [GroupWrapperScaffold](#groupwrapperscaffold)
  - [GroupWrapperScaffoldItem](#groupwrapperscaffolditem)
  - [GroupScaffold](#groupscaffold)
  - [GroupActions](#groupactions)
  - [DisplayRenderer](#displayrenderer)
  - [NodeList](#nodelist)
  - [FormHeader](#formheader)
  - [FormErrors](#formerrors)
  - [FormSection](#formsection)
  - [FormActions](#formactions)
  - [Form](#form)
  - [PageStatus](#pagestatus)
  - [PageNavigation](#pagenavigation)
  - [GridTable](#gridtable)
  - [TabContainer](#tabcontainer)
- [Data types](#data-types)
  - [OptionItem](#optionitem)
  - [SelectedOptionItem](#selectedoptionitem)
  - [CustomOptionAction](#customoptionaction)
  - [Attachment](#attachment)
  - [GridTableColumn](#gridtablecolumn)
  - [GridTableRow](#gridtablerow)
  - [GridTableCell](#gridtablecell)
  - [TabItem](#tabitem)

## Install

```bash
pnpm add @aidbox-forms/theme
```

## Quick start

Create a theme by implementing the Theme contract. You can start from a base theme and override only what you need.

```tsx
import type { Theme } from "@aidbox-forms/theme";
import Renderer from "@aidbox-forms/renderer";
import { theme as baseTheme } from "@aidbox-forms/hs-theme";

const theme: Theme = {
  ...baseTheme,
  FormSubmitButton: MyFormSubmitButton,
};

<Renderer questionnaire={questionnaire} theme={theme} />;
```

## Theme contract

A Theme is a full object with React components for every slot listed in the component reference. The renderer never
touches DOM APIs directly, so the theme is responsible for markup, layout, and styling while keeping the data flow
purely through props.

You may create a complete theme from scratch or extend an existing one with object spread. The Theme type is strict, so
every component must be provided.

## Conventions

- Controlled props: text/number/date inputs use value and onChange. Single-selects pass selectedOption, multi-selects
  pass selectedOptions with onSelect/onDeselect, and checkbox lists use tokens for the selected set. onChange receives
  the next value, never a DOM event.
- Disabled states: the renderer uses disabled to indicate non editable inputs. Prefer disabled over readOnly in theme
  components.
- Accessibility: ariaLabelledBy and ariaDescribedBy are string ids. Wire them to the relevant elements.
- Ids: when id is provided, pass it through to the focusable control.
- children is the slot name for single content. Option data types use label for the display content.
- Option fallback: include disabled legacy options in the options list so stored answers stay visible.
- Props marked No in Required can be omitted. Treat undefined as not provided.

## Component reference

### Link

General-purpose link for references and related actions surfaced by the renderer. Render as an anchor or equivalent
control with standard link behavior.

| Prop       | Type        | Required | Description                                                                           |
| ---------- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| `href`     | `string`    | Yes      | Set as the anchor destination; the renderer passes a fully qualified or relative URL. |
| `children` | `ReactNode` | Yes      | Render this content inside the link; it may be plain text or richer markup.           |
| `target`   | `string`    | No       | Set the anchor target when provided, for example `_blank` for a new tab.              |
| `rel`      | `string`    | No       | Set the anchor rel attribute; use it to convey security or relationship hints.        |

### EmptyState

Placeholder container for lists, tables, or groups when there is nothing to render. Use it for messaging, guidance, or
simple illustration.

| Prop       | Type        | Required | Description                                                     |
| ---------- | ----------- | -------- | --------------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render this content as the empty-state message or illustration. |

### Errors

Inline list of validation messages for a specific control or answer. Keep each message distinct and close to the related
input.

| Prop       | Type       | Required | Description                                                                |
| ---------- | ---------- | -------- | -------------------------------------------------------------------------- |
| `id`       | `string`   | No       | Apply as the container id so inputs can reference it via aria-describedby. |
| `messages` | `string[]` | Yes      | Render each string as a distinct message line.                             |

### OptionsLoading

Loading UI for option-backed controls while options are fetching. Use it to show a spinner or skeleton where options
would appear.

| Prop        | Type      | Required | Description                                             |
| ----------- | --------- | -------- | ------------------------------------------------------- |
| `isLoading` | `boolean` | Yes      | When true, show a loading indicator instead of options. |

### NodeHelp

Short help text associated with a node label. Usually rendered near the label and referenced by the control via
aria-describedby.

| Prop        | Type        | Required | Description                                              |
| ----------- | ----------- | -------- | -------------------------------------------------------- |
| `id`        | `string`    | Yes      | Apply as the element id so the control can reference it. |
| `children`  | `ReactNode` | Yes      | Render this help content near the label or input.        |
| `ariaLabel` | `string`    | No       | Use as aria-label for the help region when needed.       |

### NodeLegal

Legal or consent content tied to a node. It can be inline text or a trigger that reveals more detail, but should remain
accessible.

| Prop        | Type        | Required | Description                                                                                                               |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`    | Yes      | Apply to the element that contains (or references) the legal text so other components can target it via aria-describedby. |
| `children`  | `ReactNode` | Yes      | Render the legal text or markup provided by the renderer.                                                                 |
| `ariaLabel` | `string`    | No       | Use as an aria-label when the legal UI is only an icon or otherwise lacks a visible label.                                |

### NodeFlyover

Supplementary context for a node, often presented as a tooltip or popover. Keep it discoverable from the header and
reachable via aria-describedby.

| Prop        | Type        | Required | Description                                                                                                               |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`    | Yes      | Apply to the element that holds (or is referenced by) the flyover content so inputs can point to it via aria-describedby. |
| `children`  | `ReactNode` | Yes      | Render the informational content provided by the renderer.                                                                |
| `ariaLabel` | `string`    | No       | Use as an aria-label when the flyover UI is an icon-only control.                                                         |

### NodeHeader

Header block for questions and groups that owns label layout, required marker, and optional help/legal/flyover slots. It
also provides the labelled-by anchor for the main control.

| Prop             | Type        | Required | Description                                                                           |
| ---------------- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| `label`          | `ReactNode` | Yes      | Render as the primary label text or markup for the node.                              |
| `ariaLabelledBy` | `string`    | No       | Use as the id on the label element so the input can reference it via aria-labelledby. |
| `htmlFor`        | `string`    | No       | Forward to the label element to connect it to the primary control.                    |
| `required`       | `boolean`   | No       | When true, display a visual required indicator near the label.                        |
| `help`           | `ReactNode` | No       | Render the help slot content next to or beneath the label.                            |
| `legal`          | `ReactNode` | No       | Render the legal slot content within the header layout.                               |
| `flyover`        | `ReactNode` | No       | Render the flyover slot content within the header layout.                             |

### InputGroup

Layout wrapper for multi-part inputs such as quantity and coding. Arrange the children as a single logical field using
the chosen layout and weights.

| Prop       | Type              | Required | Description                                                                       |
| ---------- | ----------------- | -------- | --------------------------------------------------------------------------------- |
| `children` | `ReactNode`       | Yes      | Render each child input in order as a single grouped control.                     |
| `layout`   | `"grid" \| "row"` | Yes      | Choose the overall arrangement: grid-style flow or a horizontal row.              |
| `weights`  | `number[]`        | No       | Use as relative size hints per child when layout is row; ignore for grid layouts. |

### TextInput

Single-line text field for short string answers, URLs, or identifiers. Render a standard input and forward accessibility
ids and placeholder.

| Prop              | Type                                   | Required | Description                                                                 |
| ----------------- | -------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `id`              | `string`                               | No       | Set as the input element id so labels can target it.                        |
| `type`            | `string`                               | No       | Use as the HTML input type (defaults to text in most themes).               |
| `value`           | `string`                               | Yes      | Render this string as the current input value.                              |
| `onChange`        | `(value: string) => void`              | Yes      | Call with the new string whenever the user edits the field.                 |
| `disabled`        | `boolean`                              | No       | When true, render the input in a disabled state and prevent edits.          |
| `placeholder`     | `string`                               | No       | Show this hint when the input is empty.                                     |
| `ariaLabelledBy`  | `string`                               | No       | Forward to aria-labelledby to associate the input with its label.           |
| `ariaDescribedBy` | `string`                               | No       | Forward to aria-describedby to associate the input with help or error text. |
| `inputMode`       | `HTMLAttributes<Element>["inputMode"]` | No       | Apply to the inputmode attribute to influence virtual keyboard layouts.     |

### TextArea

Multi-line text field for longer narrative responses. Use a textarea or equivalent and forward accessibility ids and
placeholder.

| Prop              | Type                      | Required | Description                                                                    |
| ----------------- | ------------------------- | -------- | ------------------------------------------------------------------------------ |
| `id`              | `string`                  | No       | Set as the textarea id so labels can target it.                                |
| `value`           | `string`                  | Yes      | Render this string as the current textarea value.                              |
| `onChange`        | `(value: string) => void` | Yes      | Call with the new string whenever the user edits the text.                     |
| `disabled`        | `boolean`                 | No       | When true, render the textarea in a disabled state and prevent edits.          |
| `placeholder`     | `string`                  | No       | Show this hint when the textarea is empty.                                     |
| `ariaLabelledBy`  | `string`                  | No       | Forward to aria-labelledby to associate the textarea with its label.           |
| `ariaDescribedBy` | `string`                  | No       | Forward to aria-describedby to associate the textarea with help or error text. |

### NumberInput

Numeric text field for integer, decimal, and quantity values. Accept null for empty and show a unit label when provided.

| Prop              | Type                              | Required | Description                                                                         |
| ----------------- | --------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `id`              | `string`                          | No       | Set as the input id so labels can target it.                                        |
| `value`           | `number \| null`                  | Yes      | Render this number as the current value; null means show an empty field.            |
| `onChange`        | `(value: number \| null) => void` | Yes      | Call with the parsed number when the user edits, or null when the field is cleared. |
| `disabled`        | `boolean`                         | No       | When true, render the input in a disabled state and prevent edits.                  |
| `placeholder`     | `string`                          | No       | Show this hint when the field is empty.                                             |
| `step`            | `number \| "any"`                 | No       | Apply as the input step value to control increments and precision.                  |
| `ariaLabelledBy`  | `string`                          | No       | Forward to aria-labelledby to associate the input with its label.                   |
| `ariaDescribedBy` | `string`                          | No       | Forward to aria-describedby to associate the input with help or error text.         |
| `unitLabel`       | `string`                          | No       | Render a static unit label alongside the input when provided.                       |

### DateInput

Date-only field for calendar values. Use a date picker or text input but keep the value string intact.

| Prop              | Type                      | Required | Description                                                                 |
| ----------------- | ------------------------- | -------- | --------------------------------------------------------------------------- |
| `id`              | `string`                  | No       | Set as the input id so labels can target it.                                |
| `value`           | `string`                  | Yes      | Render this date string as the current value (typically `YYYY-MM-DD`).      |
| `onChange`        | `(value: string) => void` | Yes      | Call with the new date string whenever the user edits the field.            |
| `disabled`        | `boolean`                 | No       | When true, render the input in a disabled state and prevent edits.          |
| `placeholder`     | `string`                  | No       | Show this hint when the field is empty.                                     |
| `ariaLabelledBy`  | `string`                  | No       | Forward to aria-labelledby to associate the input with its label.           |
| `ariaDescribedBy` | `string`                  | No       | Forward to aria-describedby to associate the input with help or error text. |

### DateTimeInput

Date and time field for combined values. Use a datetime picker or text input but keep the value string intact.

| Prop              | Type                      | Required | Description                                                                       |
| ----------------- | ------------------------- | -------- | --------------------------------------------------------------------------------- |
| `id`              | `string`                  | No       | Set as the input id so labels can target it.                                      |
| `value`           | `string`                  | Yes      | Render this date-time string as the current value (typically `YYYY-MM-DDTHH:mm`). |
| `onChange`        | `(value: string) => void` | Yes      | Call with the new date-time string whenever the user edits the field.             |
| `disabled`        | `boolean`                 | No       | When true, render the input in a disabled state and prevent edits.                |
| `placeholder`     | `string`                  | No       | Show this hint when the field is empty.                                           |
| `ariaLabelledBy`  | `string`                  | No       | Forward to aria-labelledby to associate the input with its label.                 |
| `ariaDescribedBy` | `string`                  | No       | Forward to aria-describedby to associate the input with help or error text.       |

### TimeInput

Time-only field for hours and minutes. Use a time picker or text input but keep the value string intact.

| Prop              | Type                      | Required | Description                                                                 |
| ----------------- | ------------------------- | -------- | --------------------------------------------------------------------------- |
| `id`              | `string`                  | No       | Set as the input id so labels can target it.                                |
| `value`           | `string`                  | Yes      | Render this time string as the current value (typically `HH:mm`).           |
| `onChange`        | `(value: string) => void` | Yes      | Call with the new time string whenever the user edits the field.            |
| `disabled`        | `boolean`                 | No       | When true, render the input in a disabled state and prevent edits.          |
| `placeholder`     | `string`                  | No       | Show this hint when the field is empty.                                     |
| `ariaLabelledBy`  | `string`                  | No       | Forward to aria-labelledby to associate the input with its label.           |
| `ariaDescribedBy` | `string`                  | No       | Forward to aria-describedby to associate the input with help or error text. |

### SliderInput

Range control for bounded numeric values. Show bounds and current value when available, and treat null as no selection.

| Prop              | Type                              | Required | Description                                                                        |
| ----------------- | --------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `value`           | `number \| null`                  | Yes      | Render this number as the current slider position; null represents an unset value. |
| `onChange`        | `(value: number \| null) => void` | Yes      | Call with the new numeric value whenever the slider moves, or null if cleared.     |
| `disabled`        | `boolean`                         | No       | When true, render the slider in a disabled state and prevent interaction.          |
| `min`             | `number`                          | No       | Use as the lower bound for the slider range.                                       |
| `max`             | `number`                          | No       | Use as the upper bound for the slider range.                                       |
| `step`            | `number`                          | No       | Apply as the slider step increment.                                                |
| `ariaLabelledBy`  | `string`                          | No       | Forward to aria-labelledby to associate the slider with its label.                 |
| `ariaDescribedBy` | `string`                          | No       | Forward to aria-describedby to associate the slider with help or error text.       |
| `lowerLabel`      | `string`                          | No       | Display this label near the minimum value marker when provided.                    |
| `upperLabel`      | `string`                          | No       | Display this label near the maximum value marker when provided.                    |
| `unitLabel`       | `string`                          | No       | Render a unit label alongside the current value when provided.                     |

### SpinnerInput

Numeric control with stepper affordances for small ranges. It should support typing, step changes, and min/max rules.

| Prop              | Type                              | Required | Description                                                                                    |
| ----------------- | --------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `value`           | `number \| null`                  | Yes      | Render this number as the current value; null represents an empty field.                       |
| `onChange`        | `(value: number \| null) => void` | Yes      | Call with the new numeric value when the user edits or uses the stepper, or null when cleared. |
| `disabled`        | `boolean`                         | No       | When true, render the control in a disabled state and prevent interaction.                     |
| `min`             | `number`                          | No       | Use as the lower bound for the value.                                                          |
| `max`             | `number`                          | No       | Use as the upper bound for the value.                                                          |
| `step`            | `number`                          | No       | Apply as the step increment for the control.                                                   |
| `ariaLabelledBy`  | `string`                          | No       | Forward to aria-labelledby to associate the input with its label.                              |
| `ariaDescribedBy` | `string`                          | No       | Forward to aria-describedby to associate the input with help or error text.                    |
| `placeholder`     | `string`                          | No       | Show this hint when the field is empty.                                                        |
| `unitLabel`       | `string`                          | No       | Render a unit label alongside the input when provided.                                         |

### SelectInput

Single-select dropdown for option lists. Include disabled legacy entries in the options list when needed and allow
clearing the selection when applicable.

| Prop               | Type                              | Required | Description                                                                          |
| ------------------ | --------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `options`          | `OptionItem[]`                    | Yes      | Render these entries as selectable options in the dropdown.                          |
| `selectedOption`   | `SelectedOptionItem \| null`      | Yes      | Render this option as the current selection, or null when empty.                     |
| `onChange`         | `(token: string \| null) => void` | Yes      | Call with the newly selected option token, or null when the selection is cleared.    |
| `customOption`     | `OptionItem`                      | No       | Render an extra option (for example, “Specify other”) alongside the options list.    |
| `customOptionForm` | `ReactNode`                       | No       | Render UI associated with the custom option (for example, a custom value input row). |
| `id`               | `string`                          | Yes      | Set as the select element id so labels can target it.                                |
| `ariaLabelledBy`   | `string`                          | No       | Forward to aria-labelledby to associate the select with its label.                   |
| `ariaDescribedBy`  | `string`                          | No       | Forward to aria-describedby to associate the select with help or error text.         |
| `disabled`         | `boolean`                         | No       | When true, render the select in a disabled state and prevent changes.                |
| `isLoading`        | `boolean`                         | No       | When true, show a loading indicator or disable option interactions as needed.        |
| `placeholder`      | `string`                          | No       | Show this hint in the input when no option is selected.                              |

### RadioButtonList

Single-select option list presented as radio buttons. Include disabled legacy options in the options list when needed
and allow extra content after the list.

| Prop              | Type                      | Required | Description                                                                   |
| ----------------- | ------------------------- | -------- | ----------------------------------------------------------------------------- |
| `options`         | `OptionItem[]`            | Yes      | Render these entries as radio options.                                        |
| `token`           | `string`                  | Yes      | Render this option token as the currently selected radio.                     |
| `onChange`        | `(token: string) => void` | Yes      | Call with the newly selected option token when the user changes selection.    |
| `id`              | `string`                  | Yes      | Use as the radio group name/id so options stay grouped.                       |
| `ariaLabelledBy`  | `string`                  | Yes      | Forward to aria-labelledby to associate the group with its label.             |
| `ariaDescribedBy` | `string`                  | No       | Forward to aria-describedby to associate the group with help or error text.   |
| `disabled`        | `boolean`                 | Yes      | When true, render options as disabled and prevent selection changes.          |
| `isLoading`       | `boolean`                 | No       | When true, show a loading indicator or busy state for the list.               |
| `after`           | `ReactNode`               | No       | Render additional content after the list (for example, an open-choice input). |
| `afterInset`      | `boolean`                 | No       | When true, indent the `after` content to align with the option text.          |

### CheckboxList

Multi-select option list presented as checkboxes. Support per-option errors and an optional after slot for custom
inputs.

| Prop              | Type                           | Required | Description                                                                 |
| ----------------- | ------------------------------ | -------- | --------------------------------------------------------------------------- |
| `options`         | `OptionItem[]`                 | Yes      | Render these entries as checkbox options.                                   |
| `tokens`          | `Set<string>`                  | Yes      | Use this set of tokens to determine which checkboxes are checked.           |
| `onChange`        | `(token: string) => void`      | Yes      | Call with the toggled option token when the user changes a checkbox.        |
| `id`              | `string`                       | Yes      | Use as the checkbox group name/id so inputs stay grouped.                   |
| `ariaLabelledBy`  | `string`                       | Yes      | Forward to aria-labelledby to associate the group with its label.           |
| `ariaDescribedBy` | `string`                       | No       | Forward to aria-describedby to associate the group with help or error text. |
| `disabled`        | `boolean`                      | No       | When true, render all options as disabled and prevent changes.              |
| `isLoading`       | `boolean`                      | No       | When true, show a loading indicator or busy state for the list.             |
| `renderErrors`    | `(token: string) => ReactNode` | No       | Render per-option error content for the matching token when provided.       |
| `after`           | `ReactNode`                    | No       | Render additional content after the list (for example, a custom input).     |

### MultiSelectInput

Composite multi-select UI that combines a picker, chips, and optional custom-option content. It should display selections
as chips and allow removal when permitted.

| Prop               | Type                      | Required | Description                                                                          |
| ------------------ | ------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `options`          | `OptionItem[]`            | Yes      | Render these entries as options in the picker dropdown (including selected ones).    |
| `selectedOptions`  | `SelectedOptionItem[]`    | Yes      | Render these selections as chips and use their tokens to filter options.             |
| `onSelect`         | `(token: string) => void` | Yes      | Call with the selected option token when the user picks an option.                   |
| `onDeselect`       | `(token: string) => void` | Yes      | Call with the selected token when the user removes a selection.                      |
| `id`               | `string`                  | Yes      | Set as the input id so the combobox and listbox can be referenced.                   |
| `customOption`     | `OptionItem`              | No       | Render an extra option (for example, “Specify other”) alongside the options list.    |
| `ariaLabelledBy`   | `string`                  | No       | Forward to aria-labelledby for the picker so it associates with the label.           |
| `ariaDescribedBy`  | `string`                  | No       | Forward to aria-describedby for the picker so it associates with help or error text. |
| `disabled`         | `boolean`                 | No       | When true, render the picker and chip actions in a disabled state.                   |
| `isLoading`        | `boolean`                 | No       | When true, show a loading indicator or busy state for the options.                   |
| `customOptionForm` | `ReactNode`               | No       | Render UI associated with the custom option (for example, a custom value input row). |
| `placeholder`      | `string`                  | No       | Show this placeholder text in the picker when no value is selected.                  |

### CustomOptionForm

Layout wrapper for custom option entry flows. Use it to present the custom input along with submit/cancel actions.

| Prop      | Type                 | Required | Description                                                             |
| --------- | -------------------- | -------- | ----------------------------------------------------------------------- |
| `content` | `ReactNode`          | Yes      | Render the custom input control.                                        |
| `errors`  | `ReactNode`          | No       | Render validation or error content associated with the custom input.    |
| `submit`  | `CustomOptionAction` | Yes      | Configure the primary submit action (label, handler, disabled state).   |
| `cancel`  | `CustomOptionAction` | Yes      | Configure the secondary cancel action (label, handler, disabled state). |

### FileInput

Attachment picker that handles file selection, display of the selected file, and clearing. Call onChange for the raw
file (or null when clearing) so the renderer can update the Attachment.

| Prop              | Type                           | Required | Description                                                                  |
| ----------------- | ------------------------------ | -------- | ---------------------------------------------------------------------------- |
| `value`           | `Attachment \| null`           | Yes      | Render this attachment as the current value; null means no file is selected. |
| `id`              | `string`                       | No       | Set as the input id so labels can target the underlying file input.          |
| `ariaLabelledBy`  | `string`                       | No       | Forward to aria-labelledby for the file input and any summary region.        |
| `ariaDescribedBy` | `string`                       | No       | Forward to aria-describedby for the file input and any summary region.       |
| `disabled`        | `boolean`                      | No       | When true, disable file selection and related actions.                       |
| `onChange`        | `(file: File \| null) => void` | No       | Call with the selected file, or null when clearing the current file.         |

### AnswerAddButton

Add action for repeating question answers. Usually placed in the answer list toolbar.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the add action.                                                        |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the add action.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### AnswerRemoveButton

Remove action for a single repeating answer. Usually placed next to the answer control.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the remove action.                                                     |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the remove action.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### GroupAddButton

Add action for repeating group instances. Typically placed near the group wrapper toolbar.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the add action.                                                        |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the add action.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### GroupRemoveButton

Remove action for a single group instance inside a repeating wrapper.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the remove action.                                                     |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the remove action.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### FormSubmitButton

Primary submit call to action for the form. Render a button and invoke onClick when you handle submission outside native
form behavior.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | No       | Invoke the callback passed by the renderer when the user activates the submit control directly.     |
| `disabled` | `boolean`    | No       | When true, render the submit action disabled and prevent submission.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### FormResetButton

Secondary action that resets the form to its initial state. Render a button that calls onClick.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the reset action.                                                      |
| `disabled` | `boolean`    | Yes      | When true, render the reset action disabled and prevent reset.                                      |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### OpenChoiceBackButton

Action that returns from a custom open-choice input back to the option list.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user wants to return from custom entry to the option list.                            |
| `disabled` | `boolean`    | Yes      | When true, render the action disabled and prevent switching back.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### AnswerList

Container that lays out one or more answers and an optional toolbar. It controls spacing and ordering of answer rows.

| Prop       | Type        | Required | Description                                              |
| ---------- | ----------- | -------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the list of answer rows supplied by the renderer. |
| `toolbar`  | `ReactNode` | No       | Render the add‑answer controls when provided.            |

### AnswerScaffold

Layout for a single answer row, combining the main control, a toolbar area, and nested content such as errors.

| Prop       | Type        | Required | Description                                                       |
| ---------- | ----------- | -------- | ----------------------------------------------------------------- |
| `control`  | `ReactNode` | Yes      | Render the main input control for this answer instance.           |
| `toolbar`  | `ReactNode` | No       | Render per-answer actions (typically the remove button).          |
| `children` | `ReactNode` | No       | Render nested content such as validation messages or child nodes. |

### QuestionScaffold

Wrapper around a question that organizes header, control, and validation feedback. Use it as the outer shell for
question nodes.

| Prop       | Type        | Required | Description                                                                                  |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`   | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `header`   | `ReactNode` | No       | Render the question header (label, help, legal, flyover).                                    |
| `children` | `ReactNode` | Yes      | Render the question body content, including controls and errors.                             |

### GroupWrapperScaffold

Wrapper around a repeating group that holds the collection of instances and the add control.

| Prop       | Type        | Required | Description                                                                                  |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`   | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `header`   | `ReactNode` | No       | Render the header for the repeating group wrapper.                                           |
| `children` | `ReactNode` | Yes      | Render each group instance inside the wrapper.                                               |
| `toolbar`  | `ReactNode` | No       | Render the add‑group controls when provided.                                                 |

### GroupWrapperScaffoldItem

Per-instance wrapper inside a repeating group that places the group content alongside its remove action and errors.

| Prop       | Type        | Required | Description                                              |
| ---------- | ----------- | -------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the group instance body and its child nodes.      |
| `errors`   | `ReactNode` | No       | Render validation errors associated with this instance.  |
| `toolbar`  | `ReactNode` | No       | Render instance-level actions such as the remove button. |

### GroupScaffold

Wrapper for a non-repeating group that arranges its header and child nodes. dataControl can steer specialized layouts.

| Prop          | Type        | Required | Description                                                                                  |
| ------------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`      | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `header`      | `ReactNode` | No       | Render the group header (label, help, legal, flyover).                                       |
| `children`    | `ReactNode` | Yes      | Render the group body content and nested nodes.                                              |
| `dataControl` | `string`    | No       | Use as a style or layout hint for specialized group renderers.                               |

### GroupActions

Slot for supplemental group-level content that should appear after the main group body.

| Prop       | Type        | Required | Description                                                                |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render additional group actions or related nodes provided by the renderer. |

### DisplayRenderer

Renderer for display-only nodes such as static text or markdown. It should not expose input controls.

| Prop       | Type        | Required | Description                                                                                  |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`   | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `children` | `ReactNode` | Yes      | Render the display text or markup provided by the renderer.                                  |

### NodeList

List container that renders nodes in order. It should handle spacing and grouping.

| Prop       | Type        | Required | Description                                              |
| ---------- | ----------- | -------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the node items provided by the renderer in order. |

### FormHeader

Form header area for title and description. It is optional and only shown when content is provided.

| Prop          | Type        | Required | Description                                           |
| ------------- | ----------- | -------- | ----------------------------------------------------- |
| `title`       | `ReactNode` | No       | Render the form title supplied by the renderer.       |
| `description` | `ReactNode` | No       | Render the form description supplied by the renderer. |

### FormErrors

Top-level error summary for the form. Use it to list validation issues after submit attempts.

| Prop       | Type       | Required | Description                                           |
| ---------- | ---------- | -------- | ----------------------------------------------------- |
| `messages` | `string[]` | Yes      | Render each string as a top-level form error message. |

### FormSection

Section wrapper that groups header, footer, or main content within the form. Use variant to drive layout and styling.

| Prop       | Type                                | Required | Description                                           |
| ---------- | ----------------------------------- | -------- | ----------------------------------------------------- |
| `children` | `ReactNode`                         | Yes      | Render the content that belongs to this section.      |
| `variant`  | `"header" \| "footer" \| "default"` | No       | Use to apply header/footer styling or default layout. |

### FormActions

Container for primary form actions, typically submit and reset. Use it to position action controls consistently.

| Prop       | Type        | Required | Description                                                     |
| ---------- | ----------- | -------- | --------------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the action buttons or controls provided by the renderer. |

### Form

Outer wrapper for the questionnaire. If you render a form element, prevent default and call onSubmit; otherwise invoke
onSubmit from your own controls.

| Prop       | Type         | Required | Description                                                                |
| ---------- | ------------ | -------- | -------------------------------------------------------------------------- |
| `onSubmit` | `() => void` | No       | Call when the user submits; prevent default yourself if you render a form. |
| `children` | `ReactNode`  | Yes      | Render the full form content inside the form element.                      |

### PageStatus

Indicator for the current page in a paged form. Keep it readable and accessible.

| Prop      | Type     | Required | Description                                               |
| --------- | -------- | -------- | --------------------------------------------------------- |
| `current` | `number` | Yes      | Render this as the current page number shown to the user. |
| `total`   | `number` | Yes      | Render this as the total number of pages available.       |

### PageNavigation

Controls for moving between pages in a paged form. Provide clear prev/next affordances and honor disabled states.

| Prop           | Type         | Required | Description                                                  |
| -------------- | ------------ | -------- | ------------------------------------------------------------ |
| `current`      | `number`     | Yes      | Render this as the current page number in the navigation UI. |
| `total`        | `number`     | Yes      | Render this as the total page count in the navigation UI.    |
| `onPrev`       | `() => void` | Yes      | Call when the user activates the previous-page control.      |
| `onNext`       | `() => void` | Yes      | Call when the user activates the next-page control.          |
| `disabledPrev` | `boolean`    | Yes      | When true, render the previous-page control disabled.        |
| `disabledNext` | `boolean`    | Yes      | When true, render the next-page control disabled.            |

### GridTable

Tabular layout used by grid-style groups. Render headers and rows based on column and row metadata, with an optional
empty state.

| Prop      | Type                | Required | Description                                                          |
| --------- | ------------------- | -------- | -------------------------------------------------------------------- |
| `columns` | `GridTableColumn[]` | Yes      | Render these column definitions as table headers.                    |
| `rows`    | `GridTableRow[]`    | Yes      | Render these row definitions, including row labels and cell content. |
| `empty`   | `ReactNode`         | No       | Render this content when there are no rows or columns.               |

### TabContainer

Tabbed layout for group panels. Render the active panel, wire ids for aria, and show errors or empty state when
relevant.

| Prop       | Type                      | Required | Description                                                                                  |
| ---------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `header`   | `ReactNode`               | No       | Render the tab set header content (often the group label).                                   |
| `items`    | `TabItem[]`               | Yes      | Render each tab item, including its label and panel content.                                 |
| `value`    | `number`                  | Yes      | Use as the active tab index to show the selected panel.                                      |
| `onChange` | `(index: number) => void` | Yes      | Call when the user selects a different tab.                                                  |
| `errors`   | `ReactNode`               | No       | Render validation or status content associated with the tab set.                             |
| `empty`    | `ReactNode`               | No       | Render this content when there are no tabs to show.                                          |
| `linkId`   | `string`                  | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |

## Data types

Shared data structures referenced by theme component props.

### OptionItem

Base option shape used by option selectors such as select inputs and radio lists.

| Field      | Type        | Required | Description                                                                              |
| ---------- | ----------- | -------- | ---------------------------------------------------------------------------------------- |
| `token`    | `string`    | Yes      | Use as the stable option token for selection and updates.                                |
| `label`    | `ReactNode` | Yes      | Render as the visible label for the option; the renderer provides display-ready content. |
| `disabled` | `boolean`   | No       | When true, render the option as unavailable and prevent selection.                       |

### SelectedOptionItem

Represents a selected option rendered as a chip or a single selection.

| Field      | Type        | Required | Description                                                        |
| ---------- | ----------- | -------- | ------------------------------------------------------------------ |
| `token`    | `string`    | Yes      | Use as a stable identifier when rendering and updating selections. |
| `label`    | `ReactNode` | Yes      | Render as the selection's visible label.                           |
| `disabled` | `boolean`   | No       | When true, render the selection as unavailable.                    |
| `errors`   | `ReactNode` | No       | Render as error content associated with this selection.            |

### CustomOptionAction

| Field      | Type         | Required | Description                                                    |
| ---------- | ------------ | -------- | -------------------------------------------------------------- |
| `label`    | `string`     | Yes      | Render as the action label.                                    |
| `onClick`  | `() => void` | Yes      | Call when the action is activated.                             |
| `disabled` | `boolean`    | No       | When true, render the action disabled and prevent interaction. |

### Attachment

Attachment shape used by `FileInput` to display metadata and stored content.

| Field         | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `title`       | `string` | No       | Display name or title to show for the attachment.   |
| `url`         | `string` | No       | Link target for downloaded or referenced files.     |
| `size`        | `number` | No       | Byte size for the attachment used for display.      |
| `contentType` | `string` | No       | MIME type used for labeling or preview decisions.   |
| `data`        | `string` | No       | Base64-encoded file content for inline attachments. |

### GridTableColumn

| Field   | Type        | Required | Description                                |
| ------- | ----------- | -------- | ------------------------------------------ |
| `token` | `string`    | Yes      | Use as a stable identifier for the column. |
| `label` | `ReactNode` | Yes      | Render as the column header content.       |

### GridTableRow

| Field   | Type              | Required | Description                                         |
| ------- | ----------------- | -------- | --------------------------------------------------- |
| `token` | `string`          | Yes      | Use as a stable identifier for the row.             |
| `label` | `ReactNode`       | Yes      | Render as the row label or header cell content.     |
| `cells` | `GridTableCell[]` | Yes      | Render these cells for the row, aligned to columns. |

### GridTableCell

| Field     | Type        | Required | Description                              |
| --------- | ----------- | -------- | ---------------------------------------- |
| `token`   | `string`    | Yes      | Use as a stable identifier for the cell. |
| `content` | `ReactNode` | Yes      | Render as the cell content.              |

### TabItem

| Field      | Type        | Required | Description                                                  |
| ---------- | ----------- | -------- | ------------------------------------------------------------ |
| `token`    | `string`    | Yes      | Use as a stable identifier for the tab.                      |
| `label`    | `ReactNode` | Yes      | Render as the tab button label.                              |
| `buttonId` | `string`    | Yes      | Apply as the tab button id to wire aria-labelledby/controls. |
| `panelId`  | `string`    | Yes      | Apply as the tab panel id to wire aria controls.             |
| `content`  | `ReactNode` | Yes      | Render as the panel content for this tab.                    |
