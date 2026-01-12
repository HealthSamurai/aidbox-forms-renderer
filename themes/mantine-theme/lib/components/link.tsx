import { Anchor } from "@mantine/core";
import type { LinkProperties } from "@aidbox-forms/theme";

export function Link({ href, children, target, rel }: LinkProperties) {
  return (
    <Anchor href={href} target={target} rel={rel}>
      {children}
    </Anchor>
  );
}
