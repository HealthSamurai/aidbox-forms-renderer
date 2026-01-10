import type { EmptyStateProperties } from "@aidbox-forms/theme";

export function EmptyState({ children }: EmptyStateProperties) {
  return <p className="nhsuk-hint">{children}</p>;
}
