import { useTheme } from "../../../../../ui/theme.tsx";

export function UrlDisplay({
  value,
  placeholder = "—",
}: {
  value: string | null | undefined;
  placeholder?: string;
}) {
  const { Link } = useTheme();
  if (value == null || value === "") return <>{placeholder}</>;
  return <Link href={value} label={value} target="_blank" rel="noreferrer" />;
}
