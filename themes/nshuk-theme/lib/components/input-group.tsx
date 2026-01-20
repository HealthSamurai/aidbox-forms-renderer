import { styled } from "@linaria/react";
import { Children } from "react";
import type { InputGroupProperties } from "@formbox/theme";

export function InputGroup({ children, spans }: InputGroupProperties) {
  const items = Children.toArray(children);
  return (
    <Grid>
      {items.map((child, index) => (
        <RowItem key={index} $span={spans[index]}>
          {child}
        </RowItem>
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 19.99em) {
    display: block;

    & > * {
      max-width: 100%;
    }
  }

  & > * {
    margin-top: var(--nhsuk-spacing-2);
  }

  & > *:first-child,
  & > *:only-child {
    margin-top: 0;
  }

  @media (min-width: 20em) {
    align-items: flex-start;
    flex-direction: row;

    & > * {
      margin-top: 0;
      margin-left: var(--nhsuk-spacing-2);
    }

    & > *:first-child,
    & > *:only-child {
      margin-left: 0;
    }
  }
`;

const RowItem = styled.div<{ $span: number }>`
  flex: ${(properties) => `${properties.$span} 1 0`};
  min-width: 0;
`;
