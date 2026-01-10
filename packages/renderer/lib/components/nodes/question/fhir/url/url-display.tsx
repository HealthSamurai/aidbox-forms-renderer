import { useTheme } from "../../../../../ui/theme.tsx";
import type { ValueDisplayProperties } from "../../../../../types.ts";

export function UrlDisplay({ value }: ValueDisplayProperties<"url">) {
  const { Link } = useTheme();
  return (
    <Link href={value} target="_blank" rel="noreferrer">
      {value}
    </Link>
  );
}
