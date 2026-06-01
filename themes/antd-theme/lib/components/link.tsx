import type { LinkProperties } from "@formbox/theme";
import { Typography } from "antd";

export function Link({ id, href, children, target, rel }: LinkProperties) {
  const idProperties = id === undefined ? {} : { id };

  return (
    <Typography.Link {...idProperties} href={href} target={target} rel={rel}>
      {children}
    </Typography.Link>
  );
}
