import type { ValueDisplayProperties } from "../../../../types.ts";

export function DecimalDisplay({ value }: ValueDisplayProperties<"decimal">) {
  return <>{value}</>;
}
