import type { ValueDisplayProperties } from "../../../../../types.ts";

export function ReferenceDisplay({
  value,
}: ValueDisplayProperties<"reference">) {
  const label = value.display ?? value.reference ?? "";
  return <>{label}</>;
}
