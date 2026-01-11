import { styled } from "@linaria/react";
import type { StackProperties } from "@aidbox-forms/theme";

export function Stack({ children }: StackProperties) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
