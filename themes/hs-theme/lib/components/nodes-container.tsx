import { styled } from "@linaria/react";
import type { NodesContainerProps } from "@aidbox-forms/theme";

export function NodesContainer({ children }: NodesContainerProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
