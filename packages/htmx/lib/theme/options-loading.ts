import { useStrings } from "@formbox/renderer";
import type { OptionsLoadingProperties } from "@formbox/theme";

import { type OptionsLoadingTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function OptionsLoading(properties: OptionsLoadingProperties) {
  const { templates } = useHtmxTheme();
  const strings = useStrings();
  return renderTemplate(templates.OptionsLoading, {
    isLoading: properties.isLoading,
    loadingLabel: strings.selection.loadingOptions,
  } satisfies OptionsLoadingTemplateProperties);
}
