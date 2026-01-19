---
title: Behavior
order: 2
icon: settings
---

## Accessibility contract

- `ariaLabelledBy` and `ariaDescribedBy` are already-composed, space-separated id strings. Attach them verbatim to the
  focusable element; do not join or parse them.
- `Label` receives `id` for the label element id. Apply it to the element that wraps the visible label text so controls
  can reference it via `aria-labelledby`.
- When `id` is provided, set it on the primary focusable element. For composite widgets, choose the element that
  receives keyboard focus.
- `ariaDescribedBy` references the rendered `Help` and `Errors` ids. Keep those elements in the DOM when you render
  them. Legal and flyover content is not included in `ariaDescribedBy` by default, so ensure it remains accessible in
  your layout.
- For `TabContainer`, follow the WAI-ARIA tab pattern: `role="tablist"` on the container, `role="tab"` on each tab with
  `id={buttonId}`, `role="tabpanel"` on each panel with `id={panelId}`, and wire `aria-controls`/`aria-labelledby`.
- For custom select or multiselect widgets, follow standard combobox/listbox roles and keyboard interactions (Arrow
  keys, Enter/Space to select, Escape to close) when you are not using native inputs.

## Controlled-value contract

All inputs are controlled; callbacks receive values, not DOM events.

- TextInput/TextArea: pass the raw string; empty string stays empty string.
- NumberInput/SpinnerInput/SliderInput: parse to `number` or `undefined`. Use `undefined` when the field is empty or
  invalid; do not pass strings.
- DateInput/DateTimeInput/TimeInput: treat the value as an opaque string and return it as entered. Do not normalize,
  format, or shift timezones.
- Select/Radio: `selectedOption = undefined` means no selection. Call `onChange(token | undefined)` for changes.
- CheckboxList/MultiSelect: treat `selectedOptions[].token` as the selected set. Call `onSelect` or `onDeselect` once per
  user action and do not reorder the provided selections.

## Disabled behavior

- When `disabled` is true, render the UI as disabled and suppress all callbacks.
- Native inputs: use the `disabled` attribute.
- Custom widgets: set `aria-disabled="true"`, remove from the tab order (`tabIndex={-1}`), and ignore pointer/keyboard
  events.
- Disabled options should remain visible and announced as disabled.
- If an add/remove action is provided with `canAdd={false}` or `canRemove={false}`, render it disabled rather than
  hiding it.

## Options and custom options lifecycle

- Tokens are stable for a given option or selection; it is safe to use them as React keys.
- `SelectedOptionItem.label` may not match the current options list (legacy or custom values). Render it as provided.
- The renderer may include disabled legacy options in `options` to keep stored answers visible. Treat them as normal
  options, but disabled.
- `specifyOtherOption` is an extra option row. When the user selects it, the renderer enters a custom-entry state and
  provides `customOptionForm`.
- `customOptionForm` is present only while custom entry is active. Render it near the options list or in place of it;
  use its `submit` and `cancel` actions to finish or return to the list.
- `isLoading` can be true while options fetch. The renderer may also render `OptionsLoading` in the question scaffold;
  handle both without duplicating spinners.

## Repeating items contract

- `AnswerList` renders one or more `AnswerScaffold` entries; when `onAdd` is provided it should render add-answer
  controls.
- `AnswerScaffold.onRemove` is provided for repeating questions; render a remove action next to the control and disable
  it when `canRemove` is false.
- `AnswerScaffold.errors` is provided for per-answer validation; render it near the answer content (it may render
  nothing).
- `GroupList` renders a list of group instances (`GroupScaffold`) and can show an add control when `onAdd`
  is provided.
- `GroupScaffold` should render a remove action when `onRemove` is provided; use `canRemove` to disable.
