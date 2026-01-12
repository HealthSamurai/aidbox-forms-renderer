import { ActionIcon, Button, Group, Text } from "@mantine/core";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import type { FileInputProperties } from "@aidbox-forms/theme";

export function FileInput({
  value,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  onChange,
}: FileInputProperties) {
  const fileInputReference = useRef<HTMLInputElement | null>(null);
  const isDisabled = disabled === true;

  const isEmpty = value == undefined;
  const hasValue = value != undefined;
  const displayLabel =
    value?.title ??
    value?.url ??
    (isEmpty ? "Choose file" : "Attachment selected");
  const displaySizeLabel =
    value?.size == undefined ? "" : `${Math.round(value.size / 1024)} KB`;

  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const acceptProperties = accept == undefined ? {} : { accept };

  const handlePickFile = () => {
    if (isDisabled) return;
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

  const textColorProperties = isEmpty ? { c: "dimmed" as const } : {};

  return (
    <Group wrap="nowrap" gap="xs" align="center">
      <input
        ref={fileInputReference}
        id={id}
        type="file"
        onChange={handleFileChange}
        disabled={isDisabled}
        aria-labelledby={ariaLabelledBy}
        {...describedByProperties}
        {...acceptProperties}
        style={{ display: "none" }}
      />
      <Button
        type="button"
        variant="default"
        onClick={handlePickFile}
        disabled={isDisabled}
        aria-labelledby={ariaLabelledBy}
        {...describedByProperties}
      >
        {hasValue ? "Change file" : "Choose file"}
      </Button>
      <Text
        size="sm"
        {...textColorProperties}
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {displayLabel}
        {displaySizeLabel ? ` (${displaySizeLabel})` : ""}
      </Text>
      {hasValue ? (
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => onChange?.()}
          disabled={isDisabled}
          aria-label="Clear attachment"
        >
          ×
        </ActionIcon>
      ) : undefined}
    </Group>
  );
}
