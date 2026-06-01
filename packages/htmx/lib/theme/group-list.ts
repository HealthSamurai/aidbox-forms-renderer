import { Children } from "react";
import { useStrings } from "@formbox/renderer";
import type { GroupListProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  actionValue,
  countName,
  pathControlId,
  type GroupListTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function GroupList(properties: GroupListProperties) {
  const { templates, token } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const groups = Children.toArray(properties.children);
  const path = properties.path;
  const count =
    typeof properties.count === "number" ? properties.count : groups.length;
  return renderTemplate(templates.GroupList, {
    linkId: properties.linkId,
    path,
    customExtensions: properties.customExtensions,
    header: renderHtml(properties.header),
    errors: renderHtml(properties.errors),
    children: renderHtml(properties.children),
    actionName: ACTION_FIELD,
    addAction:
      properties.onAdd !== undefined && properties.canAdd && path
        ? actionValue("add-group", path)
        : undefined,
    addId: pathControlId(token, path, "add-group"),
    addLabel: strings.group.addSection,
    count: path ? count : undefined,
    countName: path ? countName(path) : undefined,
    hasCount: path !== undefined,
  } satisfies GroupListTemplateProperties);
}
