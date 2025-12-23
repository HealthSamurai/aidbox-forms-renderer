import type { LinkProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function Link({ href, label, target, rel }: LinkProps) {
  return (
    <Anchor href={href} target={target} rel={rel}>
      {label}
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
