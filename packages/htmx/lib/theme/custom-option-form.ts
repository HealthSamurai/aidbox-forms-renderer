import { useStrings } from "@formbox/renderer";
import type { CustomOptionFormProperties } from "@formbox/theme";

import {
  ACTION_FIELD,
  type CustomOptionFormTemplateProperties,
} from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function CustomOptionForm(properties: CustomOptionFormProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  return renderTemplate(templates.CustomOptionForm, {
    canSubmit: properties.canSubmit,
    actionName: ACTION_FIELD,
    cancelLabel: strings.dialog.cancel,
    content: renderHtml(properties.content),
    errors: renderHtml(properties.errors),
    submitLabel: strings.dialog.submit,
  } satisfies CustomOptionFormTemplateProperties);
}
