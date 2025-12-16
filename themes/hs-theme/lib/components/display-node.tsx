import { styled } from "@linaria/react";
import type { DisplayNodeProps } from "@aidbox-forms/theme";

export function DisplayNode({ linkId, content }: DisplayNodeProps) {
  return <Wrapper data-linkid={linkId}>{content}</Wrapper>;
}

const Wrapper = styled.div`
  padding: 0.25rem 0;
  color: #2d3748;
`;
