import { styled } from "@linaria/react";
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
      <RowGroup>
        {items.map((child, index) => {
          const weight = weights?.[index];
          if (weight == undefined) {
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

const RowItem = styled.div<{ $weight?: number }>`
  flex: ${(properties) =>
    properties.$weight == undefined ? "1 1 0" : `${properties.$weight} 1 0`};
  min-width: 0;
`;
