import { styled } from "@linaria/react";
import type { HeaderProperties } from "@aidbox-forms/theme";

export function Header({ linkId, children }: HeaderProperties) {
  return <Container data-linkid={linkId}>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
