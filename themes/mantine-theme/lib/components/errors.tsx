import { Box, Text } from "@mantine/core";
import type { ErrorsProperties } from "@aidbox-forms/theme";

export function Errors({ id, messages }: ErrorsProperties) {
  if (messages.length === 0) return;

  return (
    <Box id={id} role="alert">
      {messages.map((message, index) => (
        <Text key={index} size="sm" c="red">
          {message}
        </Text>
      ))}
    </Box>
  );
}
