import type { DisplayRendererProperties } from "@aidbox-forms/theme";
import { Typography } from "antd";

export function DisplayRenderer({
  linkId,
  children,
}: DisplayRendererProperties) {
  return (
    <div data-linkid={linkId}>
      <Typography.Paragraph style={{ margin: 0 }}>
        {children}
      </Typography.Paragraph>
    </div>
  );
}
