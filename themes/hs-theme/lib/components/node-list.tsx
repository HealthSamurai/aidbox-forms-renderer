import { styled } from "@linaria/react";
import type { NodeListProps } from "@aidbox-forms/theme";

export function NodeList({ children }: NodeListProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
