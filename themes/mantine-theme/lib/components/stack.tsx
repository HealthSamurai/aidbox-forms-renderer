import { Stack as MantineStack } from "@mantine/core";
import type { StackProperties } from "@formbox/theme";

export function Stack({ children }: StackProperties) {
  return <MantineStack gap="md">{children}</MantineStack>;
}
