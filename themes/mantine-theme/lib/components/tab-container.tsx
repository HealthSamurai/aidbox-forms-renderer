import { Box, Stack, Tabs, Text } from "@mantine/core";
import type { TabContainerProperties } from "@formbox/theme";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function TabContainer({
  header,
  items,
  value,
  onChange,
  errors,
  linkId,
}: TabContainerProperties) {
  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed" style={{ fontStyle: "italic" }}>
        No tab content available.
      </Text>
    );
  }

  const clampedIndex = clamp(value, 0, Math.max(items.length - 1, 0));
  const activeToken = items[clampedIndex].token;

  return (
    <Stack data-linkid={linkId} gap="sm">
      {header ? <Box style={{ fontWeight: 700 }}>{header}</Box> : undefined}
      <Tabs
        value={activeToken}
        onChange={(nextToken) => {
          if (nextToken == undefined) return;
          const nextIndex = items.findIndex(
            (entry) => entry.token === nextToken,
          );
          if (nextIndex !== -1) {
            onChange(nextIndex);
          }
        }}
        keepMounted={false}
      >
        <Tabs.List>
          {items.map((item) => (
            <Tabs.Tab
              key={item.token}
              value={item.token}
              id={item.buttonId}
              aria-controls={item.panelId}
            >
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {items.map((item) => (
          <Tabs.Panel
            key={item.token}
            value={item.token}
            id={item.panelId}
            aria-labelledby={item.buttonId}
            pt="sm"
          >
            {item.content}
          </Tabs.Panel>
        ))}
      </Tabs>
      {errors}
    </Stack>
  );
}
