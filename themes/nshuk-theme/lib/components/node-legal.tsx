import type { NodeLegalProps } from "@aidbox-forms/theme";

export function NodeLegal({ id, content, ariaLabel }: NodeLegalProps) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {content}
    </div>
  );
}
