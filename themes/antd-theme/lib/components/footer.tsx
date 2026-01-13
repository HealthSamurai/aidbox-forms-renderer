import type { FooterProperties } from "@aidbox-forms/theme";

export function Footer({ linkId, children }: FooterProperties) {
  return <div data-linkid={linkId}>{children}</div>;
}
