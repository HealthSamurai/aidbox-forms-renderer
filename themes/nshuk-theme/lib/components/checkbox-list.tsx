import type { CheckboxListProps } from "@aidbox-forms/theme";

export function CheckboxList({
  options,
  selectedOptions,
  specifyOtherOption,
  customOptionForm,
  onSelect,
  onDeselect,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading,
}: CheckboxListProps) {
  const resolvedOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedByToken = new Map(
    selectedOptions.map((option) => [option.token, option]),
  );
  const specifyOtherToken = specifyOtherOption?.token;
  const isCustomActive = Boolean(customOptionForm && specifyOtherToken);

  return (
    <div
      className="nhsuk-checkboxes"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading || undefined}
      role="group"
    >
      {resolvedOptions.map((option, index) => {
        const optionId = `${id}-option-${index}`;
        const optionLabelId = `${optionId}-label`;
        const selectedOption = selectedByToken.get(option.token);
        const isSpecifyOtherOption = option.token === specifyOtherToken;
        const optionAriaDescribedBy =
          [ariaDescribedBy, selectedOption?.ariaDescribedBy]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <div className="nhsuk-checkboxes__item" key={option.token}>
            <input
              className="nhsuk-checkboxes__input"
              type="checkbox"
              name={id}
              id={optionId}
              checked={
                isSpecifyOtherOption
                  ? isCustomActive || Boolean(selectedOption)
                  : Boolean(selectedOption)
              }
              disabled={
                disabled ||
                isLoading ||
                (option.disabled && !(isSpecifyOtherOption && isCustomActive))
              }
              aria-labelledby={`${ariaLabelledBy} ${optionLabelId}`}
              aria-describedby={optionAriaDescribedBy}
              onChange={(event) => {
                if (event.target.checked) {
                  onSelect(option.token);
                } else {
                  onDeselect(option.token);
                }
              }}
            />
            <label
              className="nhsuk-label nhsuk-checkboxes__label"
              htmlFor={optionId}
              id={optionLabelId}
            >
              {option.label}
            </label>
            {selectedOption?.errors ?? null}
          </div>
        );
      })}
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {customOptionForm ? <div>{customOptionForm}</div> : null}
    </div>
  );
}
