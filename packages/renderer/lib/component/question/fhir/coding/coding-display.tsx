import type { ValueDisplayProperties } from "../../../../types.ts";

export function CodingDisplay({ value }: ValueDisplayProperties<"coding">) {
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
