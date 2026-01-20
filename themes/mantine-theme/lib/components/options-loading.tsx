import { Text } from "@mantine/core";
import type { OptionsLoadingProperties } from "@formbox/theme";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  if (!isLoading) return;

  return (
    <Text size="sm" c="dimmed" role="status">
      Loading options…
    </Text>
  );
}
