import { styled } from "@linaria/react";
import type { DisplayRendererProperties } from "@formbox/theme";

export function DisplayRenderer({
  linkId,
  children,
}: DisplayRendererProperties) {
  return <Wrapper data-linkid={linkId}>{children}</Wrapper>;
}

const Wrapper = styled.div`
  padding: 0.25rem 0;
  color: #2d3748;
`;
