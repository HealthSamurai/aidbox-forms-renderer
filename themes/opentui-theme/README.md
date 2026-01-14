# @aidbox-forms/opentui-theme

OpenTUI (`@opentui/react`) theme for `@aidbox-forms/renderer`.

This theme is intended for terminal UI demos and CLIs.

## Usage

```ts
import Renderer from "@aidbox-forms/renderer";
import { Provider as FocusProvider, theme as opentuiTheme } from "@aidbox-forms/opentui-theme";

export function App({ questionnaire }) {
  return (
    <FocusProvider>
      <Renderer questionnaire={questionnaire} theme={opentuiTheme} />
    </FocusProvider>
  );
}
```

The `FocusProvider` is required so inputs can receive focus and Tab/Shift+Tab navigation works.

## Notes

- Attachments: upload is not supported in terminal (TBD). `FileInput` is display-only and never calls `onChange`.

## TBD

- Proper table/grid layout for `Table` (current implementation is a readable vertical layout).
- Richer widgets for number spinner/slider (current implementation is an input-based fallback).
- Better accessibility mapping for `aria*` props (no native ARIA in TUI).
- Theme-level styling configuration.
