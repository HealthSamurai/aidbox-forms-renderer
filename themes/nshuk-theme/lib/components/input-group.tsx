import { styled } from "@linaria/react";
import { Children } from "react";
import type { InputGroupProperties } from "@aidbox-forms/theme";

export function InputGroup({ children, spans }: InputGroupProperties) {
  const items = Children.toArray(children);
  return (
    <div className="ab-nhsuk-grid">
      {items.map((child, index) => (
        <RowItem key={index} $span={spans[index]}>
          {child}
        </RowItem>
      ))}
    </div>
  );
}

const RowItem = styled.div<{ $span: number }>`
  flex: ${(properties) => `${properties.$span} 1 0`};
  min-width: 0;
`;
