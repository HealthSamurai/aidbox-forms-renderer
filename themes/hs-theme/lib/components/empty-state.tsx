import { styled } from "@linaria/react";
import type { EmptyStateProps } from "@aidbox-forms/theme";

export function EmptyState({ children }: EmptyStateProps) {
  return <Message>{children}</Message>;
}

const Message = styled.p`
  color: #4a5568;
  margin: 0;
`;
