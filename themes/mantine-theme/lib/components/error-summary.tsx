import type { ErrorSummaryProperties } from "@formbox/theme";
import { Alert, Anchor, Box, List, Text } from "@mantine/core";
import { useEffect, useRef } from "react";

export function ErrorSummary({
  id,
  title = "There is a problem",
  description,
  items,
}: ErrorSummaryProperties) {
  const focusReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    focusReference.current?.focus();
  }, [items.length]);

  if (items.length === 0) return;

  return (
    <Box id={id} role="alert" tabIndex={-1} ref={focusReference}>
      <Alert color="red" title={title}>
        {description ? (
          <Text size="sm" mb="xs">
            {description}
          </Text>
        ) : undefined}
        <List size="sm" spacing="xs">
          {items.map((item, index) => {
            const key = `${item.href ?? ""}::${item.message}::${index}`;
            return (
              <List.Item key={key}>
                {item.href ? (
                  <Anchor href={item.href}>{item.message}</Anchor>
                ) : (
                  item.message
                )}
              </List.Item>
            );
          })}
        </List>
      </Alert>
    </Box>
  );
}
