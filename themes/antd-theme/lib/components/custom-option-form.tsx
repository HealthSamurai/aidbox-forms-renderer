import type { CustomOptionFormProperties } from "@aidbox-forms/theme";
import { Button, Card, Space } from "antd";

export function CustomOptionForm({
  content,
  errors,
  submit,
  cancel,
}: CustomOptionFormProperties) {
  return (
    <Card size="small">
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        {content}
        {errors}
        <Space wrap>
          <Button
            type="primary"
            onClick={submit.onClick}
            disabled={submit.disabled === true}
          >
            {submit.label}
          </Button>
          <Button onClick={cancel.onClick} disabled={cancel.disabled === true}>
            {cancel.label}
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
