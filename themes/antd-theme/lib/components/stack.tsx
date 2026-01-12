import type { StackProperties } from "@aidbox-forms/theme";
import { Space } from "antd";

export function Stack({ children }: StackProperties) {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {children}
    </Space>
  );
}
