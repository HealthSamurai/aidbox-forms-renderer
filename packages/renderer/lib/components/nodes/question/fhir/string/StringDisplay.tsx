import type { ValueDisplayProps } from "../../../../../types.ts";

export function StringDisplay({ value }: ValueDisplayProps<"string">) {
  return <>{value}</>;
}
