import { useStrings } from "@formbox/renderer";
import type { FileInputProperties } from "@formbox/theme";

import { stableId, type FileInputTemplateProperties } from "../template.ts";
import { fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function FileInput(properties: FileInputProperties) {
  const { templates } = useHtmxTheme();
  const strings = useStrings();
  const attributes = fieldAttributes(properties.path, "value");
  return renderTemplate(templates.FileInput, {
    value: properties.value,
    id: properties.id,
    path: properties.path,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: properties.disabled,
    accept: properties.accept,
    clearLabel: strings.file.clearAction,
    clearId: stableId(properties.id, "clear"),
    hiddenValue:
      properties.value && attributes.name
        ? JSON.stringify(properties.value)
        : undefined,
    clearAction:
      properties.value !== undefined &&
      attributes.name !== undefined &&
      !properties.disabled,
    dataLinkId: attributes["data-fb-link-id"],
    hxInclude: attributes["hx-include"],
    ...attributes,
  } satisfies FileInputTemplateProperties);
}
