import { styled } from "@linaria/react";
import type { NodeListProperties } from "@aidbox-forms/theme";

export function NodeList({ children }: NodeListProperties) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
