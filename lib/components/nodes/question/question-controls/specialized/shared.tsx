import type { ReactNode } from "react";

export function withInlineUnit(
  unitLabel: string | undefined,
  control: ReactNode,
) {
  return (
    <div className="af-numeric-control">
      {control}
      {unitLabel && (
        <span className="af-number-inline-unit" aria-hidden="true">
          {unitLabel}
        </span>
      )}
    </div>
  );
}
