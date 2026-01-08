import { styled } from "@linaria/react";
import { Children } from "react";
import type { InputGroupProps } from "@aidbox-forms/theme";

export function InputGroup({ children, layout, weights }: InputGroupProps) {
  const items = Children.toArray(children);

  if (layout === "row") {
    return (
      <RowGroup>
        {items.map((child, index) => {
          const weight = weights?.[index];
          if (weight == null) {
            return <RowItem key={index}>{child}</RowItem>;
          }
          return (
            <RowItem key={index} $weight={weight}>
              {child}
            </RowItem>
          );
        })}
      </RowGroup>
    );
  }

  return <GridGroup>{items}</GridGroup>;
}

const RowGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RowItem = styled.div<{ $weight?: number }>`
  flex: ${(props) =>
    props.$weight == null ? "1 1 0" : `${props.$weight} 1 0`};
`;

const GridGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
`;
