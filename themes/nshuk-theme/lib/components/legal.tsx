import type { LegalProperties } from "@aidbox-forms/theme";

export function Legal({ id, children, ariaLabel }: LegalProperties) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
