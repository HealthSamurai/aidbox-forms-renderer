import { useTheme } from "../../../../../ui/theme.tsx";
import type { ValueDisplayProps } from "../../../../../types.ts";

export function UrlDisplay({ value }: ValueDisplayProps<"url">) {
  const { Link } = useTheme();
  return <Link href={value} label={value} target="_blank" rel="noreferrer" />;
}
