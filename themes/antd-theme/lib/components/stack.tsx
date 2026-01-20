import type { StackProperties } from "@formbox/theme";
import { Space } from "antd";

export function Stack({ children }: StackProperties) {
  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      {children}
    </Space>
  );
}
