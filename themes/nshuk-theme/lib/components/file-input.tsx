import type { FileInputProps } from "@aidbox-forms/theme";
import { useRef, type ChangeEvent } from "react";

export function FileInput({
  inputId,
  labelId,
  describedById,
  disabled,
  filename,
  sizeLabel,
  onFileSelect,
  onClear,
}: FileInputProps) {
  const hasAttachment = Boolean(filename);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      onFileSelect?.(file);
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="nhsuk-form-group">
      <input
        ref={fileInputRef}
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        className="nhsuk-file-upload"
        disabled={disabled}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {hasAttachment ? (
        <div
          className="nhsuk-u-margin-top-2"
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedById}
        >
          <p className="nhsuk-body">{filename}</p>
          {sizeLabel ? (
            <p className="nhsuk-hint nhsuk-u-margin-bottom-2">{sizeLabel}</p>
          ) : null}
          <div className="nhsuk-button-group">
            {!disabled ? (
              <button
                className="nhsuk-button nhsuk-button--secondary"
                type="button"
                onClick={handlePickFile}
              >
                Change file
              </button>
            ) : null}
            <button
              className="nhsuk-button nhsuk-button--secondary"
              type="button"
              onClick={onClear}
              disabled={disabled}
            >
              Clear attachment
            </button>
          </div>
        </div>
      ) : (
        <button
          className="nhsuk-button nhsuk-button--secondary"
          type="button"
          onClick={handlePickFile}
          disabled={disabled}
        >
          Choose file
        </button>
      )}
    </div>
  );
}
