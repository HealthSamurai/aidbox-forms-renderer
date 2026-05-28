import { useStrings } from "@formbox/renderer";
import type { OptionDisplayProperties } from "@formbox/theme";

import {
  escapeHtml,
  mediaHtml,
  type OptionDisplayTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function OptionDisplay(properties: OptionDisplayProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  return renderTemplate(templates.OptionDisplay, {
    prefix:
      properties.prefix === undefined
        ? undefined
        : escapeHtml(properties.prefix),
    media: mediaHtml(properties.media, strings.inputs.attachmentLabel),
    attachmentLabel: strings.inputs.attachmentLabel,
    children: renderHtml(properties.children),
  } satisfies OptionDisplayTemplateProperties);
}
