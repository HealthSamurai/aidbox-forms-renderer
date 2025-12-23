import type { CheckboxGroupProps } from "@aidbox-forms/theme";

export function CheckboxGroup<T>({
  options,
  selectedKeys,
  onToggle,
  inputName,
  labelId,
  describedById,
  readOnly,
  isLoading,
  renderErrors,
  after,
}: CheckboxGroupProps<T>) {
  return (
    <div
      className="nhsuk-checkboxes"
      aria-labelledby={labelId}
      aria-describedby={describedById}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = `${inputName}-option-${index}`;
        const isChecked = selectedKeys.has(option.key);
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
              onChange={() => onToggle(option.key)}
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
