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
      <div className="nhsuk-input-wrapper nhsuk-u-width-full">
        {items.map((child, index) => {
          const weight = weights?.[index];
          return (
            <RowItem
              key={index}
              className="ab-nhsuk-input-like"
              $weight={weight}
            >
              {child}
            </RowItem>
          );
        })}
      </div>
    );
  }

  return <GridGroup className="nhsuk-u-width-full">{children}</GridGroup>;
}

const GridGroup = styled.div`
  display: grid;
  gap: var(--nhsuk-spacing-2);
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
`;

const RowItem = styled.div<{ $weight?: number }>`
  flex: ${(properties) =>
    properties.$weight == undefined ? "1 1 0" : `${properties.$weight} 1 0`};
  min-width: 0;
`;
