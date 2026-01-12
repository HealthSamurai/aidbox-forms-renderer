import { Stack as MantineStack } from "@mantine/core";
import type { StackProperties } from "@aidbox-forms/theme";

export function Stack({ children }: StackProperties) {
  return <MantineStack gap="md">{children}</MantineStack>;
}
