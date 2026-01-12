# @aidbox-forms/antd-theme

Ant Design theme for Aidbox Forms Renderer.

## Install

```bash
pnpm add @aidbox-forms/antd-theme
```

Include the compiled CSS:

```ts
import "@aidbox-forms/antd-theme/style.css";
```

## Usage

```tsx
import Renderer from "@aidbox-forms/renderer";
import { theme } from "@aidbox-forms/antd-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
