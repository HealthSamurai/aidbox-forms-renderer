import { Button, Group, Stack } from "@mantine/core";
import type { CustomOptionFormProperties } from "@aidbox-forms/theme";

export function CustomOptionForm({
  content,
  errors,
  submit,
  cancel,
}: CustomOptionFormProperties) {
  return (
    <Stack gap="xs">
      <div>{content}</div>
      {errors ?? null}
      <Group gap="xs">
        <Button
          type="button"
          variant="default"
          onClick={cancel.onClick}
          disabled={cancel.disabled === true}
        >
          {cancel.label}
        </Button>
        <Button
          type="button"
          color="green"
          onClick={submit.onClick}
          disabled={submit.disabled === true}
        >
          {submit.label}
        </Button>
      </Group>
    </Stack>
  );
}
