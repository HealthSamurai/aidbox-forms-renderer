import type { EmptyStateProps } from "@aidbox-forms/theme";

export function EmptyState({ children }: EmptyStateProps) {
  return <p className="nhsuk-hint">{children}</p>;
}
