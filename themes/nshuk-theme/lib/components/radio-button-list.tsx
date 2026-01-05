import type { RadioButtonListProps } from "@aidbox-forms/theme";

export function RadioButtonList({
  options,
  token,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading,
  after,
  afterInset = false,
}: RadioButtonListProps) {
  const makeInputId = (token: string) => (id ? `${id}-${token}` : undefined);

  return (
    <div className="nhsuk-form-group">
      <div
        className="nhsuk-radios"
        role="radiogroup"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading || undefined}
      >
        {options.map((entry) => {
          const optionId = makeInputId(entry.token);
          return (
            <div key={entry.token} className="nhsuk-radios__item">
              <input
                className="nhsuk-radios__input"
                id={optionId}
                type="radio"
                name={id}
                value={entry.token}
                checked={token === entry.token}
                disabled={disabled || entry.disabled}
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
