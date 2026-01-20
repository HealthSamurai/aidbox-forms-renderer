import { styled } from "@linaria/react";
import type { CheckboxListProperties } from "@formbox/theme";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function CheckboxList({
  options,
  selectedOptions,
  onSelect,
  onDeselect,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading,
}: CheckboxListProperties) {
  const selectedByToken = new Map(
    selectedOptions.map((option) => [option.token, option]),
  );
  const specifyOtherToken = specifyOtherOption?.token;
  const isCustomActive = Boolean(customOptionForm && specifyOtherToken);

  const renderOption = (option: (typeof options)[number], index: number) => {
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
        <Label
          className="nhsuk-label nhsuk-checkboxes__label"
          htmlFor={optionId}
          id={optionLabelId}
        >
          {option.label}
        </Label>
        {selectedOption?.errors ?? undefined}
      </div>
    );
  };

  return (
    <div
      id={id}
      className="nhsuk-checkboxes nhsuk-checkboxes--small"
      role="group"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => renderOption(option, index))}
      {specifyOtherOption && (
        <>
          {options.length > 0 && (
            <div className="nhsuk-checkboxes__divider">or</div>
          )}
          {renderOption(specifyOtherOption, options.length)}
        </>
      )}
      {isLoading && <LoadingSpinner showLabel />}
      {customOptionForm && (
        <div className="nhsuk-u-padding-top-2">{customOptionForm}</div>
      )}
    </div>
  );
}

const Label = styled.label`
  padding-right: 0;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
