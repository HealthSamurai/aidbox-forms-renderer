import { Button, Group, Stack } from "@mantine/core";
import { Children } from "react";
import type { GroupScaffoldProperties } from "@formbox/theme";

export function GroupScaffold({
  header,
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupScaffoldProperties) {
  const content = Children.toArray(children);
  const removeText = removeLabel ?? "Remove";

  return (
    <Stack gap="md">
      {header}
      {content.length > 0 ? <Stack gap="md">{content}</Stack> : undefined}
      {errors}
      {onRemove ? (
        <Group justify="flex-end">
          <Button
            type="button"
            variant="subtle"
            color="red"
            onClick={onRemove}
            disabled={canRemove === false}
          >
            {removeText}
          </Button>
        </Group>
      ) : undefined}
    </Stack>
  );
}
