import { Box } from "@mantine/core";
import type { HeaderProperties } from "@formbox/theme";

export function Header({ linkId, children }: HeaderProperties) {
  return <Box data-linkid={linkId}>{children}</Box>;
}
