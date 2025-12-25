import type { NodeHelpProps } from "@aidbox-forms/theme";

export function NodeHelp({ id, children, ariaLabel }: NodeHelpProps) {
  return (
    <span className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </span>
  );
}
