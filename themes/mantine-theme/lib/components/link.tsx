import { Anchor } from "@mantine/core";
import type { LinkProperties } from "@formbox/theme";

export function Link({ id, href, children, target, rel }: LinkProperties) {
  return (
    <Anchor id={id} href={href} target={target} rel={rel}>
      {children}
    </Anchor>
  );
}
