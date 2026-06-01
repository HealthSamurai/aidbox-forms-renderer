import { useStrings } from "@formbox/renderer";
import type { CustomOptionFormProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  stableId,
  type CustomOptionFormTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function CustomOptionForm(properties: CustomOptionFormProperties) {
  const { templates, token } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const id = properties.id ?? stableId(token, "custom-option-form");
  return renderTemplate(templates.CustomOptionForm, {
    id,
    canSubmit: properties.canSubmit,
    actionName: ACTION_FIELD,
    cancelLabel: strings.dialog.cancel,
    cancelId: stableId(id, "cancel"),
    content: renderHtml(properties.content),
    errors: renderHtml(properties.errors),
    submitId: stableId(id, "submit"),
    submitLabel: strings.dialog.submit,
  } satisfies CustomOptionFormTemplateProperties);
}
