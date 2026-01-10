import type { NodeLegalProperties } from "@aidbox-forms/theme";

export function NodeLegal({ id, children, ariaLabel }: NodeLegalProperties) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
