import type { SignatureInputProperties } from "@formbox/theme";

import { type SignatureInputTemplateProperties } from "../template.ts";
import { fieldAttributes } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtmxTheme } from "../theme-runtime.ts";

export function SignatureInput(properties: SignatureInputProperties) {
  const { templates } = useHtmxTheme();
  return renderTemplate(templates.SignatureInput, {
    value: properties.value,
    id: properties.id,
    path: properties.path,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    disabled: properties.disabled,
    inputValue: properties.value ?? "",
    ...fieldAttributes(properties.path, "signature"),
  } satisfies SignatureInputTemplateProperties);
}
