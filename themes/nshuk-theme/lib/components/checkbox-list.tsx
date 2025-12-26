import type { CheckboxListProps } from "@aidbox-forms/theme";

export function CheckboxList({
  options,
  tokens,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading,
  renderErrors,
  after,
}: CheckboxListProps) {
  return (
    <div
      className="nhsuk-checkboxes"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = `${id}-option-${index}`;
        const isChecked = tokens.has(option.token);
        const disableToggle = disabled || isLoading || option.disabled;
        return (
          <div className="nhsuk-checkboxes__item" key={option.token}>
            <input
              className="nhsuk-checkboxes__input"
              type="checkbox"
              name={id}
              id={optionId}
              checked={isChecked}
              disabled={disableToggle}
              onChange={() => onChange(option.token)}
            />
            <label
              className="nhsuk-label nhsuk-checkboxes__label"
              htmlFor={optionId}
            >
              {option.label}
            </label>
            {renderErrors ? renderErrors(option.token) : null}
          </div>
        );
      })}
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {after ? <div>{after}</div> : null}
    </div>
  );
}
