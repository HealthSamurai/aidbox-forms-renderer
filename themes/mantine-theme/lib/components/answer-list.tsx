import { Button, Stack } from "@mantine/core";
import { Children } from "react";
import type { AnswerListProperties } from "@aidbox-forms/theme";

export function AnswerList({
  children,
  onAdd,
  canAdd,
  addLabel,
}: AnswerListProperties) {
  const items = Children.toArray(children);
  const addText = addLabel ?? "Add";

  return (
    <Stack gap="sm">
      {items.length > 0 ? <Stack gap="sm">{items}</Stack> : null}
      {onAdd ? (
        <Button type="button" onClick={onAdd} disabled={canAdd === false}>
          {addText}
        </Button>
      ) : null}
    </Stack>
  );
}
