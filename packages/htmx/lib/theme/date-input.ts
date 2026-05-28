import type { DateInputProperties } from "@formbox/theme";

import { type DateInputTemplateProperties } from "../template.ts";
import { fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function DateInput(properties: DateInputProperties) {
  const { templates } = useHtmxTheme();
  const inputType =
    properties.value.length === 0 ||
    /^\d{4}-\d{2}-\d{2}$/u.test(properties.value)
      ? "date"
      : "text";
  return renderTemplate(templates.DateInput, {
    id: properties.id,
    path: properties.path,
    value: properties.value,
    disabled: Boolean(properties.disabled),
    placeholder: properties.placeholder,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    min: properties.min,
    max: properties.max,
    inputType,
    step: undefined,
    ...fieldAttributes(properties.path, "value"),
  } satisfies DateInputTemplateProperties);
}
