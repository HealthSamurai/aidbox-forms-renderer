import { styled } from "@linaria/react";
import type { CheckboxListProps } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";

export function CheckboxList({
  options,
  selectedOptions,
  customOption,
  customOptionForm,
  onSelect,
  onDeselect,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
}: CheckboxListProps) {
  const displayOptions = customOption ? [...options, customOption] : options;
  const selectedByToken = new Map(
    selectedOptions.map((option) => [option.token, option]),
  );
  const customOptionToken = customOption?.token;
  const isCustomActive = Boolean(customOptionForm && customOptionToken);

  return (
    <CheckboxControl
      data-disabled={disabled}
      aria-busy={isLoading || undefined}
      role="group"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {displayOptions.map((option, index) => {
        const optionId = `${id}-option-${index}`;
        const selectedOption = selectedByToken.get(option.token);
        const isCustomOption = option.token === customOptionToken;
        const optionAriaDescribedBy =
          [ariaDescribedBy, selectedOption?.ariaDescribedBy]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <CheckboxOption key={option.token}>
            <CheckboxLabel>
              <input
                type="checkbox"
                name={id}
                checked={
                  isCustomOption
                    ? isCustomActive || Boolean(selectedOption)
                    : Boolean(selectedOption)
                }
                disabled={
                  disabled ||
                  isLoading ||
                  (option.disabled && !(isCustomOption && isCustomActive))
                }
                aria-labelledby={
                  ariaLabelledBy ? `${ariaLabelledBy} ${optionId}` : optionId
                }
                aria-describedby={optionAriaDescribedBy}
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelect(option.token);
                  } else {
                    onDeselect(option.token);
                  }
                }}
              />
              <span id={optionId}>{option.label}</span>
            </CheckboxLabel>
            {selectedOption?.errors ?? null}
          </CheckboxOption>
        );
      })}
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {customOptionForm ? (
        <AfterContainer>{customOptionForm}</AfterContainer>
      ) : null}
    </CheckboxControl>
  );
}

const CheckboxControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CheckboxOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const AfterContainer = styled.div`
  margin-top: 0.5rem;
`;
