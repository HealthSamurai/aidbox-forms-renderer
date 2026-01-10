import { styled } from "@linaria/react";
import type { EmptyStateProperties } from "@aidbox-forms/theme";

export function EmptyState({ children }: EmptyStateProperties) {
  return <Message>{children}</Message>;
}

const Message = styled.p`
  display: block;
  color: #4a5568;
`;
