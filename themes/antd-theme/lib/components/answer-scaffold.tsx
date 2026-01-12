import type {
  AnswerRemoveButtonProperties,
  AnswerScaffoldProperties,
} from "@aidbox-forms/theme";
import { Button, Space } from "antd";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Space align="start" style={{ width: "100%" }}>
        <div style={{ flex: 1, minWidth: 0 }}>{control}</div>
        {onRemove && (
          <AnswerRemoveButton
            onClick={onRemove}
            disabled={canRemove === false}
            text="Remove"
          />
        )}
      </Space>
      {errors}
      {children}
    </Space>
  );
}

export function AnswerRemoveButton({
  onClick,
  disabled,
  text,
}: AnswerRemoveButtonProperties) {
  return (
    <Button type="text" danger onClick={onClick} disabled={disabled}>
      {text}
    </Button>
  );
}
