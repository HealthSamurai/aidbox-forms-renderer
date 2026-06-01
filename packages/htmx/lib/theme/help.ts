import { useStrings } from "@formbox/renderer";
import type { HelpProperties } from "@formbox/theme";

import { stableId, type HelpTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Help(properties: HelpProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  return renderTemplate(templates.Help, {
    id: properties.id,
    buttonId: stableId(properties.id, "button"),
    ariaLabel: strings.aria.help,
    children: renderHtml(properties.children),
  } satisfies HelpTemplateProperties);
}
