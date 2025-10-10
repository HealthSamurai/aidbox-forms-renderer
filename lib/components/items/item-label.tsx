import type { QuestionnaireItem } from "fhir/r5";
import type { ReactNode } from "react";

export function renderItemLabel(
  item: QuestionnaireItem,
  inputId: string,
  className = "q-item-label",
): ReactNode {
  return (
    <label className={className} htmlFor={inputId}>
      {item.prefix ? <span className="q-item-prefix">{item.prefix} </span> : null}
      <span>{item.text ?? item.linkId}</span>
      {item.required ? <span className="q-item-required">*</span> : null}
    </label>
  );
}
