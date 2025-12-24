import type { ValueDisplayProps } from "../../../../../types.ts";

export function CodingDisplay({ value }: ValueDisplayProps<"coding">) {
  const parts: string[] = [];
  if (value.display) {
    parts.push(value.display);
  } else if (value.code) {
    parts.push(value.code);
  }
  if (value.system) {
    parts.push(`(${value.system})`);
  }
  return <>{parts.join(" ")}</>;
}
