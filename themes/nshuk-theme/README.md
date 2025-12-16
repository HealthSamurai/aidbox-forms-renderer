# @aidbox-forms/nshuk-theme

[NHS-styled](https://service-manual.nhs.uk/design-system) theme for Aidbox Forms Renderer.

## Install

```bash
pnpm add @aidbox-forms/nshuk-theme
```

Include the compiled CSS:

```ts
import "@aidbox-forms/nshuk-theme/style.css";
```

## Usage

```tsx
import Renderer from "@aidbox-forms/renderer";
import { theme } from "@aidbox-forms/nshuk-theme";

<Renderer questionnaire={questionnaire} theme={theme} />;
```
