import type { CheckboxListProps } from "@aidbox-forms/theme";

export function CheckboxList<T>({
  options,
  value,
  onChange,
  inputName,
  ariaLabelledBy,
  ariaDescribedBy,
  readOnly,
  isLoading,
  renderErrors,
  after,
}: CheckboxListProps<T>) {
  return (
    <div
      className="nhsuk-checkboxes"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = `${inputName}-option-${index}`;
        const isChecked = value.has(option.key);
        const disableToggle = readOnly || isLoading || option.disabled;
        return (
          <div className="nhsuk-checkboxes__item" key={option.key}>
            <input
              className="nhsuk-checkboxes__input"
              type="checkbox"
              name={inputName}
              id={optionId}
              checked={isChecked}
              disabled={disableToggle}
              onChange={() => onChange(option.key)}
            />
            <label
              className="nhsuk-label nhsuk-checkboxes__label"
              htmlFor={optionId}
            >
              {option.label}
            </label>
            {renderErrors ? renderErrors(option.key) : null}
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
