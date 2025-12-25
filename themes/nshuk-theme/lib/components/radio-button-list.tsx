import type { RadioButtonListProps } from "@aidbox-forms/theme";

export function RadioButtonList({
  options,
  value,
  onChange,
  legacyOption,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  readOnly,
  isLoading,
  after,
  afterInset = false,
}: RadioButtonListProps) {
  const makeInputId = (key: string) => (id ? `${id}-${key}` : undefined);

  return (
    <div className="nhsuk-form-group">
      <div
        className="nhsuk-radios"
        role="radiogroup"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading || undefined}
      >
        {legacyOption ? (
          <div className="nhsuk-radios__item">
            <input
              className="nhsuk-radios__input"
              id={makeInputId(legacyOption.key)}
              type="radio"
              name={id}
              value={legacyOption.key}
              checked={value === legacyOption.key}
              disabled
              readOnly
              aria-describedby={ariaDescribedBy}
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor={makeInputId(legacyOption.key)}
            >
              {legacyOption.label}
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
                name={id}
                value={entry.key}
                checked={value === entry.key}
                disabled={readOnly || entry.disabled}
                onChange={(event) => onChange(event.target.value)}
                aria-describedby={ariaDescribedBy}
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
      {after ? (
        <div className={afterInset ? "nhsuk-u-padding-left-4" : undefined}>
          {after}
        </div>
      ) : null}
    </div>
  );
}
