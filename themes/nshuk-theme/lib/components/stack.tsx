import type { StackProperties } from "@formbox/theme";

export function Stack({ children }: StackProperties) {
  return <div className="nhsuk-form-group">{children}</div>;
}
