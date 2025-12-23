import { useRef } from "react";
import type { Attachment } from "fhir/r5";
import type { AttachmentInputProps as ThemeAttachmentInputProps } from "@aidbox-forms/theme";
import {
  prepareAttachmentFromFile,
  pruneAttachment,
} from "../../../../../utils.ts";
import { useTheme } from "../../../../../ui/theme.tsx";

export type AttachmentInputProps = {
  value: Attachment | null;
  onChange: (value: Attachment | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  disabled?: boolean | undefined;
};

export function AttachmentInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  disabled,
}: AttachmentInputProps) {
  const { AttachmentInput: ThemedAttachmentInput } = useTheme();
  const attachment = value ?? {};
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  type ThemeAttachment = ThemeAttachmentInputProps["value"];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const updated = await prepareAttachmentFromFile(file, attachment);
      onChange(pruneAttachment(updated));
    } finally {
      input.value = "";
    }
  };

  const handleClearFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFilePicker = () => {
    if (disabled) {
      return;
    }
    fileInputRef.current?.click();
  };

  const sizeKb =
    typeof attachment.size === "number"
      ? Math.round(attachment.size / 1024)
      : undefined;

  const displayLabel =
    attachment.title ?? attachment.url ?? "Attachment selected";

  const inputIdentifier = `${inputId ?? "attachment"}-file`;

  return (
    <>
      <input
        ref={fileInputRef}
        id={inputIdentifier}
        type="file"
        onChange={(event) => {
          void handleFileChange(event);
        }}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        style={{ display: "none" }}
      />
      <ThemedAttachmentInput
        inputId={inputIdentifier}
        labelId={labelId}
        describedById={describedById}
        disabled={disabled}
        filename={displayLabel}
        sizeLabel={sizeKb !== undefined ? `${sizeKb} KB` : undefined}
        value={value as ThemeAttachment}
        onPickFile={handleTriggerFilePicker}
        onClear={handleClearFile}
        onChange={(next) => onChange(next as Attachment | null)}
      />
    </>
  );
}
