import { Box, Button, Stack } from "@mantine/core";
import type { GroupListProperties } from "@aidbox-forms/theme";

export function GroupList({
  linkId,
  header,
  children,
  onAdd,
  canAdd,
  addLabel,
}: GroupListProperties) {
  const addText = addLabel ?? "Add";

  return (
    <Stack data-linkid={linkId} gap="md">
      {header}
      <Stack gap="md">{children}</Stack>
      {onAdd ? (
        <Box>
          <Button type="button" onClick={onAdd} disabled={canAdd === false}>
            {addText}
          </Button>
        </Box>
      ) : undefined}
    </Stack>
  );
}
