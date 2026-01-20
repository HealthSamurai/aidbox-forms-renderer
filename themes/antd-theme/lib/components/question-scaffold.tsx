import type { QuestionScaffoldProperties } from "@formbox/theme";
import { Space } from "antd";

export function QuestionScaffold({
  linkId,
  header,
  children,
  errors,
}: QuestionScaffoldProperties) {
  return (
    <div data-linkid={linkId}>
      <Space orientation="vertical" size="small" style={{ width: "100%" }}>
        {header}
        {children}
        {errors}
      </Space>
    </div>
  );
}
