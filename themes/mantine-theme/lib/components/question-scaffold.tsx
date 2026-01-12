import { Stack } from "@mantine/core";
import type { QuestionScaffoldProperties } from "@aidbox-forms/theme";

export function QuestionScaffold({
  linkId,
  header,
  children,
  errors,
}: QuestionScaffoldProperties) {
  return (
    <Stack data-linkid={linkId} gap="xs">
      {header}
      {children}
      {errors}
    </Stack>
  );
}
