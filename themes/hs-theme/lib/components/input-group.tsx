import { styled } from "@linaria/react";
import { Children } from "react";
import type { InputGroupProperties } from "@aidbox-forms/theme";

export function InputGroup({ children, spans }: InputGroupProperties) {
  const items = Children.toArray(children);
  return (
    <Group>
      {items.map((child, index) => (
        <Item key={index} $span={spans[index]}>
          {child}
        </Item>
      ))}
    </Group>
  );
}

const Group = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Item = styled.div<{ $span: number }>`
  flex: ${(properties) => `${properties.$span} 1 0`};
  min-width: min(100%, max-content);
`;
