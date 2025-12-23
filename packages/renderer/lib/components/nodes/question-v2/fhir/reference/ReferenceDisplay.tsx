import type { Reference } from "fhir/r5";

export function ReferenceDisplay({
  value,
  placeholder = "—",
}: {
  value: Reference | null | undefined;
  placeholder?: string;
}) {
  if (!value) return <>{placeholder}</>;
  const label = value.display ?? value.reference;
  return <>{label ?? placeholder}</>;
}
