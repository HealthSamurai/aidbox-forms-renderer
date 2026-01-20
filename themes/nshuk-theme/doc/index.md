---
title: "NHS Design"
order: 4
---

[NHS Design](https://service-manual.nhs.uk/design-system) theme for Formbox Renderer.

## Install

```bash
pnpm add @formbox/nshuk-theme
```

Include the compiled CSS:

```ts
import "@formbox/nshuk-theme/style.css";
```

## Usage

```tsx
import Renderer from "@formbox/renderer";
import { theme } from "@formbox/nshuk-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
