import type { RadioButtonListProperties } from "@aidbox-forms/theme";

export function RadioButtonList({
  options,
  selectedOption,
  onChange,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading,
}: RadioButtonListProperties) {
  const displayOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedToken = selectedOption?.token ?? "";
  const makeInputId = (token: string) => `${id}-${token}`;

  return (
    <div className="nhsuk-form-group">
      <div
        className="nhsuk-radios"
        role="radiogroup"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading || undefined}
      >
        {displayOptions.map((entry) => {
          const optionId = makeInputId(entry.token);
          return (
            <div key={entry.token} className="nhsuk-radios__item">
              <input
                className="nhsuk-radios__input"
                id={optionId}
                type="radio"
                name={id}
                value={entry.token}
                checked={selectedToken === entry.token}
                disabled={disabled || isLoading || entry.disabled}
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
      ) : undefined}
      {customOptionForm ? (
        <div className="nhsuk-u-padding-left-4">{customOptionForm}</div>
      ) : undefined}
    </div>
  );
}
