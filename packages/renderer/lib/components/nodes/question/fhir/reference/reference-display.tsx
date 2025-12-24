import type { ValueDisplayProps } from "../../../../../types.ts";

export function ReferenceDisplay({ value }: ValueDisplayProps<"reference">) {
  const label = value.display ?? value.reference ?? "";
  return <>{label}</>;
}
