export function StringValue({
  value,
  placeholder = "—",
}: {
  value: string | null | undefined;
  placeholder?: string;
}) {
  if (value == null || value === "") return <>{placeholder}</>;
  return <>{value}</>;
}
