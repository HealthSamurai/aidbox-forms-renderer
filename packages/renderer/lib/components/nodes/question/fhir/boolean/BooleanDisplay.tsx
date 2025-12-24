import type { ValueDisplayProps } from "../../../../../types.ts";

export function BooleanDisplay({ value }: ValueDisplayProps<"boolean">) {
  return <>{value ? "Yes" : "No"}</>;
}
