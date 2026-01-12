# @aidbox-forms/mantine-theme

Mantine UI theme for Aidbox Forms Renderer.

## Install

```bash
pnpm add @aidbox-forms/mantine-theme
```

Include the compiled CSS:

```ts
import "@aidbox-forms/mantine-theme/style.css";
```

## Usage

Mantine components require `MantineProvider` in the React tree.
This package re-exports it as `Provider` so you can pass any Mantine provider props.

```tsx
import Renderer from "@aidbox-forms/renderer";
import { Provider, theme } from "@aidbox-forms/mantine-theme";

<Provider>
  <Renderer questionnaire={questionnaire} theme={theme} />
</Provider>;
```
