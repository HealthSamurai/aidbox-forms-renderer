import type { NodeHelpProperties } from "@aidbox-forms/theme";

export function NodeHelp({ id, children, ariaLabel }: NodeHelpProperties) {
  return (
    <span className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </span>
  );
}
