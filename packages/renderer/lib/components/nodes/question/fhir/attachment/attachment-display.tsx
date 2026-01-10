import type { ValueDisplayProperties } from "../../../../../types.ts";

export function AttachmentDisplay({
  value,
}: ValueDisplayProperties<"attachment">) {
  const label = value.title ?? value.url ?? "";
  return <>{label}</>;
}
