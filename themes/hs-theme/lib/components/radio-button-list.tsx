import { styled } from "@linaria/react";
import type { RadioButtonListProps } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";

export function RadioButtonList({
  options,
  token,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
  after,
  afterInset = false,
}: RadioButtonListProps) {
  return (
    <>
      <RadioGroupContainer
        role="radiogroup"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading || undefined}
      >
        {options.map((entry) => (
          <RadioOption key={entry.token}>
            <RadioLabel>
              <input
                type="radio"
                name={id}
                value={entry.token}
                checked={token === entry.token}
                disabled={disabled || entry.disabled}
                onChange={(event) => onChange(event.target.value)}
              />
              {entry.label}
            </RadioLabel>
          </RadioOption>
        ))}
      </RadioGroupContainer>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {after ? (
        <AfterContainer data-inset={afterInset ? "true" : undefined}>
          {after}
        </AfterContainer>
      ) : null}
    </>
  );
}

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

const AfterContainer = styled.div`
  margin-top: 0.5rem;

  &[data-inset="true"] {
    margin-left: 1.5rem;
  }
`;
