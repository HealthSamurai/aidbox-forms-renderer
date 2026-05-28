import type { DateTimeInputProperties } from "@formbox/theme";

import {
  dateTimeLocalInputValue,
  isDateTimeLocalInputValue,
} from "../date-time.ts";
import {
  type DateTimeInputTemplateProperties,
  valueName,
} from "../template.ts";
import { dateTimeConstraint, fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function DateTimeInput(properties: DateTimeInputProperties) {
  const { templates } = useHtmxTheme();
  const value = properties.value;
  const inputValue = dateTimeLocalInputValue(value);
  const inputType =
    inputValue.length === 0 || isDateTimeLocalInputValue(inputValue)
      ? "datetime-local"
      : "text";
  const baselineName = properties.path
    ? valueName(properties.path, "baseline")
    : undefined;

  return renderTemplate(templates.DateTimeInput, {
    id: properties.id,
    path: properties.path,
    value,
    disabled: Boolean(properties.disabled),
    placeholder: properties.placeholder,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    min: properties.min,
    max: properties.max,
    baselineName,
    baselineValue: value && baselineName ? value : undefined,
    inputType,
    step: inputType === "datetime-local" ? "any" : undefined,
    inputValue,
    inputMin:
      inputType === "datetime-local"
        ? dateTimeConstraint(properties.min)
        : undefined,
    inputMax:
      inputType === "datetime-local"
        ? dateTimeConstraint(properties.max)
        : undefined,
    ...fieldAttributes(properties.path, "value"),
  } satisfies DateTimeInputTemplateProperties);
}
