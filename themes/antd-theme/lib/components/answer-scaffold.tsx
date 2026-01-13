import type { AnswerScaffoldProperties } from "@aidbox-forms/theme";
import { Button, Space } from "antd";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  return (
    <Space orientation="vertical" size="small" style={{ width: "100%" }}>
      <Space
        align="start"
        className="ab-antd-space-stretch"
        style={{ width: "100%" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>{control}</div>
        {onRemove && (
          <Button
            type="text"
            danger
            onClick={onRemove}
            disabled={canRemove === false}
          >
            Remove
          </Button>
        )}
      </Space>
      {errors}
      {children}
    </Space>
  );
}
