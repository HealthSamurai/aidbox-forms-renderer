import { styled } from "@linaria/react";
import type { CheckboxListProps } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";

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
  isLoading = false,
}: CheckboxListProps) {
  const displayOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedByToken = new Map(
    selectedOptions.map((option) => [option.token, option]),
  );
  const specifyOtherToken = specifyOtherOption?.token;
  const isCustomActive = Boolean(customOptionForm && specifyOtherToken);
  const hasOptions = displayOptions.length > 0;

  return (
    <Stack
      data-disabled={disabled}
      aria-busy={isLoading || undefined}
      role="group"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {hasOptions ? (
        <OptionsList>
          {displayOptions.map((option, index) => {
            const optionId = `${id}-option-${index}`;
            const selectedOption = selectedByToken.get(option.token);
            const isSpecifyOtherOption = option.token === specifyOtherToken;
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
                      isSpecifyOtherOption
                        ? isCustomActive || Boolean(selectedOption)
                        : Boolean(selectedOption)
                    }
                    disabled={
                      disabled ||
                      isLoading ||
                      (option.disabled &&
                        !(isSpecifyOtherOption && isCustomActive))
                    }
                    aria-labelledby={`${ariaLabelledBy} ${optionId}`}
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
        </OptionsList>
      ) : null}
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {customOptionForm ? (
        <CustomFormSlot>{customOptionForm}</CustomFormSlot>
      ) : null}
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionsList = styled.div`
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

const CustomFormSlot = styled.div``;
