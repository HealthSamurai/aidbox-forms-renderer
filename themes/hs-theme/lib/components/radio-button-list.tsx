import { styled } from "@linaria/react";
import type { RadioButtonListProperties } from "@aidbox-forms/theme";
import { LoadingSpinner } from "./loading-spinner.tsx";

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
  isLoading = false,
}: RadioButtonListProperties) {
  const displayOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedToken = selectedOption?.token ?? "";
  const hasOptions = displayOptions.length > 0;

  return (
    <Stack id={id}>
      {hasOptions && (
        <RadioGroupContainer
          role="radiogroup"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-busy={isLoading || undefined}
        >
          {displayOptions.map((entry) => (
            <RadioOption key={entry.token}>
              <RadioLabel>
                <input
                  type="radio"
                  name={id}
                  value={entry.token}
                  checked={selectedToken === entry.token}
                  disabled={disabled || isLoading || entry.disabled}
                  onChange={(event) => onChange(event.target.value)}
                />
                {entry.label}
              </RadioLabel>
            </RadioOption>
          ))}
        </RadioGroupContainer>
      )}
      {isLoading && <LoadingSpinner showLabel />}
      {customOptionForm && <CustomFormSlot>{customOptionForm}</CustomFormSlot>}
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RadioOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const CustomFormSlot = styled.div`
  padding-left: 1.5rem;
`;
