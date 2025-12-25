import { styled } from "@linaria/react";
import type { DisplayRendererProps } from "@aidbox-forms/theme";

export function DisplayRenderer({ linkId, children }: DisplayRendererProps) {
  return <Wrapper data-linkid={linkId}>{children}</Wrapper>;
}

const Wrapper = styled.div`
  padding: 0.25rem 0;
  color: #2d3748;
`;
