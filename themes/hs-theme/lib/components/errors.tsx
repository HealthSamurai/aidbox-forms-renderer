import { styled } from "@linaria/react";
import type { ErrorsProps } from "@aidbox-forms/theme";

export function Errors({ id, messages }: ErrorsProps) {
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
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  color: #c53030;
  font-size: 0.875rem;
`;
