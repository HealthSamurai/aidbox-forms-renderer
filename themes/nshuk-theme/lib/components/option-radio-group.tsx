import type { OptionRadioGroupProps } from "@aidbox-forms/theme";

export function OptionRadioGroup({
  options,
  selectValue,
  onChange,
  legacyOptionLabel,
  legacyOptionKey,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading,
}: OptionRadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={describedById}
      aria-busy={isLoading || undefined}
    >
      {legacyOptionLabel && legacyOptionKey ? (
        <label className="nhsuk-radios__item">
          <input
            type="radio"
            name={inputId}
            value={legacyOptionKey}
            checked={selectValue === legacyOptionKey}
            disabled
            readOnly
          />
          {legacyOptionLabel}
        </label>
      ) : null}
      {options.map((entry) => (
        <label key={entry.key} className="nhsuk-radios__item">
          <input
            type="radio"
            name={inputId}
            value={entry.key}
            checked={selectValue === entry.key}
            disabled={readOnly || entry.disabled}
            onChange={(event) => onChange(event.target.value)}
          />
          {entry.label}
        </label>
      ))}
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
