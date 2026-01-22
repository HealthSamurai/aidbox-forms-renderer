---
title: "Renderer"
order: 1
icon: rocket
---

Formbox Renderer is a React renderer for FHIR R5 Questionnaires.

## Install

```bash
pnpm add @formbox/renderer @formbox/hs-theme
```

## Usage

```tsx
import Renderer from "@formbox/renderer";
import { theme } from "@formbox/hs-theme";
import "@formbox/hs-theme/style.css";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
