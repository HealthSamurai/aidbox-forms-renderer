import type { NodeLegalProps } from "@aidbox-forms/theme";

export function NodeLegal({ id, children, ariaLabel }: NodeLegalProps) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
