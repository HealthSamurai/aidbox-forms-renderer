import type { StackProperties } from "@aidbox-forms/theme";

export function Stack({ children }: StackProperties) {
  return <div className="nhsuk-form-group">{children}</div>;
}
