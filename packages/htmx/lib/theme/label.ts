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
  const content = [
    prefix === undefined ? "" : `<span>${prefix} </span>`,
    properties.shortText === undefined
      ? children
      : `<span data-fb-label-full>${children}</span><span data-fb-label-short>${escapeHtml(properties.shortText)}</span>`,
    properties.required ? '<span aria-hidden="true"> *</span>' : "",
    renderHtml(properties.help),
    renderHtml(properties.legal),
    renderHtml(properties.flyover),
  ].join("");

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
    help: renderHtml(properties.help),
    legal: renderHtml(properties.legal),
    flyover: renderHtml(properties.flyover),
    media: mediaHtml(
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
