import { Box } from "@mantine/core";
import { Children } from "react";
import type { InputGroupProperties } from "@aidbox-forms/theme";

export function InputGroup({
  children,
  layout,
  weights,
}: InputGroupProperties) {
  if (layout === "row") {
    const items = Children.toArray(children);

    return (
      <Box style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {items.map((child, index) => {
          const weight = weights?.[index];
          const flex = weight == undefined ? "1 1 0" : `${String(weight)} 1 0`;

          return (
            <Box key={index} style={{ flex, minWidth: 0 }}>
              {child}
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: "grid",
        gap: "0.5rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
      }}
    >
      {children}
    </Box>
  );
}
