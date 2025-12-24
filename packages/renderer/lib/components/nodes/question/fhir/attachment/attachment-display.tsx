import type { ValueDisplayProps } from "../../../../../types.ts";

export function AttachmentDisplay({ value }: ValueDisplayProps<"attachment">) {
  const label = value.title ?? value.url ?? "";
  return <>{label}</>;
}
