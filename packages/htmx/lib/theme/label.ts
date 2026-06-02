import { useStrings } from "@formbox/renderer";
import type { LabelProperties } from "@formbox/theme";

import {
  escapeHtml,
  mediaHtml,
  stableId,
  type LabelTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Label(properties: LabelProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const children = renderHtml(properties.children);
  const prefix =
    properties.prefix === undefined ? undefined : renderHtml(properties.prefix);
  const help = renderHtml(properties.help);
  const legal = renderHtml(properties.legal);
  const flyover = renderHtml(properties.flyover);
  const content = templates.LabelContent({
    children,
    prefix,
    shortText: properties.shortText,
    required: properties.required,
    help,
    legal,
    flyover,
    hasShortText: properties.shortText !== undefined,
  });

  return renderTemplate(templates.Label, {
    shortText: properties.shortText,
    isExpanded: properties.isExpanded,
    children,
    id: properties.id,
    htmlFor: properties.htmlFor,
    required: properties.required,
    as: properties.as,
    attachmentLabel: strings.inputs.attachmentLabel,
    prefix,
    content,
    isLegend: properties.as === "legend",
    isText: properties.as === "text",
    help,
    legal,
    flyover,
    media: mediaHtml(
      templates,
      properties.media,
      strings.inputs.attachmentLabel,
      stableId(properties.id, "media"),
    ),
    ...(properties.supportHyperlinks
      ? {
          supportHyperlinks: properties.supportHyperlinks.map(
            (link, index) => ({
              ...link,
              id: stableId(properties.id, "support", index) ?? String(index),
              labelHtml: escapeHtml(link.label || link.href),
            }),
          ),
        }
      : {}),
  } satisfies LabelTemplateProperties);
}
