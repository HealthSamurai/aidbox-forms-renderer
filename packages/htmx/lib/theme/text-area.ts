import type { TextAreaProperties } from "@formbox/theme";

import { type TextAreaTemplateProperties } from "../template.ts";
import { fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function TextArea(properties: TextAreaProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(templates.TextArea, {
    id: properties.id,
    path: properties.path,
    value: properties.value,
    disabled: Boolean(properties.disabled),
    placeholder: properties.placeholder,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    inputMode: properties.inputMode,
    minLength: properties.minLength,
    maxLength: properties.maxLength,
    ...fieldAttributes(properties.path, "value"),
  } satisfies TextAreaTemplateProperties);
}
