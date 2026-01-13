import { Box } from "@mantine/core";
import type { FooterProperties } from "@aidbox-forms/theme";

export function Footer({ linkId, children }: FooterProperties) {
  return <Box data-linkid={linkId}>{children}</Box>;
}
