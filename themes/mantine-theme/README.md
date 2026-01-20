# @formbox/mantine-theme

Mantine theme for Formbox Renderer.

## Install

```bash
pnpm add @formbox/mantine-theme
```

Include the compiled CSS:

```ts
import "@formbox/mantine-theme/style.css";
```

## Usage

Mantine components require `MantineProvider` in the React tree.
This package re-exports it as `Provider` so you can pass any Mantine provider props.

```tsx
import Renderer from "@formbox/renderer";
import { Provider, theme } from "@formbox/mantine-theme";

<Provider>
  <Renderer questionnaire={questionnaire} theme={theme} />
</Provider>;
```
