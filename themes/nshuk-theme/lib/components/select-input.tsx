import type { SelectInputProps } from "@aidbox-forms/theme";

export function SelectInput({
  options,
  value,
  onChange,
  legacyOption,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  readOnly,
  isLoading,
  onClear,
  clearLabel,
}: SelectInputProps) {
  return (
    <div aria-busy={isLoading || undefined}>
      <div className="nhsuk-u-display-flex nhsuk-u-align-items-center nhsuk-u-gap-3">
        <select
          id={inputId}
          className="nhsuk-select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={readOnly || isLoading}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <option value="">Select an option</option>
          {legacyOption ? (
            <option value={legacyOption.key} disabled>
              {legacyOption.label}
            </option>
          ) : null}
          {options.map((entry) => (
            <option key={entry.key} value={entry.key} disabled={entry.disabled}>
              {entry.label}
            </option>
          ))}
        </select>
        {onClear ? (
          <button
            className="nhsuk-button nhsuk-button--secondary"
            type="button"
            onClick={onClear}
            disabled={readOnly}
          >
            {clearLabel ?? "Clear"}
          </button>
        ) : null}
      </div>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
