import type { FileInputProps } from "@aidbox-forms/theme";
import { type ChangeEvent, useRef } from "react";

export function FileInput({
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  value,
  onChange,
}: FileInputProps) {
  const displayLabel = value?.title ?? value?.url ?? "Attachment selected";
  const displaySizeLabel =
    value?.size != null ? `${Math.round(value.size / 1024)} KB` : undefined;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      onChange?.(file);
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="nhsuk-form-group">
      <input
        ref={fileInputRef}
        id={id}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className="nhsuk-file-upload"
        disabled={disabled}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept={accept}
      />
      {value != null ? (
        <div
          className="nhsuk-u-margin-top-2"
          role="group"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <p className="nhsuk-body">{displayLabel}</p>
          {displaySizeLabel ? (
            <p className="nhsuk-hint nhsuk-u-margin-bottom-2">
              {displaySizeLabel}
            </p>
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
              onClick={() => onChange?.(null)}
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
