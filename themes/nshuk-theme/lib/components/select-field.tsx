import type { SelectFieldProps } from "@aidbox-forms/theme";

export function SelectField({
  options,
  selectValue,
  onChange,
  legacyOption,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading,
}: SelectFieldProps) {
  return (
    <div aria-busy={isLoading || undefined}>
      <select
        id={inputId}
        className="nhsuk-select"
        value={selectValue}
        onChange={(event) => onChange(event.target.value)}
        disabled={readOnly || isLoading}
        aria-labelledby={labelId}
        aria-describedby={describedById}
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
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
