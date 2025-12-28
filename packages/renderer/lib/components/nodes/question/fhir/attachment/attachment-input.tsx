import type { Attachment } from "fhir/r5";
import type { FileInputProps as ThemeFileInputProps } from "@aidbox-forms/theme";
import {
  formatString,
  prepareAttachmentFromFile,
  pruneAttachment,
} from "../../../../../utils.ts";
import { useTheme } from "../../../../../ui/theme.tsx";
import { strings } from "../../../../../strings.ts";

export type AttachmentInputProps = {
  value: Attachment | null;
  onChange: (value: Attachment | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

export function AttachmentInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: AttachmentInputProps) {
  const { FileInput: ThemedFileInput } = useTheme();
  const attachment = value ?? {};
  type ThemeAttachment = ThemeFileInputProps["value"];

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
    attachment.title ?? attachment.url ?? strings.inputs.attachmentSelected;

  const inputIdentifier = `${id ?? "attachment"}-file`;

  return (
    <ThemedFileInput
      id={inputIdentifier}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={disabled}
      filename={displayLabel}
      sizeLabel={
        sizeKb !== undefined
          ? formatString(strings.file.sizeLabelKb, {
              sizeKb,
            })
          : undefined
      }
      value={value as ThemeAttachment}
      onFileSelect={(file) => {
        void handleFileSelect(file);
      }}
      onClear={handleClearFile}
      onChange={(next) => onChange(next as Attachment | null)}
    />
  );
}
