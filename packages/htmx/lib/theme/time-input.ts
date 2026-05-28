import type { TimeInputProperties } from "@formbox/theme";

import { type TimeInputTemplateProperties } from "../template.ts";
import { fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function TimeInput(properties: TimeInputProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(templates.TimeInput, {
    id: properties.id,
    path: properties.path,
    value: properties.value,
    disabled: Boolean(properties.disabled),
    placeholder: properties.placeholder,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    min: properties.min,
    max: properties.max,
    ...fieldAttributes(properties.path, "value"),
  } satisfies TimeInputTemplateProperties);
}
