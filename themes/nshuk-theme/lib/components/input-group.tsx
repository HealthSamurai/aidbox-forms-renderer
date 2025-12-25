import { Children } from "react";
import type { InputGroupProps } from "@aidbox-forms/theme";

export function InputGroup({ children, layout, weights }: InputGroupProps) {
  const items = Children.toArray(children);

  if (layout === "row") {
    return (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {items.map((child, index) => {
          const weight = weights?.[index];
          return (
            <div
              key={index}
              style={weight ? { flex: `${weight} 1 0` } : undefined}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "0.5rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
      }}
    >
      {items}
    </div>
  );
}
