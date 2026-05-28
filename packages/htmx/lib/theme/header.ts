import type { HeaderProperties } from "@formbox/theme";

import { type HeaderTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Header(properties: HeaderProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  return renderTemplate(templates.Header, {
    linkId: properties.linkId,
    children: renderHtml(properties.children),
  } satisfies HeaderTemplateProperties);
}
