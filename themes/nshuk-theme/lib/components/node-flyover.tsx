import type { NodeFlyoverProps } from "@aidbox-forms/theme";

export function NodeFlyover({ id, children, ariaLabel }: NodeFlyoverProps) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
