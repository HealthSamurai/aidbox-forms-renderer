import type { RadioButtonProperties } from "@formbox/theme";

import { type RadioButtonTemplateProperties } from "../template.ts";
import { fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function RadioButton(properties: RadioButtonProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const attributes = fieldAttributes(properties.path, "value");
  return renderTemplate(templates.RadioButton, {
    id: properties.id,
    path: properties.path,
    groupName: properties.groupName,
    value: properties.value,
    checked: properties.checked,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: Boolean(properties.disabled),
    label: renderHtml(properties.label),
    hiddenValue:
      properties.disabled && properties.checked && attributes.name
        ? properties.value
        : undefined,
    ...attributes,
  } satisfies RadioButtonTemplateProperties);
}
