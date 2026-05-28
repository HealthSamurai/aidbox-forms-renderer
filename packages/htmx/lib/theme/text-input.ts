import type { TextInputProperties } from "@formbox/theme";

import { type TextInputTemplateProperties } from "../template.ts";
import { fieldAttributes, inferTextField } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme, useInputGroup } from "../theme-runtime.ts";

export function TextInput(properties: TextInputProperties) {
  const { templates } = useHtmxTheme();
  const inputGroup = useInputGroup();
  const field = inferTextField(properties.id, inputGroup);
  return renderTemplate(templates.TextInput, {
    id: properties.id,
    path: properties.path,
    type: properties.type,
    value: properties.value,
    disabled: Boolean(properties.disabled),
    placeholder: properties.placeholder,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    inputMode: properties.inputMode,
    minLength: properties.minLength,
    maxLength: properties.maxLength,
    inputType: properties.type ?? "text",
    ...fieldAttributes(properties.path, field),
  } satisfies TextInputTemplateProperties);
}
