import type { RadioButtonListProperties } from "@formbox/theme";

import {
  isDefined,
  isPreservedOptionToken,
  valueName,
  type RadioButtonListTemplateProperties,
  type TemplateOptionItem,
} from "../template.ts";
import {
  fieldAttributes,
  renderOption,
  renderSelectedOption,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function RadioButtonList(properties: RadioButtonListProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
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
  const attributes = fieldAttributes(path, "value");
  const options = [
    ...properties.options.map((option) => renderOption(option, renderHtml)),
    renderOption(properties.specifyOtherOption, renderHtml),
  ].filter((option): option is TemplateOptionItem => isDefined(option));

  return renderTemplate(templates.RadioButtonList, {
    id: properties.id,
    path,
    selectedOption,
    orientation: properties.orientation,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: Boolean(properties.disabled),
    isLoading: properties.isLoading,
    baselineName,
    baselineValue:
      preserveValue && selectedToken && baselineName
        ? selectedToken
        : undefined,
    hiddenValue:
      (preserveValue || mirrorValue) && selectedToken && attributes.name
        ? selectedToken
        : undefined,
    options: options.map((option) => ({
      ...option,
      checked: option.token === selectedToken,
      disabled: Boolean(properties.disabled) || Boolean(option.disabled),
    })),
    specifyOtherOption: renderOption(properties.specifyOtherOption, renderHtml),
    customOptionForm: renderHtml(properties.customOptionForm),
    ...attributes,
  } satisfies RadioButtonListTemplateProperties);
}
