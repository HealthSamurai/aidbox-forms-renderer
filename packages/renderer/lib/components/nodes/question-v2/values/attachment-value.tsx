import type { Attachment } from "fhir/r5";

export function AttachmentValue({
  value,
  placeholder = "—",
}: {
  value: Attachment | null | undefined;
  placeholder?: string;
}) {
  if (!value) return <>{placeholder}</>;
  const label = value.title ?? value.url;
  return <>{label ?? placeholder}</>;
}
