import type { FooterProperties } from "@formbox/theme";

import { type FooterTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Footer(properties: FooterProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  return renderTemplate(templates.Footer, {
    linkId: properties.linkId,
    children: renderHtml(properties.children),
  } satisfies FooterTemplateProperties);
}
