import type { ValueDisplayProps } from "../../../../../types.ts";
import { strings } from "../../../../../strings.ts";

export function BooleanDisplay({ value }: ValueDisplayProps<"boolean">) {
  return <>{value ? strings.value.yes : strings.value.no}</>;
}
