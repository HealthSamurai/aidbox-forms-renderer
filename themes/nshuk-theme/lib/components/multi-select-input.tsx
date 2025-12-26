import type { MultiSelectInputProps } from "@aidbox-forms/theme";

export function MultiSelectInput({
  options,
  token = "",
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  showOptions = true,
  chips,
  actions,
  dialog,
  placeholder,
}: MultiSelectInputProps) {
  const handleSelectChange = (token: string) => {
    if (!token) return;
    onChange(token);
  };

  const renderOptions = () => {
    if (!showOptions) return null;

    return (
      <select
        id={ariaLabelledBy ? `${ariaLabelledBy}-multi-select` : undefined}
        className="nhsuk-select"
        value={token}
        onChange={(event) => handleSelectChange(event.target.value)}
        disabled={disabled || isLoading}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        <option value="">{placeholder ?? "Select an option"}</option>
        {options.map((entry) => (
          <option
            key={entry.token}
            value={entry.token}
            disabled={entry.disabled}
          >
            {entry.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="nhsuk-form-group" aria-busy={isLoading || undefined}>
      {dialog && dialog.open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="nhsuk-u-padding-4 nhsuk-u-margin-bottom-3 nhsuk-u-bg-white"
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
          }}
        >
          <h3 className="nhsuk-heading-s nhsuk-u-margin-bottom-3">
            {dialog.title}
          </h3>
          <div className="nhsuk-u-margin-bottom-3">{dialog.content}</div>
          {dialog.actions}
        </div>
      ) : null}
      {chips.length > 0 ? (
        <div className="nhsuk-u-margin-bottom-3">
          {chips.map((chip) => (
            <div
              key={chip.token}
              className="nhsuk-u-margin-bottom-2"
              style={{
                border: "1px solid #d8dde0",
                borderRadius: "9999px",
                padding: "0.25rem 0.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {chip.content}
              {chip.onRemove ? (
                <button
                  type="button"
                  className="nhsuk-link"
                  onClick={chip.onRemove}
                  aria-label={chip.removeLabel ?? "Remove"}
                  disabled={disabled || chip.removeDisabled}
                >
                  Remove
                </button>
              ) : null}
              {chip.errors}
            </div>
          ))}
        </div>
      ) : null}
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      <div className="nhsuk-u-margin-bottom-3">{renderOptions()}</div>
      {actions}
    </div>
  );
}
