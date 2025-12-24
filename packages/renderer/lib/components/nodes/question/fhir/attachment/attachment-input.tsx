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
  type ThemeAttachment = ThemeAttachmentInputProps["value"];

  const handleFileSelect = async (file: File) => {
    const updated = await prepareAttachmentFromFile(file, attachment);
    onChange(pruneAttachment(updated));
  };

  const handleClearFile = () => {
    onChange(null);
  };

  const sizeKb =
    typeof attachment.size === "number"
      ? Math.round(attachment.size / 1024)
      : undefined;

  const displayLabel =
    attachment.title ?? attachment.url ?? "Attachment selected";

  const inputIdentifier = `${inputId ?? "attachment"}-file`;

  return (
    <ThemedAttachmentInput
      inputId={inputIdentifier}
      labelId={labelId}
      describedById={describedById}
      disabled={disabled}
      filename={displayLabel}
      sizeLabel={sizeKb !== undefined ? `${sizeKb} KB` : undefined}
      value={value as ThemeAttachment}
      onFileSelect={(file) => {
        void handleFileSelect(file);
      }}
      onClear={handleClearFile}
      onChange={(next) => onChange(next as Attachment | null)}
    />
  );
}
