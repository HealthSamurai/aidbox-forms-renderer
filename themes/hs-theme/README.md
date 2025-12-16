# @aidbox-forms/hs-theme

Health Samurai–styled theme for Aidbox Forms Renderer.

## Install

```bash
pnpm add @aidbox-forms/hs-theme
```

Include the compiled CSS:

```ts
import "@aidbox-forms/hs-theme/style.css";
```

## Usage

```tsx
import Renderer from "@aidbox-forms/renderer";
import { theme } from "@aidbox-forms/hs-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
