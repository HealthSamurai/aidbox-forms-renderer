import type { ValueDisplayProperties } from "../../../../../types.ts";

export function TextDisplay({ value }: ValueDisplayProperties<"text">) {
  return <>{value}</>;
}
