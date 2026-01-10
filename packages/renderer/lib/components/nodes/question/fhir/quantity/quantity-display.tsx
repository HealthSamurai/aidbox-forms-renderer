import type { ValueDisplayProperties } from "../../../../../types.ts";

export function QuantityDisplay({ value }: ValueDisplayProperties<"quantity">) {
  const pieces: Array<string | number> = [];
  if (value.value !== undefined) {
    pieces.push(value.value);
  }
  if (value.unit) {
    pieces.push(value.unit);
  } else if (value.code) {
    pieces.push(value.code);
  }
  return <>{pieces.join(" ")}</>;
}
