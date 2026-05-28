import type { DisplayRendererProperties } from "@formbox/theme";

import { type DisplayRendererTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function DisplayRenderer(properties: DisplayRendererProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  return renderTemplate(templates.DisplayRenderer, {
    linkId: properties.linkId,
    customExtensions: properties.customExtensions,
    children: renderHtml(properties.children),
  } satisfies DisplayRendererTemplateProperties);
}
