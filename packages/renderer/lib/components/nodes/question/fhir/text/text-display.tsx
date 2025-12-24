import type { ValueDisplayProps } from "../../../../../types.ts";

export function TextDisplay({ value }: ValueDisplayProps<"text">) {
  return <>{value}</>;
}
