import { TextAttributes } from "@opentui/core";
import type { ErrorSummaryProperties } from "@aidbox-forms/theme";

export function ErrorSummary({
  id,
  title = "There is a problem",
  description,
  items,
}: ErrorSummaryProperties) {
  if (items.length === 0) return;

  const containerProperties = id ? { id } : {};

  return (
    <box
      {...containerProperties}
      flexDirection="column"
      style={{ border: true, padding: 1 }}
    >
      <text attributes={TextAttributes.BOLD} style={{ fg: "#ff6666" }}>
        {title}
      </text>
      {description ? (
        <text attributes={TextAttributes.DIM}>{description}</text>
      ) : undefined}
      <box flexDirection="column" style={{ gap: 0, marginTop: 1 }}>
        {items.map((item, index) => (
          <text key={`${id ?? "error"}-${index}`}>- {item.message}</text>
        ))}
      </box>
    </box>
  );
}
