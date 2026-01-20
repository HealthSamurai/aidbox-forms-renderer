# @formbox/antd-theme

Ant Design theme for Formbox Renderer.

## Install

```bash
pnpm add @formbox/antd-theme
```

Include the compiled CSS:

```ts
import "@formbox/antd-theme/style.css";
```

## Usage

```tsx
import Renderer from "@formbox/renderer";
import { theme } from "@formbox/antd-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
