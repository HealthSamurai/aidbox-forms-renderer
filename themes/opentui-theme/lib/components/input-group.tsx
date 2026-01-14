import type { InputGroupProperties } from "@aidbox-forms/theme";
import { Children } from "react";

export function InputGroup({
  children,
  layout,
  weights,
}: InputGroupProperties) {
  const items = Children.toArray(children);

  const flexDirection = layout === "grid" ? "row" : "row";

  return (
    <box flexDirection={flexDirection} style={{ gap: 1 }}>
      {items.map((child, index) => (
        <box
          key={index}
          style={{ flexGrow: weights?.[index] ?? 1, minWidth: 0 }}
        >
          {child}
        </box>
      ))}
    </box>
  );
}
