import type { GroupListProperties } from "@aidbox-forms/theme";
import { Button, Space } from "antd";

export function GroupList({
  linkId,
  header,
  children,
  onAdd,
  canAdd,
  addLabel,
}: GroupListProperties) {
  return (
    <div data-linkid={linkId}>
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        {header}
        {children}
        {onAdd && (
          <Button onClick={onAdd} disabled={canAdd === false}>
            {addLabel ?? "Add"}
          </Button>
        )}
      </Space>
    </div>
  );
}
