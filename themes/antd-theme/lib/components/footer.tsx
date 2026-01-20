import type { FooterProperties } from "@formbox/theme";

export function Footer({ linkId, children }: FooterProperties) {
  return <div data-linkid={linkId}>{children}</div>;
}
