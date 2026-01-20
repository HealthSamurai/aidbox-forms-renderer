import { Box, Button, Group, Stack } from "@mantine/core";
import type { AnswerScaffoldProperties } from "@formbox/theme";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  return (
    <Stack gap={6}>
      <Group align="flex-start" wrap="nowrap" gap="sm">
        <Box style={{ flex: 1, minWidth: 0 }}>{control}</Box>
        {onRemove ? (
          <Button
            type="button"
            variant="subtle"
            color="red"
            onClick={onRemove}
            disabled={canRemove === false}
          >
            Remove
          </Button>
        ) : undefined}
      </Group>
      {children || errors ? (
        <Box pl="md">
          {children}
          {errors}
        </Box>
      ) : undefined}
    </Stack>
  );
}
