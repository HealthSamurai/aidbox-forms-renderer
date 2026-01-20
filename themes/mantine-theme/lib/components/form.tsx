import type { FormEvent } from "react";
import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import type { FormProperties } from "@formbox/theme";

export function Form({
  onSubmit,
  onCancel,
  children,
  pagination,
  title,
  description,
  errors,
  before,
  after,
}: FormProperties) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  const handleCancel = onCancel ?? (() => {});
  const hasHeader = Boolean(title) || Boolean(description);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="md">
        {hasHeader ? (
          <Box>
            {title ? (
              <Title order={2} size="h3">
                {title}
              </Title>
            ) : undefined}
            {description ? (
              <Text c="dimmed" size="sm">
                {description}
              </Text>
            ) : undefined}
          </Box>
        ) : undefined}

        {errors}
        {before}
        {children}
        {after}

        {pagination ? (
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="xs" align="center">
              <Button
                type="button"
                variant="default"
                onClick={pagination.onPrev}
                disabled={pagination.disabledPrev}
              >
                Previous
              </Button>
              <Text size="sm">
                {pagination.current} / {pagination.total}
              </Text>
              <Button
                type="button"
                variant="default"
                onClick={pagination.onNext}
                disabled={pagination.disabledNext}
              >
                Next
              </Button>
            </Group>
            <Group gap="xs" align="center">
              <Button type="submit" disabled={onSubmit == undefined}>
                Submit
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleCancel}
                disabled={onCancel == undefined}
              >
                Cancel
              </Button>
            </Group>
          </Group>
        ) : (
          <Group justify="flex-end" gap="xs">
            <Button type="submit" disabled={onSubmit == undefined}>
              Submit
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleCancel}
              disabled={onCancel == undefined}
            >
              Cancel
            </Button>
          </Group>
        )}
      </Stack>
    </Box>
  );
}
