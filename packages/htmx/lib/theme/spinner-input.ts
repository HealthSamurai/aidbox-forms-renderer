import type { SpinnerInputProperties } from "@formbox/theme";

import { numberTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function SpinnerInput(properties: SpinnerInputProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(
    templates.SpinnerInput,
    numberTemplateProperties(properties),
  );
}
