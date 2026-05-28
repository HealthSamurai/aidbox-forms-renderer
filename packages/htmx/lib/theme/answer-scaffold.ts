import { useStrings } from "@formbox/renderer";
import type { AnswerScaffoldProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  actionValue,
  lastLinkId,
  type AnswerScaffoldTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function AnswerScaffold(properties: AnswerScaffoldProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const path = properties.path;
  return renderTemplate(templates.AnswerScaffold, {
    path,
    control: renderHtml(properties.control),
    errors: renderHtml(properties.errors),
    children: renderHtml(properties.children),
    actionName: ACTION_FIELD,
    linkId: path ? lastLinkId(path) : undefined,
    removeAction:
      properties.onRemove !== undefined && properties.canRemove && path
        ? actionValue("remove-answer", path)
        : undefined,
    removeLabel: strings.group.removeSection,
  } satisfies AnswerScaffoldTemplateProperties);
}
