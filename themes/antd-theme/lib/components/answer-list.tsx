import type { AnswerListProperties } from "@formbox/theme";
import { Button, Space } from "antd";

export function AnswerList({
  children,
  onAdd,
  canAdd,
  addLabel,
}: AnswerListProperties) {
  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      {children}
      {onAdd && (
        <Button onClick={onAdd} disabled={canAdd === false}>
          {addLabel ?? "Add"}
        </Button>
      )}
    </Space>
  );
}
