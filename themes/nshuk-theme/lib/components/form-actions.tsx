import type { FormActionsProps } from "@aidbox-forms/theme";

export function FormActions({ children }: FormActionsProps) {
  return <div className="nhsuk-button-group">{children}</div>;
}
