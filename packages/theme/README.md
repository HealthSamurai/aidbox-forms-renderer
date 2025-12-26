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
  - [OptionsState](#optionsstate)
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
  - [FileInput](#fileinput)
  - [AnswerAddButton](#answeraddbutton)
  - [AnswerRemoveButton](#answerremovebutton)
  - [GroupAddButton](#groupaddbutton)
  - [GroupRemoveButton](#groupremovebutton)
  - [FormSubmitButton](#formsubmitbutton)
  - [FormResetButton](#formresetbutton)
  - [OpenChoiceBackButton](#openchoicebackbutton)
  - [MultiSelectSpecifyOtherButton](#multiselectspecifyotherbutton)
  - [MultiSelectClearAllButton](#multiselectclearallbutton)
  - [MultiSelectDialogCancelButton](#multiselectdialogcancelbutton)
  - [MultiSelectDialogAddButton](#multiselectdialogaddbutton)
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
  - [OptionEntry](#optionentry)
  - [Attachment](#attachment)
  - [MultiSelectChip](#multiselectchip)
  - [MultiSelectDialog](#multiselectdialog)
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

- Controlled props: inputs use value and onChange. onChange receives the next value, never a DOM event.
- Disabled states: the renderer uses disabled to indicate non editable inputs. Prefer disabled over readOnly in theme
  components.
- Accessibility: ariaLabelledBy and ariaDescribedBy are string ids. Wire them to the relevant elements.
- Ids: when id is provided, pass it through to the focusable control.
- children is the slot name for single content. Data types may still use content for internal fragments (for example
  MultiSelectChip).
- Option fallback: legacyOption is provided when a stored answer does not match current options. Surface it so data is
  not lost.
- Props marked No in Required can be omitted. Treat undefined as not provided.

## Component reference

### Link

Anchor component used wherever the renderer needs a plain link, such as external references or supplemental actions.

| Prop       | Type        | Required | Description                                                                           |
| ---------- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| `href`     | `string`    | Yes      | Set as the anchor destination; the renderer passes a fully qualified or relative URL. |
| `children` | `ReactNode` | Yes      | Render this content inside the link; it may be plain text or richer markup.           |
| `target`   | `string`    | No       | Set the anchor target when provided, for example `_blank` for a new tab.              |
| `rel`      | `string`    | No       | Set the anchor rel attribute; use it to convey security or relationship hints.        |

### EmptyState

Container for rendering an empty list or table message when there is no content.

| Prop       | Type        | Required | Description                                                     |
| ---------- | ----------- | -------- | --------------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render this content as the empty-state message or illustration. |

### Errors

Displays one or more validation messages associated with a control or answer.

| Prop       | Type       | Required | Description                                                                |
| ---------- | ---------- | -------- | -------------------------------------------------------------------------- |
| `id`       | `string`   | No       | Apply as the container id so inputs can reference it via aria-describedby. |
| `messages` | `string[]` | Yes      | Render each string as a distinct message line.                             |

### OptionsState

Status indicator for option-backed controls while options are loading or failed.

| Prop        | Type      | Required | Description                                                   |
| ----------- | --------- | -------- | ------------------------------------------------------------- |
| `isLoading` | `boolean` | Yes      | When true, show a loading indicator instead of options.       |
| `error`     | `string`  | No       | When provided, render the error message for the options list. |

### NodeHelp

Help text block that accompanies a question or group label.

| Prop        | Type        | Required | Description                                              |
| ----------- | ----------- | -------- | -------------------------------------------------------- |
| `id`        | `string`    | Yes      | Apply as the element id so the control can reference it. |
| `children`  | `ReactNode` | Yes      | Render this help content near the label or input.        |
| `ariaLabel` | `string`    | No       | Use as aria-label for the help region when needed.       |

### NodeLegal

Legal content tied to a question or group. Use it to surface regulatory or consent text, either inline or behind a
trigger.

| Prop        | Type        | Required | Description                                                                                                               |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`    | Yes      | Apply to the element that contains (or references) the legal text so other components can target it via aria-describedby. |
| `children`  | `ReactNode` | Yes      | Render the legal text or markup provided by the renderer.                                                                 |
| `ariaLabel` | `string`    | No       | Use as an aria-label when the legal UI is only an icon or otherwise lacks a visible label.                                |

### NodeFlyover

Supplemental context for a node, typically shown as a tooltip or popover triggered from the header.

| Prop        | Type        | Required | Description                                                                                                               |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`    | Yes      | Apply to the element that holds (or is referenced by) the flyover content so inputs can point to it via aria-describedby. |
| `children`  | `ReactNode` | Yes      | Render the informational content provided by the renderer.                                                                |
| `ariaLabel` | `string`    | No       | Use as an aria-label when the flyover UI is an icon-only control.                                                         |

### NodeHeader

Header region for questions and groups. It renders the label and optional adornments (help, legal, flyover).

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

Layout wrapper for composite inputs such as quantity or coding. It groups multiple input widgets into one coherent
block.

| Prop       | Type                             | Required | Description                                                                       |
| ---------- | -------------------------------- | -------- | --------------------------------------------------------------------------------- |
| `children` | `ReactNode`                      | Yes      | Render each child input in order as a single grouped control.                     |
| `layout`   | <code>"grid" &#124; "row"</code> | Yes      | Choose the overall arrangement: grid-style flow or a horizontal row.              |
| `weights`  | `number[]`                       | No       | Use as relative size hints per child when layout is row; ignore for grid layouts. |

### TextInput

Single-line text input used for string, URL, and simple text fields.

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

Multi-line text input used for long-form answers.

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

Numeric input used for integer, decimal, and quantity values.

| Prop              | Type                                                | Required | Description                                                                         |
| ----------------- | --------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `id`              | `string`                                            | No       | Set as the input id so labels can target it.                                        |
| `value`           | <code>number &#124; null</code>                     | Yes      | Render this number as the current value; null means show an empty field.            |
| `onChange`        | <code>(value: number &#124; null) =&gt; void</code> | Yes      | Call with the parsed number when the user edits, or null when the field is cleared. |
| `disabled`        | `boolean`                                           | No       | When true, render the input in a disabled state and prevent edits.                  |
| `placeholder`     | `string`                                            | No       | Show this hint when the field is empty.                                             |
| `step`            | <code>number &#124; "any"</code>                    | No       | Apply as the input step value to control increments and precision.                  |
| `ariaLabelledBy`  | `string`                                            | No       | Forward to aria-labelledby to associate the input with its label.                   |
| `ariaDescribedBy` | `string`                                            | No       | Forward to aria-describedby to associate the input with help or error text.         |
| `unitLabel`       | `string`                                            | No       | Render a static unit label alongside the input when provided.                       |

### DateInput

Date-only input used for calendar dates.

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

Date and time input for combined date-time values.

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

Time-only input for hours and minutes.

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

Range slider for numeric values, typically used when a bounded range is known.

| Prop              | Type                                                | Required | Description                                                                        |
| ----------------- | --------------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `value`           | <code>number &#124; null</code>                     | Yes      | Render this number as the current slider position; null represents an unset value. |
| `onChange`        | <code>(value: number &#124; null) =&gt; void</code> | Yes      | Call with the new numeric value whenever the slider moves, or null if cleared.     |
| `disabled`        | `boolean`                                           | No       | When true, render the slider in a disabled state and prevent interaction.          |
| `min`             | `number`                                            | No       | Use as the lower bound for the slider range.                                       |
| `max`             | `number`                                            | No       | Use as the upper bound for the slider range.                                       |
| `step`            | `number`                                            | No       | Apply as the slider step increment.                                                |
| `ariaLabelledBy`  | `string`                                            | No       | Forward to aria-labelledby to associate the slider with its label.                 |
| `ariaDescribedBy` | `string`                                            | No       | Forward to aria-describedby to associate the slider with help or error text.       |
| `lowerLabel`      | `string`                                            | No       | Display this label near the minimum value marker when provided.                    |
| `upperLabel`      | `string`                                            | No       | Display this label near the maximum value marker when provided.                    |
| `unitLabel`       | `string`                                            | No       | Render a unit label alongside the current value when provided.                     |

### SpinnerInput

Numeric input with stepper controls for incrementing or decrementing a value.

| Prop              | Type                                                | Required | Description                                                                                    |
| ----------------- | --------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `value`           | <code>number &#124; null</code>                     | Yes      | Render this number as the current value; null represents an empty field.                       |
| `onChange`        | <code>(value: number &#124; null) =&gt; void</code> | Yes      | Call with the new numeric value when the user edits or uses the stepper, or null when cleared. |
| `disabled`        | `boolean`                                           | No       | When true, render the control in a disabled state and prevent interaction.                     |
| `min`             | `number`                                            | No       | Use as the lower bound for the value.                                                          |
| `max`             | `number`                                            | No       | Use as the upper bound for the value.                                                          |
| `step`            | `number`                                            | No       | Apply as the step increment for the control.                                                   |
| `ariaLabelledBy`  | `string`                                            | No       | Forward to aria-labelledby to associate the input with its label.                              |
| `ariaDescribedBy` | `string`                                            | No       | Forward to aria-describedby to associate the input with help or error text.                    |
| `placeholder`     | `string`                                            | No       | Show this hint when the field is empty.                                                        |
| `unitLabel`       | `string`                                            | No       | Render a unit label alongside the input when provided.                                         |

### SelectInput

Single-select dropdown for options-backed questions.

| Prop              | Type                                                    | Required | Description                                                                              |
| ----------------- | ------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `options`         | `OptionItem[]`                                          | Yes      | Render these entries as selectable options in the dropdown.                              |
| `value`           | `string`                                                | Yes      | Render this option key as the current selection.                                         |
| `onChange`        | `(key: string) => void`                                 | Yes      | Call with the newly selected option key when the user changes the selection.             |
| `legacyOption`    | <code>{ key: string; label: string } &#124; null</code> | Yes      | Include a non-selectable option that represents a stored value not present in `options`. |
| `id`              | `string`                                                | Yes      | Set as the select element id so labels can target it.                                    |
| `ariaLabelledBy`  | `string`                                                | Yes      | Forward to aria-labelledby to associate the select with its label.                       |
| `ariaDescribedBy` | `string`                                                | No       | Forward to aria-describedby to associate the select with help or error text.             |
| `disabled`        | `boolean`                                               | Yes      | When true, render the select in a disabled state and prevent changes.                    |
| `isLoading`       | `boolean`                                               | No       | When true, show a loading indicator or disable option interactions as needed.            |
| `onClear`         | `() => void`                                            | No       | Invoke when the user requests clearing the current selection.                            |
| `clearLabel`      | `string`                                                | No       | Render this text on the clear control when `onClear` is provided.                        |

### RadioButtonList

Single-select list rendered as a radio group.

| Prop              | Type                                                    | Required | Description                                                                   |
| ----------------- | ------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `options`         | `OptionItem[]`                                          | Yes      | Render these entries as radio options.                                        |
| `value`           | `string`                                                | Yes      | Render this option key as the currently selected radio.                       |
| `onChange`        | `(value: string) => void`                               | Yes      | Call with the newly selected option key when the user changes selection.      |
| `legacyOption`    | <code>{ key: string; label: string } &#124; null</code> | Yes      | Include a disabled radio for a stored value that is not present in `options`. |
| `id`              | `string`                                                | Yes      | Use as the radio group name/id so options stay grouped.                       |
| `ariaLabelledBy`  | `string`                                                | Yes      | Forward to aria-labelledby to associate the group with its label.             |
| `ariaDescribedBy` | `string`                                                | No       | Forward to aria-describedby to associate the group with help or error text.   |
| `disabled`        | `boolean`                                               | Yes      | When true, render options as disabled and prevent selection changes.          |
| `isLoading`       | `boolean`                                               | No       | When true, show a loading indicator or busy state for the list.               |
| `after`           | `ReactNode`                                             | No       | Render additional content after the list (for example, an open-choice input). |
| `afterInset`      | `boolean`                                               | No       | When true, indent the `after` content to align with the option text.          |

### CheckboxList

Multi-select list rendered as a group of checkboxes.

| Prop              | Type                                                                  | Required | Description                                                                 |
| ----------------- | --------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `options`         | `{ key: string; label: string; value: TValue; disabled?: boolean }[]` | Yes      | Render these entries as checkbox options.                                   |
| `value`           | `Set<string>`                                                         | Yes      | Use this set of keys to determine which checkboxes are checked.             |
| `onChange`        | `(key: string) => void`                                               | Yes      | Call with the toggled option key when the user changes a checkbox.          |
| `id`              | `string`                                                              | Yes      | Use as the checkbox group name/id so inputs stay grouped.                   |
| `ariaLabelledBy`  | `string`                                                              | Yes      | Forward to aria-labelledby to associate the group with its label.           |
| `ariaDescribedBy` | `string`                                                              | No       | Forward to aria-describedby to associate the group with help or error text. |
| `disabled`        | `boolean`                                                             | No       | When true, render all options as disabled and prevent changes.              |
| `isLoading`       | `boolean`                                                             | No       | When true, show a loading indicator or busy state for the list.             |
| `renderErrors`    | `(key: string) => ReactNode`                                          | No       | Render per-option error content for the matching key when provided.         |
| `after`           | `ReactNode`                                                           | No       | Render additional content after the list (for example, a custom input).     |

### MultiSelectInput

Composite multi-select control that combines a picker, chips, and optional dialog for custom values.

| Prop              | Type                     | Required | Description                                                                             |
| ----------------- | ------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `options`         | `OptionEntry<unknown>[]` | Yes      | Render these entries as options in the picker dropdown.                                 |
| `value`           | `string`                 | No       | Use this option key as the current selection shown in the picker.                       |
| `onChange`        | `(key: string) => void`  | Yes      | Call with the selected option key when the user picks an option.                        |
| `ariaLabelledBy`  | `string`                 | No       | Forward to aria-labelledby for the picker so it associates with the label.              |
| `ariaDescribedBy` | `string`                 | No       | Forward to aria-describedby for the picker so it associates with help or error text.    |
| `disabled`        | `boolean`                | No       | When true, render the picker and chip actions in a disabled state.                      |
| `isLoading`       | `boolean`                | No       | When true, show a loading indicator or busy state for the options.                      |
| `showOptions`     | `boolean`                | No       | When false, hide the picker while still rendering chips and actions.                    |
| `chips`           | `MultiSelectChip[]`      | Yes      | Render each chip as the current selection list, including its remove action and errors. |
| `actions`         | `ReactNode`              | No       | Render additional action controls provided by the renderer (for example, “Clear all”).  |
| `dialog`          | `MultiSelectDialog`      | No       | Render an overlay dialog when provided to capture custom values.                        |
| `placeholder`     | `string`                 | No       | Show this placeholder text in the picker when no value is selected.                     |

### FileInput

File upload control for attachment answers, typically wrapping a hidden file input and action buttons.

| Prop              | Type                                                    | Required | Description                                                                          |
| ----------------- | ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `value`           | <code>Attachment &#124; null</code>                     | Yes      | Render this attachment as the current value; null means no file is selected.         |
| `onChange`        | <code>(value: Attachment &#124; null) =&gt; void</code> | Yes      | Call with the updated attachment value when you transform the file or clear it.      |
| `id`              | `string`                                                | No       | Set as the input id so labels can target the underlying file input.                  |
| `ariaLabelledBy`  | `string`                                                | No       | Forward to aria-labelledby for the file input and any summary region.                |
| `ariaDescribedBy` | `string`                                                | No       | Forward to aria-describedby for the file input and any summary region.               |
| `disabled`        | `boolean`                                               | No       | When true, disable file selection and related actions.                               |
| `sizeLabel`       | `string`                                                | No       | Display this formatted size string alongside the filename when provided.             |
| `filename`        | `string`                                                | No       | Display this filename or title when a file is selected.                              |
| `onFileSelect`    | `(file: File) => void`                                  | No       | Call when the user selects a file so the renderer can convert it into an Attachment. |
| `onClear`         | `() => void`                                            | No       | Call when the user requests clearing the current file.                               |

### AnswerAddButton

Action button for adding another answer instance in repeating questions.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the add action.                                                        |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the add action.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### AnswerRemoveButton

Action button for removing an answer instance in repeating questions.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the remove action.                                                     |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the remove action.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### GroupAddButton

Action button for adding another group instance inside a repeating group wrapper.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the add action.                                                        |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the add action.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### GroupRemoveButton

Action button for removing a group instance from a repeating group wrapper.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the remove action.                                                     |
| `disabled` | `boolean`    | Yes      | When true, render the button disabled and prevent the remove action.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### FormSubmitButton

Primary submit action for the form. Render it as a submit control so the form onSubmit fires.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | No       | Invoke the callback passed by the renderer when the user activates the submit control directly.     |
| `disabled` | `boolean`    | No       | When true, render the submit action disabled and prevent submission.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### FormResetButton

Reset action for the form, typically clearing all answers back to their initial values.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user activates the reset action.                                                      |
| `disabled` | `boolean`    | Yes      | When true, render the reset action disabled and prevent reset.                                      |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### OpenChoiceBackButton

Action used when a dropdown open-choice value is active, returning the user to the option list.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user wants to return from custom entry to the option list.                            |
| `disabled` | `boolean`    | Yes      | When true, render the action disabled and prevent switching back.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### MultiSelectSpecifyOtherButton

Action that starts the “specify other” flow for multi-select questions.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user wants to add a custom value outside the options list.                            |
| `disabled` | `boolean`    | Yes      | When true, render the action disabled and prevent entering the flow.                                |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### MultiSelectClearAllButton

Action that clears all current selections for multi-select questions.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user wants to clear every selected value.                                             |
| `disabled` | `boolean`    | Yes      | When true, render the action disabled and prevent clearing values.                                  |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### MultiSelectDialogCancelButton

Cancel action used inside the multi-select dialog.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user cancels the custom-value dialog.                                                 |
| `disabled` | `boolean`    | Yes      | When true, render the cancel action disabled and prevent closing.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### MultiSelectDialogAddButton

Confirm action used inside the multi-select dialog to add a custom value.

| Prop       | Type         | Required | Description                                                                                         |
| ---------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `onClick`  | `() => void` | Yes      | Call when the user confirms adding the custom value.                                                |
| `disabled` | `boolean`    | Yes      | When true, render the confirm action disabled and prevent adding.                                   |
| `children` | `ReactNode`  | No       | Use as the label when you want the renderer's wording; you may ignore it and render your own label. |

### AnswerList

Container that lays out one or more answers for a question and optionally shows the add toolbar.

| Prop       | Type        | Required | Description                                              |
| ---------- | ----------- | -------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the list of answer rows supplied by the renderer. |
| `toolbar`  | `ReactNode` | No       | Render the add‑answer controls when provided.            |

### AnswerScaffold

Per-answer layout that wraps the input control, remove button area, and nested content.

| Prop       | Type        | Required | Description                                                       |
| ---------- | ----------- | -------- | ----------------------------------------------------------------- |
| `control`  | `ReactNode` | Yes      | Render the main input control for this answer instance.           |
| `toolbar`  | `ReactNode` | No       | Render per-answer actions (typically the remove button).          |
| `children` | `ReactNode` | No       | Render nested content such as validation messages or child nodes. |

### QuestionScaffold

Top-level layout wrapper for a question. It hosts the header, the control, and validation output.

| Prop       | Type        | Required | Description                                                                                  |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`   | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `header`   | `ReactNode` | No       | Render the question header (label, help, legal, flyover).                                    |
| `children` | `ReactNode` | Yes      | Render the question body content, including controls and errors.                             |

### GroupWrapperScaffold

Layout wrapper for a repeating group. It surrounds all group instances and the add button.

| Prop       | Type        | Required | Description                                                                                  |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`   | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `header`   | `ReactNode` | No       | Render the header for the repeating group wrapper.                                           |
| `children` | `ReactNode` | Yes      | Render each group instance inside the wrapper.                                               |
| `toolbar`  | `ReactNode` | No       | Render the add‑group controls when provided.                                                 |

### GroupWrapperScaffoldItem

Per-instance layout used inside a repeating group wrapper.

| Prop       | Type        | Required | Description                                              |
| ---------- | ----------- | -------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the group instance body and its child nodes.      |
| `errors`   | `ReactNode` | No       | Render validation errors associated with this instance.  |
| `toolbar`  | `ReactNode` | No       | Render instance-level actions such as the remove button. |

### GroupScaffold

Layout wrapper for a non‑repeating group. It hosts the header and the group’s child nodes.

| Prop          | Type        | Required | Description                                                                                  |
| ------------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`      | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `header`      | `ReactNode` | No       | Render the group header (label, help, legal, flyover).                                       |
| `children`    | `ReactNode` | Yes      | Render the group body content and nested nodes.                                              |
| `dataControl` | `string`    | No       | Use as a style or layout hint for specialized group renderers.                               |

### GroupActions

Container for auxiliary group-level content that should appear after the main group body.

| Prop       | Type        | Required | Description                                                                |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render additional group actions or related nodes provided by the renderer. |

### DisplayRenderer

Renderer for display-only nodes (read-only text blocks).

| Prop       | Type        | Required | Description                                                                                  |
| ---------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `linkId`   | `string`    | Yes      | Use for debugging; typically render as a `data-linkId` attribute and feel free to ignore it. |
| `children` | `ReactNode` | Yes      | Render the display text or markup provided by the renderer.                                  |

### NodeList

Container that lays out a list of rendered nodes (questions, groups, or displays).

| Prop       | Type        | Required | Description                                              |
| ---------- | ----------- | -------- | -------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the node items provided by the renderer in order. |

### FormHeader

Header block for the form, typically containing the questionnaire title and description.

| Prop          | Type        | Required | Description                                           |
| ------------- | ----------- | -------- | ----------------------------------------------------- |
| `title`       | `ReactNode` | No       | Render the form title supplied by the renderer.       |
| `description` | `ReactNode` | No       | Render the form description supplied by the renderer. |

### FormErrors

Form-level error summary shown near the top of the form.

| Prop       | Type       | Required | Description                                           |
| ---------- | ---------- | -------- | ----------------------------------------------------- |
| `messages` | `string[]` | Yes      | Render each string as a top-level form error message. |

### FormSection

Layout section within the form used to group header, footer, or main content blocks.

| Prop       | Type                                                   | Required | Description                                           |
| ---------- | ------------------------------------------------------ | -------- | ----------------------------------------------------- |
| `children` | `ReactNode`                                            | Yes      | Render the content that belongs to this section.      |
| `variant`  | <code>"header" &#124; "footer" &#124; "default"</code> | No       | Use to apply header/footer styling or default layout. |

### FormActions

Container for primary form actions such as submit and reset.

| Prop       | Type        | Required | Description                                                     |
| ---------- | ----------- | -------- | --------------------------------------------------------------- |
| `children` | `ReactNode` | Yes      | Render the action buttons or controls provided by the renderer. |

### Form

Top-level form element that wraps the entire questionnaire.

| Prop       | Type         | Required | Description                                                                |
| ---------- | ------------ | -------- | -------------------------------------------------------------------------- |
| `onSubmit` | `() => void` | No       | Call when the user submits; prevent default yourself if you render a form. |
| `children` | `ReactNode`  | Yes      | Render the full form content inside the form element.                      |

### PageStatus

Status display for paged forms that communicates the current page position.

| Prop      | Type     | Required | Description                                               |
| --------- | -------- | -------- | --------------------------------------------------------- |
| `current` | `number` | Yes      | Render this as the current page number shown to the user. |
| `total`   | `number` | Yes      | Render this as the total number of pages available.       |

### PageNavigation

Navigation controls for moving between pages in a paged form.

| Prop           | Type         | Required | Description                                                  |
| -------------- | ------------ | -------- | ------------------------------------------------------------ |
| `current`      | `number`     | Yes      | Render this as the current page number in the navigation UI. |
| `total`        | `number`     | Yes      | Render this as the total page count in the navigation UI.    |
| `onPrev`       | `() => void` | Yes      | Call when the user activates the previous-page control.      |
| `onNext`       | `() => void` | Yes      | Call when the user activates the next-page control.          |
| `disabledPrev` | `boolean`    | Yes      | When true, render the previous-page control disabled.        |
| `disabledNext` | `boolean`    | Yes      | When true, render the next-page control disabled.            |

### GridTable

Table layout used by grid-based group renderers to show questions in rows and columns.

| Prop      | Type                | Required | Description                                                          |
| --------- | ------------------- | -------- | -------------------------------------------------------------------- |
| `columns` | `GridTableColumn[]` | Yes      | Render these column definitions as table headers.                    |
| `rows`    | `GridTableRow[]`    | Yes      | Render these row definitions, including row labels and cell content. |
| `empty`   | `ReactNode`         | No       | Render this content when there are no rows or columns.               |

### TabContainer

Tabbed container used by group renderers to switch between child group panels.

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

Base option shape used by single-select controls such as select inputs and radio lists.

| Field      | Type      | Required | Description                                                                   |
| ---------- | --------- | -------- | ----------------------------------------------------------------------------- |
| `key`      | `string`  | Yes      | Use as the stable option value to compare against the control’s selected key. |
| `label`    | `string`  | Yes      | Render as the visible label for the option.                                   |
| `disabled` | `boolean` | No       | When true, render the option as unavailable and prevent selection.            |

### OptionEntry

Option shape used by components that need a key, label, and underlying value payload.

| Field      | Type      | Required | Description                                                        |
| ---------- | --------- | -------- | ------------------------------------------------------------------ |
| `key`      | `string`  | Yes      | Use as the stable option identifier when matching selections.      |
| `label`    | `string`  | Yes      | Render as the visible label for the option.                        |
| `value`    | `TValue`  | No       | Provide the associated value payload for the option when needed.   |
| `disabled` | `boolean` | No       | When true, render the option as unavailable and prevent selection. |

### Attachment

Minimal FHIR Attachment shape used by `FileInput` to display metadata and stored content.

| Field         | Type                              | Required | Description                                             |
| ------------- | --------------------------------- | -------- | ------------------------------------------------------- |
| `title`       | `string`                          | No       | Display name or title to show for the attachment.       |
| `url`         | `string`                          | No       | Link target for downloaded or referenced files.         |
| `size`        | <code>number &#124; string</code> | No       | Byte size or preformatted size string used for display. |
| `contentType` | `string`                          | No       | MIME type used for labeling or preview decisions.       |
| `data`        | `string`                          | No       | Base64-encoded file content for inline attachments.     |

### MultiSelectChip

| Field            | Type         | Required | Description                                                        |
| ---------------- | ------------ | -------- | ------------------------------------------------------------------ |
| `key`            | `string`     | Yes      | Use as a stable identifier when rendering and updating chip lists. |
| `content`        | `ReactNode`  | Yes      | Render as the chip’s visible content (usually a value display).    |
| `errors`         | `ReactNode`  | No       | Render as error content associated with this chip.                 |
| `onRemove`       | `() => void` | No       | Call when the user activates the chip’s remove action.             |
| `removeDisabled` | `boolean`    | No       | When true, render the remove action disabled.                      |
| `removeLabel`    | `string`     | No       | Use as the accessible label for the remove control.                |

### MultiSelectDialog

| Field     | Type        | Required | Description                                                |
| --------- | ----------- | -------- | ---------------------------------------------------------- |
| `open`    | `boolean`   | Yes      | Use to control whether the dialog is rendered and visible. |
| `title`   | `string`    | Yes      | Render as the dialog heading.                              |
| `content` | `ReactNode` | Yes      | Render as the dialog body content.                         |
| `actions` | `ReactNode` | Yes      | Render as the dialog footer actions.                       |

### GridTableColumn

| Field   | Type        | Required | Description                                |
| ------- | ----------- | -------- | ------------------------------------------ |
| `key`   | `string`    | Yes      | Use as a stable identifier for the column. |
| `label` | `ReactNode` | Yes      | Render as the column header content.       |

### GridTableRow

| Field   | Type              | Required | Description                                         |
| ------- | ----------------- | -------- | --------------------------------------------------- |
| `key`   | `string`          | Yes      | Use as a stable identifier for the row.             |
| `label` | `ReactNode`       | Yes      | Render as the row label or header cell content.     |
| `cells` | `GridTableCell[]` | Yes      | Render these cells for the row, aligned to columns. |

### GridTableCell

| Field     | Type        | Required | Description                              |
| --------- | ----------- | -------- | ---------------------------------------- |
| `key`     | `string`    | Yes      | Use as a stable identifier for the cell. |
| `content` | `ReactNode` | Yes      | Render as the cell content.              |

### TabItem

| Field      | Type        | Required | Description                                                  |
| ---------- | ----------- | -------- | ------------------------------------------------------------ |
| `key`      | `string`    | Yes      | Use as a stable identifier for the tab.                      |
| `label`    | `ReactNode` | Yes      | Render as the tab button label.                              |
| `buttonId` | `string`    | Yes      | Apply as the tab button id to wire aria-labelledby/controls. |
| `panelId`  | `string`    | Yes      | Apply as the tab panel id to wire aria controls.             |
| `content`  | `ReactNode` | Yes      | Render as the panel content for this tab.                    |
