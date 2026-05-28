import type { CheckboxProperties } from "@formbox/theme";

import { type CheckboxTemplateProperties } from "../template.ts";
import { checkboxHiddenValue, fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Checkbox(properties: CheckboxProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const checkedValue = properties.checkedValue ?? "true";
  return renderTemplate(templates.Checkbox, {
    id: properties.id,
    path: properties.path,
    checkedValue,
    uncheckedValue: properties.uncheckedValue,
    checked: properties.checked,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: Boolean(properties.disabled),
    label: renderHtml(properties.label),
    hiddenValue: checkboxHiddenValue(properties, checkedValue),
    ...fieldAttributes(properties.path, "value"),
  } satisfies CheckboxTemplateProperties);
}
