import type { GroupScaffoldProperties } from "@aidbox-forms/theme";
import { Button, Space } from "antd";

export function GroupScaffold({
  header,
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupScaffoldProperties) {
  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      {header}
      {children}
      {errors}
      {onRemove && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="text"
            danger
            onClick={onRemove}
            disabled={canRemove === false}
          >
            {removeLabel ?? "Remove"}
          </Button>
        </div>
      )}
    </Space>
  );
}
