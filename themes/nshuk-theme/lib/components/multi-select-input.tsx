import type { MultiSelectInputProps } from "@aidbox-forms/theme";

export function MultiSelectInput({
  options,
  selectValue = "",
  onSelectOption,
  labelId,
  describedById,
  readOnly = false,
  isLoading = false,
  showOptions = true,
  chips,
  actions,
  dialog,
  selectPlaceholder,
}: MultiSelectInputProps) {
  const handleSelectChange = (key: string) => {
    if (!key) return;
    onSelectOption(key);
  };

  const renderOptions = () => {
    if (!showOptions) return null;

    return (
      <select
        id={labelId ? `${labelId}-multi-select` : undefined}
        className="nhsuk-select"
        value={selectValue}
        onChange={(event) => handleSelectChange(event.target.value)}
        disabled={readOnly || isLoading}
        aria-labelledby={labelId}
        aria-describedby={describedById}
      >
        <option value="">{selectPlaceholder ?? "Select an option"}</option>
        {options.map((entry) => (
          <option key={entry.key} value={entry.key} disabled={entry.disabled}>
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
              key={chip.key}
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
                  disabled={readOnly || chip.removeDisabled}
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
