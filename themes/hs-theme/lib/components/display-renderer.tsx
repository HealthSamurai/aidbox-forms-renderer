import { styled } from "@linaria/react";
import type { DisplayRendererProps } from "@aidbox-forms/theme";

export function DisplayRenderer({ linkId, content }: DisplayRendererProps) {
  return <Wrapper data-linkid={linkId}>{content}</Wrapper>;
}

const Wrapper = styled.div`
  padding: 0.25rem 0;
  color: #2d3748;
`;
