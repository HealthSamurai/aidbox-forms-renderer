import type { ValueDisplayProperties } from "../../../../../types.ts";

export function IntegerDisplay({ value }: ValueDisplayProperties<"integer">) {
  return <>{value}</>;
}
