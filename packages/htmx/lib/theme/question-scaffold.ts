import { useStrings } from "@formbox/renderer";
import type { QuestionScaffoldProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  actionValue,
  expandedName as expandedFieldName,
  type QuestionScaffoldTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function QuestionScaffold(properties: QuestionScaffoldProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const path = properties.path;
  const expandedName =
    properties.isExpandable === true && path
      ? expandedFieldName(path)
      : undefined;
  const toggleAction =
    properties.isExpandable === true && path
      ? actionValue("toggle-expanded", path)
      : undefined;
  return renderTemplate(templates.QuestionScaffold, {
    linkId: properties.linkId,
    path,
    header: renderHtml(properties.header),
    children: renderHtml(properties.children),
    errors: renderHtml(properties.errors),
    signature: renderHtml(properties.signature),
    isExpandable: properties.isExpandable,
    isExpanded: properties.isExpanded,
    customExtensions: properties.customExtensions,
    actionName: ACTION_FIELD,
    collapseLabel: strings.collapsible.collapse,
    expandedName,
    expandedValue: expandedName
      ? String(Boolean(properties.isExpanded))
      : undefined,
    expandLabel: strings.collapsible.expand,
    toggleAction,
    summaryLabel: properties.isExpanded
      ? strings.collapsible.collapse
      : strings.collapsible.expand,
    expandedChildren: properties.isExpanded
      ? renderHtml(properties.children)
      : "",
  } satisfies QuestionScaffoldTemplateProperties);
}
