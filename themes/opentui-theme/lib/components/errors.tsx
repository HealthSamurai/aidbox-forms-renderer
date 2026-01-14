import { TextAttributes } from "@opentui/core";
import type { ErrorsProperties } from "@aidbox-forms/theme";

export function Errors({ id, messages }: ErrorsProperties) {
  if (messages.length === 0) return;

  return (
    <box id={id} flexDirection="column" style={{ gap: 0 }}>
      {messages.map((message, index) => (
        <text
          key={`${id}-${index}`}
          attributes={TextAttributes.DIM}
          style={{ fg: "#ff6666" }}
        >
          - {message}
        </text>
      ))}
    </box>
  );
}
