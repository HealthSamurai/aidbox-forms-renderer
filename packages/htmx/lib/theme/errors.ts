import type { ErrorsProperties } from "@formbox/theme";

import { escapeHtml, type ErrorsTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function Errors(properties: ErrorsProperties) {
  const { templates } = useHtmxTheme();
  const messages = properties.messages.map((message) => ({
    html: escapeHtml(message),
  }));
  return renderTemplate(templates.Errors, {
    id: properties.id,
    hasMessages: messages.length > 0,
    messages,
  } satisfies ErrorsTemplateProperties);
}
