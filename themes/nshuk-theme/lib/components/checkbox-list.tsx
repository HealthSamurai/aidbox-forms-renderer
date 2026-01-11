import type { CheckboxListProperties } from "@aidbox-forms/theme";
import { LoadingSpinner } from "./loading-spinner.tsx";

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
}: CheckboxListProperties) {
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
            {selectedOption?.errors ?? undefined}
          </div>
        );
      })}
      {isLoading && <LoadingSpinner showLabel />}
      {Boolean(customOptionForm) && <div>{customOptionForm}</div>}
    </div>
  );
}
