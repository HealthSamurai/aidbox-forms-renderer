import type { RadioGroupProps } from "@aidbox-forms/theme";

export function RadioGroup({
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
}: RadioGroupProps) {
  const makeInputId = (key: string) =>
    inputId ? `${inputId}-${key}` : undefined;

  return (
    <div className="nhsuk-form-group">
      <div
        className="nhsuk-radios"
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedById}
        aria-busy={isLoading || undefined}
      >
        {legacyOptionLabel && legacyOptionKey ? (
          <div className="nhsuk-radios__item">
            <input
              className="nhsuk-radios__input"
              id={makeInputId(legacyOptionKey)}
              type="radio"
              name={inputId}
              value={legacyOptionKey}
              checked={selectValue === legacyOptionKey}
              disabled
              readOnly
              aria-describedby={describedById}
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor={makeInputId(legacyOptionKey)}
            >
              {legacyOptionLabel}
            </label>
          </div>
        ) : null}
        {options.map((entry) => {
          const optionId = makeInputId(entry.key);
          return (
            <div key={entry.key} className="nhsuk-radios__item">
              <input
                className="nhsuk-radios__input"
                id={optionId}
                type="radio"
                name={inputId}
                value={entry.key}
                checked={selectValue === entry.key}
                disabled={readOnly || entry.disabled}
                onChange={(event) => onChange(event.target.value)}
                aria-describedby={describedById}
              />
              <label
                className="nhsuk-label nhsuk-radios__label"
                htmlFor={optionId}
              >
                {entry.label}
              </label>
            </div>
          );
        })}
      </div>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
