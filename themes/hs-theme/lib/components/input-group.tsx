import { styled } from "@linaria/react";
import { Children } from "react";
import type { InputGroupProps } from "@aidbox-forms/theme";

export function InputGroup({ children, layout, weights }: InputGroupProps) {
  if (layout === "row") {
    const items = Children.toArray(children);
    return (
      <RowGroup>
        {items.map((child, index) => {
          const weight = weights?.[index];
          return (
            <RowItem
              key={index}
              style={weight ? { flex: `${weight} 1 0` } : undefined}
            >
              {child}
            </RowItem>
          );
        })}
      </RowGroup>
    );
  }

  return <GridGroup>{children}</GridGroup>;
}

const GridGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
`;

const RowGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RowItem = styled.div`
  flex: 1 1 0;
`;
