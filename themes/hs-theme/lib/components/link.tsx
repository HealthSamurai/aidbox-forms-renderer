import type { LinkProperties } from "@formbox/theme";
import { styled } from "@linaria/react";

export function Link({ id, href, children, target, rel }: LinkProperties) {
  return (
    <Anchor id={id} href={href} target={target} rel={rel}>
      {children}
    </Anchor>
  );
}

const Anchor = styled.a`
  color: #2563eb;
  text-decoration: underline;

  &:hover,
  &:focus {
    color: #1d4ed8;
  }
`;
