import { useStrings } from "@formbox/renderer";
import type { SelectInputProperties } from "@formbox/theme";

import {
  escapeHtml,
  isDefined,
  isPreservedOptionToken,
  searchName,
  valueName,
  type SelectInputTemplateProperties,
  type TemplateOptionItem,
} from "../template.ts";
import {
  fieldAttributes,
  renderOption,
  renderSelectedOption,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function SelectInput(properties: SelectInputProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const selectedOption = renderSelectedOption(
    properties.selectedOption,
    renderHtml,
  );
  const selectedToken = selectedOption?.token;
  const preserveValue =
    Boolean(properties.disabled) || selectedOption?.disabled === true;
  const mirrorValue =
    !preserveValue &&
    selectedToken !== undefined &&
    isPreservedOptionToken(selectedToken);
  const path = properties.path;
  const baselineName = path ? valueName(path, "baseline") : undefined;
  const field = properties.id.endsWith("__unit")
    ? ("unit" as const)
    : ("value" as const);
  const options = [
    properties.placeholder
      ? {
          token: "",
          label: escapeHtml(properties.placeholder),
          disabled: false,
          exclusive: false,
        }
      : undefined,
    ...properties.options.map((option) => renderOption(option, renderHtml)),
    renderOption(properties.specifyOtherOption, renderHtml),
  ].filter((option): option is TemplateOptionItem => isDefined(option));
  const value = selectedToken ?? "";

  return renderTemplate(templates.SelectInput, {
    id: properties.id,
    path,
    searchQuery: properties.searchQuery,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: Boolean(properties.disabled),
    isLoading: properties.isLoading,
    placeholder: properties.placeholder,
    baselineName,
    baselineValue:
      preserveValue && selectedToken && baselineName
        ? selectedToken
        : undefined,
    hiddenValue:
      (preserveValue || mirrorValue) &&
      fieldAttributes(path, field).name !== undefined,
    isBusy: properties.isLoading ? "true" : undefined,
    searchLabel: strings.selection.searchPlaceholder,
    searchName:
      properties.onSearch !== undefined && path ? searchName(path) : undefined,
    value,
    options: options.map((option) => ({
      ...option,
      selected: option.token === value,
    })),
    selectedOption,
    specifyOtherOption: renderOption(properties.specifyOtherOption, renderHtml),
    customOptionForm: renderHtml(properties.customOptionForm),
    ...fieldAttributes(path, field),
  } satisfies SelectInputTemplateProperties);
}
