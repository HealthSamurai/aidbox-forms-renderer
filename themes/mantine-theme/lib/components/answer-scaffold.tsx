import { Box, Button, Group, Stack } from "@mantine/core";
import type {
  AnswerRemoveButtonProperties,
  AnswerScaffoldProperties,
} from "@aidbox-forms/theme";

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
          <AnswerRemoveButton
            onClick={onRemove}
            disabled={canRemove === false}
            text="Remove"
          />
        ) : null}
      </Group>
      {children || errors ? (
        <Box pl="md">
          {children}
          {errors}
        </Box>
      ) : null}
    </Stack>
  );
}

export function AnswerRemoveButton({
  onClick,
  disabled,
  text,
}: AnswerRemoveButtonProperties) {
  return (
    <Button
      type="button"
      variant="subtle"
      color="red"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
