import { styled } from "@linaria/react";
import type { FormErrorsProperties } from "@aidbox-forms/theme";

export function FormErrors({ messages }: FormErrorsProperties) {
  if (messages.length === 0) return;
  return (
    <List role="alert">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </List>
  );
}

const List = styled.ul`
  padding: 0;
  list-style: none;
  color: #c53030;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;
