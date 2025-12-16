import type { NodeHelpProps } from "@aidbox-forms/theme";

export function NodeHelp({ id, content, ariaLabel }: NodeHelpProps) {
  return (
    <span className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {content}
    </span>
  );
}
