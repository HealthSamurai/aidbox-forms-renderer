import type { ValueDisplayProps } from "../../../../../types.ts";
import { strings } from "../../../../../strings.ts";

export function BooleanDisplay({ value }: ValueDisplayProps<"boolean">) {
  return <>{value ? strings.boolean.yes : strings.boolean.no}</>;
}
