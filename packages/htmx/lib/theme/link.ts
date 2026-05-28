import type { LinkProperties } from "@formbox/theme";

import { type LinkTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Link(properties: LinkProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  return renderTemplate(templates.Link, {
    href: properties.href,
    target: properties.target,
    rel: properties.rel,
    children: renderHtml(properties.children),
  } satisfies LinkTemplateProperties);
}
