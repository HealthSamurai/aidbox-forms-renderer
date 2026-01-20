import { styled } from "@linaria/react";
import type { StackProperties } from "@formbox/theme";

export function Stack({ children }: StackProperties) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
