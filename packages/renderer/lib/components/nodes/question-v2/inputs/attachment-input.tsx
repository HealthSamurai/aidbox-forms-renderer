import "./attachment-input.css";
import classNames from "classnames";
import { useRef } from "react";
import type { Attachment } from "fhir/r5";
import {
  prepareAttachmentFromFile,
  pruneAttachment,
} from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

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
  const { Button } = useTheme();
  const attachment = value ?? {};
  const hasAttachment = value != null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <div>
      <input
        ref={fileInputRef}
        id={`${inputId ?? "attachment"}-file`}
        type="file"
        onChange={(event) => {
          void handleFileChange(event);
        }}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        className={classNames("af-attachment-input", {
          "af-attachment-input--hidden": hasAttachment,
        })}
      />
      {hasAttachment ? (
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedById}
          className="af-attachment-summary"
        >
          <span className="af-attachment-summary__label">
            {displayLabel}
            {sizeKb !== undefined ? ` (${sizeKb} KB)` : ""}
          </span>
          {!disabled ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleTriggerFilePicker}
            >
              Change file
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearFile}
            disabled={disabled}
          >
            Clear attachment
          </Button>
        </div>
      ) : null}
    </div>
  );
}
