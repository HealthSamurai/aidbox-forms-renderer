import type { SliderInputProperties } from "@formbox/theme";

import { numberTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function SliderInput(properties: SliderInputProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(
    templates.SliderInput,
    numberTemplateProperties(properties),
  );
}
