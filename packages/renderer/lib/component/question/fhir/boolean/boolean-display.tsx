import type { ValueDisplayProperties } from "../../../../types.ts";
import { strings } from "../../../../strings.ts";

export function BooleanDisplay({ value }: ValueDisplayProperties<"boolean">) {
  return <>{value ? strings.value.yes : strings.value.no}</>;
}
