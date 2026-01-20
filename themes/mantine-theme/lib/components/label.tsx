import { Box, Group, Text } from "@mantine/core";
import type { LabelProperties } from "@formbox/theme";

export function Label({
  prefix,
  children,
  id,
  htmlFor,
  required,
  help,
  legal,
  flyover,
  as = "label",
}: LabelProperties) {
  const wrapperTag = as === "label" ? "label" : "div";
  const wrapperProperties =
    wrapperTag === "label" && htmlFor ? { htmlFor } : {};
  const emphasize = as !== "text";
  const legend = as === "legend";

  return (
    <Box component={wrapperTag} {...wrapperProperties} style={{ margin: 0 }}>
      <Group gap={6} wrap="nowrap" align="center">
        <Text
          id={id}
          component="span"
          fw={emphasize ? 600 : 400}
          size={legend ? "lg" : "sm"}
          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          {prefix ? (
            <Text component="span" fw={600}>
              {prefix}
            </Text>
          ) : undefined}
          {children}
          {required ? (
            <Text component="span" c="red" aria-hidden>
              *
            </Text>
          ) : undefined}
        </Text>
        {help}
        {legal}
        {flyover}
      </Group>
    </Box>
  );
}
