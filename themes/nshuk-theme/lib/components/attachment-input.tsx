import type { AttachmentInputProps } from "@aidbox-forms/theme";

export function AttachmentInput({
  inputId,
  labelId,
  describedById,
  disabled,
  filename,
  sizeLabel,
  onPickFile,
  onClear,
}: AttachmentInputProps) {
  const hasAttachment = Boolean(filename);

  return (
    <div className="nhsuk-form-group">
      <input
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        className="nhsuk-file-upload"
        disabled={disabled}
        type="file"
        style={{ display: "none" }}
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
                onClick={onPickFile}
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
          onClick={onPickFile}
          disabled={disabled}
        >
          Choose file
        </button>
      )}
    </div>
  );
}
