import type { FileInputProperties } from "@aidbox-forms/theme";
import { Button, Space, Typography } from "antd";
import { useRef, type ChangeEvent } from "react";

export function FileInput({
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  value,
  onChange,
}: FileInputProperties) {
  const fileInputReference = useRef<HTMLInputElement | null>(null);
  const hasValue = value != undefined;
  const displayLabel =
    value?.title ??
    value?.url ??
    (hasValue ? "Attachment selected" : "Choose file");
  const displaySizeLabel =
    value?.size == undefined ? "" : `${Math.round(value.size / 1024)} KB`;
  const textProperties = hasValue ? {} : ({ type: "secondary" } as const);

  const handlePickFile = () => {
    if (disabled === true) return;
    fileInputReference.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file === undefined) return;
    try {
      onChange?.(file);
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <Space align="center" wrap>
      <input
        ref={fileInputReference}
        id={id}
        type="file"
        onChange={handleFileChange}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={disabled === true}
        accept={accept}
        style={{ display: "none" }}
      />
      <Button onClick={handlePickFile} disabled={disabled === true}>
        {hasValue ? "Replace file" : "Choose file"}
      </Button>
      <Typography.Text {...textProperties}>
        {displayLabel}
        {displaySizeLabel ? ` (${displaySizeLabel})` : ""}
      </Typography.Text>
      {hasValue && (
        <Button
          type="text"
          danger
          onClick={() => onChange?.()}
          disabled={disabled === true}
        >
          Clear
        </Button>
      )}
    </Space>
  );
}
