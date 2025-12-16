import type { NodeFlyoverProps } from "@aidbox-forms/theme";

export function NodeFlyover({ id, content, ariaLabel }: NodeFlyoverProps) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {content}
    </div>
  );
}
