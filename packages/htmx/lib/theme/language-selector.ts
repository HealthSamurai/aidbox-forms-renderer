import type { LanguageSelectorProperties } from "@formbox/theme";

import {
  LANGUAGE_FIELD,
  type LanguageSelectorTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function LanguageSelector(properties: LanguageSelectorProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(templates.LanguageSelector, {
    value: properties.value,
    name: LANGUAGE_FIELD,
    options: properties.options.map((option) => ({
      ...option,
      selected: option.value === properties.value,
    })),
  } satisfies LanguageSelectorTemplateProperties);
}
