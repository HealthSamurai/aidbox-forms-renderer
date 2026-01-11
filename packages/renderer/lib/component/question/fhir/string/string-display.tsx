import type { ValueDisplayProperties } from "../../../../types.ts";

export function StringDisplay({ value }: ValueDisplayProperties<"string">) {
  return <>{value}</>;
}
