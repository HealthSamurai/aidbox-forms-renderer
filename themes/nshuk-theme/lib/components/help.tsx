import type { HelpProperties } from "@aidbox-forms/theme";

export function Help({ id, children, ariaLabel }: HelpProperties) {
  return (
    <span className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </span>
  );
}
