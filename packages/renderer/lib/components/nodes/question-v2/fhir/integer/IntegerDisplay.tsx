export function IntegerDisplay({
  value,
  placeholder = "—",
}: {
  value: number | null | undefined;
  placeholder?: string;
}) {
  if (value === null || value === undefined) return <>{placeholder}</>;
  return <>{value}</>;
}
