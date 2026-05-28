import { useStrings } from "@formbox/renderer";
import type { HelpProperties } from "@formbox/theme";

import { type HelpTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Help(properties: HelpProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  return renderTemplate(templates.Help, {
    id: properties.id,
    ariaLabel: strings.aria.help,
    children: renderHtml(properties.children),
  } satisfies HelpTemplateProperties);
}
