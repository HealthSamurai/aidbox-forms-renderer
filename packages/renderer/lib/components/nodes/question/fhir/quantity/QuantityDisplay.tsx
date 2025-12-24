import type { ValueDisplayProps } from "../../../../../types.ts";

export function QuantityDisplay({ value }: ValueDisplayProps<"quantity">) {
  const pieces: Array<string | number> = [];
  if (value.value !== undefined && value.value !== null) {
    pieces.push(value.value);
  }
  if (value.unit) {
    pieces.push(value.unit);
  } else if (value.code) {
    pieces.push(value.code);
  }
  return <>{pieces.join(" ")}</>;
}
