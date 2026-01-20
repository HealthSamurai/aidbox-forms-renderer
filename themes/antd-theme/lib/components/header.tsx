import type { HeaderProperties } from "@formbox/theme";

export function Header({ linkId, children }: HeaderProperties) {
  return <div data-linkid={linkId}>{children}</div>;
}
