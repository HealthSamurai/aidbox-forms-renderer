import type { NodeFlyoverProperties } from "@aidbox-forms/theme";

export function NodeFlyover({
  id,
  children,
  ariaLabel,
}: NodeFlyoverProperties) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
