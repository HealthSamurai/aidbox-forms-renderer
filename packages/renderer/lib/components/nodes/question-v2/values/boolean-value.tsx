export function BooleanValue({
  value,
  placeholder = "Unanswered",
}: {
  value: boolean | null | undefined;
  placeholder?: string;
}) {
  if (value === true) return <>Yes</>;
  if (value === false) return <>No</>;
  return <>{placeholder}</>;
}
