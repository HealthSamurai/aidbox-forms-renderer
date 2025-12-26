import type { SelectInputProps } from "@aidbox-forms/theme";

export function SelectInput({
  options,
  token,
  onChange,
  legacyOption,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading,
  onClear,
  clearLabel,
}: SelectInputProps) {
  return (
    <div aria-busy={isLoading || undefined}>
      <div className="nhsuk-u-display-flex nhsuk-u-align-items-center nhsuk-u-gap-3">
        <select
          id={id}
          className="nhsuk-select"
          value={token}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled || isLoading}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <option value="">Select an option</option>
          {legacyOption ? (
            <option value={legacyOption.token} disabled>
              {legacyOption.label}
            </option>
          ) : null}
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
        {onClear ? (
          <button
            className="nhsuk-button nhsuk-button--secondary"
            type="button"
            onClick={onClear}
            disabled={disabled}
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
