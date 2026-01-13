import { styled } from "@linaria/react";
import type { FooterProperties } from "@aidbox-forms/theme";

export function Footer({ linkId, children }: FooterProperties) {
  return <Container data-linkid={linkId}>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
