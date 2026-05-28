import type { TabContainerProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  actionValue,
  tabName,
  type TabContainerTemplateProperties,
} from "../template.ts";
import { withLastIndex } from "../path.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function TabContainer(properties: TabContainerProperties) {
  const { activeTabValue, templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const path = properties.path;
  const value = path
    ? activeTabValue(path, properties.items.length)
    : properties.value;
  const items = properties.items.map((item, index) => ({
    token: item.token,
    buttonId: item.buttonId,
    panelId: item.panelId,
    label: renderHtml(item.label),
    content: renderHtml(item.content),
    selected: index === value,
    ariaSelected: index === value ? ("true" as const) : ("false" as const),
    tabAction: path
      ? actionValue("select-tab", withLastIndex(path, index))
      : undefined,
  }));
  return renderTemplate(templates.TabContainer, {
    path,
    header: renderHtml(properties.header),
    errors: renderHtml(properties.errors),
    value,
    linkId: properties.linkId,
    items,
    active: items[value],
    actionName: path ? ACTION_FIELD : undefined,
    tabName: path ? tabName(path) : undefined,
  } satisfies TabContainerTemplateProperties);
}
