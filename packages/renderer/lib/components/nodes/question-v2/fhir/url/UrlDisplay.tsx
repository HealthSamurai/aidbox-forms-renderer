export function UrlDisplay({
  value,
  placeholder = "—",
}: {
  value: string | null | undefined;
  placeholder?: string;
}) {
  if (value == null || value === "") return <>{placeholder}</>;
  return (
    <a href={value} target="_blank" rel="noreferrer">
      {value}
    </a>
  );
}
