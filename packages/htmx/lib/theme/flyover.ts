import { useStrings } from "@formbox/renderer";
import type { FlyoverProperties } from "@formbox/theme";

import { stableId, type FlyoverTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Flyover(properties: FlyoverProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  return renderTemplate(templates.Flyover, {
    id: properties.id,
    buttonId: stableId(properties.id, "button"),
    ariaLabel: strings.aria.flyover,
    children: renderHtml(properties.children),
  } satisfies FlyoverTemplateProperties);
}
