import type { SelectOrStringFieldProps } from "@aidbox-forms/theme";

export function SelectOrStringField<T>({
  options,
  renderInput,
  getValueForKey,
  customOptionKey,
  selectValue,
  onSelectValue,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading,
}: SelectOrStringFieldProps<T>) {
  return (
    <div className="nhsuk-form-group" aria-busy={isLoading || undefined}>
      <div
        className="nhsuk-input__wrapper"
        style={{ display: "flex", gap: "0.5rem" }}
      >
        <select
          id={`${inputId}-select`}
          className="nhsuk-select"
          value={selectValue}
          onChange={(event) => {
            const key = event.target.value;
            if (key === customOptionKey) {
              return;
            }
            const nextValue = key ? getValueForKey(key) : null;
            onSelectValue(nextValue);
          }}
          disabled={readOnly || isLoading}
          aria-labelledby={labelId}
          aria-describedby={describedById}
        >
          <option value="">Select an option</option>
          <option value={customOptionKey}>Enter a custom value</option>
          {options.map((entry) => (
            <option key={entry.key} value={entry.key} disabled={entry.disabled}>
              {entry.label}
            </option>
          ))}
        </select>
        <div style={{ flex: 1 }}>{renderInput()}</div>
      </div>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
