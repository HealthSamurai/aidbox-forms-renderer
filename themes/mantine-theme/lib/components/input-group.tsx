import { Grid } from "@mantine/core";
import { Children } from "react";
import type { InputGroupProperties } from "@aidbox-forms/theme";

export function InputGroup({ children, spans }: InputGroupProperties) {
  const items = Children.toArray(children);

  return (
    <Grid columns={12} gutter="sm">
      {items.map((child, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: spans[index] }}>
          {child}
        </Grid.Col>
      ))}
    </Grid>
  );
}
