import type { LegalProperties } from "@formbox/theme";

export function Legal({ id, children, ariaLabel }: LegalProperties) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
