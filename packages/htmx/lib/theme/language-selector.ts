import type { LanguageSelectorProperties } from "@formbox/theme";

import {
  LANGUAGE_FIELD,
  stableId,
  type LanguageSelectorTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function LanguageSelector(properties: LanguageSelectorProperties) {
  const { templates, token } = useHtmxTheme();
  return renderTemplate(templates.LanguageSelector, {
    id: properties.id ?? stableId(token, "language"),
    value: properties.value,
    name: LANGUAGE_FIELD,
    options: properties.options.map((option) => ({
      ...option,
      selected: option.value === properties.value,
    })),
  } satisfies LanguageSelectorTemplateProperties);
}
