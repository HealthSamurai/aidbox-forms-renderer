import { Box } from "@mantine/core";
import type { DisplayRendererProperties } from "@aidbox-forms/theme";

export function DisplayRenderer({
  linkId,
  children,
}: DisplayRendererProperties) {
  return (
    <Box data-linkid={linkId} py={4}>
      {children}
    </Box>
  );
}
