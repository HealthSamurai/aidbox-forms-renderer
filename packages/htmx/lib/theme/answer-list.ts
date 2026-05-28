import { Children } from "react";
import { useStrings } from "@formbox/renderer";
import type { AnswerListProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  actionValue,
  countName,
  lastLinkId,
  type AnswerListTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function AnswerList(properties: AnswerListProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const children = Children.toArray(properties.children);
  const path = properties.path;
  return renderTemplate(templates.AnswerList, {
    path,
    children: renderHtml(properties.children),
    actionName: ACTION_FIELD,
    addAction:
      properties.onAdd !== undefined && properties.canAdd && path
        ? actionValue("add-answer", path)
        : undefined,
    addLabel: strings.selection.addAnother,
    count: path ? children.length : undefined,
    countName: path ? countName(path) : undefined,
    hasCount: path !== undefined,
    linkId: path ? lastLinkId(path) : undefined,
  } satisfies AnswerListTemplateProperties);
}
