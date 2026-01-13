import type { HeaderProperties } from "@aidbox-forms/theme";

export function Header({ linkId, children }: HeaderProperties) {
  return <div data-linkid={linkId}>{children}</div>;
}
