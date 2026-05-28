import type { StackProperties } from "@formbox/theme";

import { type StackTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Stack(properties: StackProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  return renderTemplate(templates.Stack, {
    children: renderHtml(properties.children),
  } satisfies StackTemplateProperties);
}
