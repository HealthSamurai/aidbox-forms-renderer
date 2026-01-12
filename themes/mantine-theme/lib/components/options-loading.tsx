import { Text } from "@mantine/core";
import type { OptionsLoadingProperties } from "@aidbox-forms/theme";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  if (!isLoading) return null;

  return (
    <Text size="sm" c="dimmed" role="status">
      Loading options…
    </Text>
  );
}
