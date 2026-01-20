---
title: "Health Samurai"
order: 2
---

Health Samurai-styled theme for Formbox Renderer.

## Install

```bash
pnpm add @formbox/hs-theme
```

Include the compiled CSS:

```ts
import "@formbox/hs-theme/style.css";
```

## Usage

```tsx
import Renderer from "@formbox/renderer";
import { theme } from "@formbox/hs-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
