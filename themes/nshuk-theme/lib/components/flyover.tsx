import type { FlyoverProperties } from "@formbox/theme";

export function Flyover({ id, children, ariaLabel }: FlyoverProperties) {
  return (
    <div className="nhsuk-hint" id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
