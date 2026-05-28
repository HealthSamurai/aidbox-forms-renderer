import type { CheckboxListProperties } from "@formbox/theme";

import {
  isDefined,
  isPreservedOptionToken,
  selectedName,
  valueName,
  type CheckboxListTemplateProperties,
  type TemplateOptionItem,
} from "../template.ts";
import {
  fieldAttributes,
  hiddenInputs,
  renderOption,
  renderSelectedOption,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function CheckboxList(properties: CheckboxListProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const path = properties.path;
  const attributes = fieldAttributes(path, "value");
  const baselineName = path ? valueName(path, "baseline") : undefined;
  const selectedOptions = properties.selectedOptions.map((option) =>
    renderSelectedOption(option, renderHtml),
  );
  const selectedTokens = new Set(
    selectedOptions.map((option) => String(option.token)),
  );
  const specifyOtherOption = renderOption(
    properties.specifyOtherOption,
    renderHtml,
  );
  if (properties.customOptionForm && specifyOtherOption) {
    selectedTokens.add(specifyOtherOption.token);
  }

  const options = [
    ...properties.options.map((option) => renderOption(option, renderHtml)),
    specifyOtherOption,
  ].filter((option): option is TemplateOptionItem => isDefined(option));
  const preservedOptions = selectedOptions.filter(
    (option) => properties.disabled || option.disabled,
  );
  const mirroredOptions = selectedOptions.filter(
    (option) =>
      !preservedOptions.includes(option) &&
      isPreservedOptionToken(option.token),
  );
  const preservedByToken = new Map(
    preservedOptions.map((option) => [option.token, option]),
  );
  const optionTokens = new Set(options.map((option) => option.token));
  const extraPreservedOptions = preservedOptions.filter(
    (option) => !optionTokens.has(option.token),
  );
  const name = attributes.name;

  return renderTemplate(templates.CheckboxList, {
    id: properties.id,
    path,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: properties.disabled,
    isLoading: properties.isLoading,
    baselineName,
    orientation: properties.orientation,
    options: options.map((option) => ({
      ...option,
      selected: selectedTokens.has(option.token),
      disabled: Boolean(properties.disabled) || option.disabled,
      hiddenInput:
        name && preservedByToken.has(option.token)
          ? { name, value: option.token }
          : undefined,
    })),
    selectedOptions,
    hiddenInputs: [
      ...hiddenInputs(path ? selectedName(path) : undefined, selectedOptions),
      ...hiddenInputs(baselineName, preservedOptions),
      ...(name ? [{ name, value: "" }] : []),
      ...hiddenInputs(name, mirroredOptions),
    ],
    trailingHiddenInputs: hiddenInputs(name, extraPreservedOptions),
    selectedName: path ? selectedName(path) : undefined,
    specifyOtherOption,
    customOptionForm: renderHtml(properties.customOptionForm),
    ...attributes,
  } satisfies CheckboxListTemplateProperties);
}
