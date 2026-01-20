import { Stack } from "@mantine/core";
import type { QuestionScaffoldProperties } from "@formbox/theme";

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
