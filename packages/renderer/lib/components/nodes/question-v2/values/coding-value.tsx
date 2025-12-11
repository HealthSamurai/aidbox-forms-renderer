import type { Coding } from "fhir/r5";

export function CodingValue({
  value,
  placeholder = "—",
}: {
  value: Coding | null | undefined;
  placeholder?: string;
}) {
  if (!value) return <>{placeholder}</>;
  const parts: string[] = [];
  if (value.display) {
    parts.push(value.display);
  } else if (value.code) {
    parts.push(value.code);
  }
  if (value.system) {
    parts.push(`(${value.system})`);
  }
  return <>{parts.length > 0 ? parts.join(" ") : placeholder}</>;
}
