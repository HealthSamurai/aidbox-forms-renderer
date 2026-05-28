import { useStrings } from "@formbox/renderer";
import type { LegalProperties } from "@formbox/theme";

import { type LegalTemplateProperties } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Legal(properties: LegalProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  return renderTemplate(templates.Legal, {
    id: properties.id,
    ariaLabel: strings.aria.legal,
    children: renderHtml(properties.children),
  } satisfies LegalTemplateProperties);
}
