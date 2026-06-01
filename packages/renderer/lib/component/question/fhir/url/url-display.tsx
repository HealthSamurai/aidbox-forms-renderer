import { useTheme } from "../../../../ui/theme.tsx";
import type { ValueDisplayProperties } from "../../../../types.ts";

export function UrlDisplay({ id, value }: ValueDisplayProperties<"url">) {
  const { Link } = useTheme();
  return (
    <Link id={id} href={value} target="_blank" rel="noreferrer">
      {value}
    </Link>
  );
}
