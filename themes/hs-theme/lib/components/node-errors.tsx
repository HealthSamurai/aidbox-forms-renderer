import { styled } from "@linaria/react";
import type { NodeErrorsProps } from "@aidbox-forms/theme";

export function NodeErrors({ id, messages }: NodeErrorsProps) {
  if (messages.length === 0) return null;
  return (
    <List id={id} role="alert">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </List>
  );
}

const List = styled.ul`
  padding: 0;
  color: #c53030;
  font-size: 0.875rem;
  margin: 0;
  list-style: none;
`;
