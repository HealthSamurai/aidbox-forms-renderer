import type { NumberInputProperties } from "@formbox/theme";

import { numberTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function NumberInput(properties: NumberInputProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(
    templates.NumberInput,
    numberTemplateProperties(properties),
  );
}
