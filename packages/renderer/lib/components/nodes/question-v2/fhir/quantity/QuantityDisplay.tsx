import type { Quantity } from "fhir/r5";

export function QuantityDisplay({
  value,
  placeholder = "—",
}: {
  value: Quantity | null | undefined;
  placeholder?: string;
}) {
  if (!value) return <>{placeholder}</>;
  const pieces: Array<string | number> = [];
  if (value.value !== undefined && value.value !== null) {
    pieces.push(value.value);
  }
  if (value.unit) {
    pieces.push(value.unit);
  } else if (value.code) {
    pieces.push(value.code);
  }
  if (pieces.length === 0) return <>{placeholder}</>;
  return <>{pieces.join(" ")}</>;
}
