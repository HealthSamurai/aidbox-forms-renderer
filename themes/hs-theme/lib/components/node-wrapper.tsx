import type { NodeWrapperProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function NodeWrapper({ linkId, className, children }: NodeWrapperProps) {
  return (
    <Container className={className} data-linkid={linkId}>
      {children}
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 1rem;
`;
