import type { LinkProperties } from "@formbox/theme";
import { Typography } from "antd";

export function Link({ href, children, target, rel }: LinkProperties) {
  return (
    <Typography.Link href={href} target={target} rel={rel}>
      {children}
    </Typography.Link>
  );
}
