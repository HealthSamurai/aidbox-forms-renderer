import { useStrings } from "@formbox/renderer";
import type { GroupScaffoldProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  actionValue,
  expandedName as expandedFieldName,
  lastLinkId,
  type GroupScaffoldTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function GroupScaffold(properties: GroupScaffoldProperties) {
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
  return renderTemplate(templates.GroupScaffold, {
    linkId: properties.linkId ?? (path ? lastLinkId(path) : undefined),
    path,
    customExtensions: properties.customExtensions,
    header: renderHtml(properties.header),
    children: renderHtml(properties.children),
    errors: renderHtml(properties.errors),
    signature: renderHtml(properties.signature),
    isExpandable: properties.isExpandable,
    isExpanded: properties.isExpanded,
    canRemove: properties.canRemove,
    actionName: ACTION_FIELD,
    collapseLabel: strings.collapsible.collapse,
    expandedName,
    expandedValue: expandedName
      ? String(Boolean(properties.isExpanded))
      : undefined,
    expandLabel: strings.collapsible.expand,
    removeAction:
      properties.onRemove !== undefined && properties.canRemove && path
        ? actionValue("remove-group", path)
        : undefined,
    removeLabel: strings.group.removeSection,
    toggleAction,
    summaryLabel: properties.isExpanded
      ? strings.collapsible.collapse
      : strings.collapsible.expand,
    expandedChildren: properties.isExpanded
      ? renderHtml(properties.children)
      : "",
  } satisfies GroupScaffoldTemplateProperties);
}
