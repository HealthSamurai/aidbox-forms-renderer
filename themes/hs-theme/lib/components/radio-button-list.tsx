import { styled } from "@linaria/react";
import type { ReactNode } from "react";
import { optionStatusClass } from "./option-status.ts";

export type RadioButtonListProps = {
  options: ReadonlyArray<{
    key: string;
    label: string;
    disabled?: boolean;
  }>;
  value: string;
  onChange: (value: string) => void;
  legacyOptionLabel: string | undefined;
  legacyOptionKey: string | undefined;
  inputId: string;
  ariaLabelledBy: string;
  ariaDescribedBy: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
  after?: ReactNode;
  afterInset?: boolean;
};

export function RadioButtonList({
  options,
  value,
  onChange,
  legacyOptionLabel,
  legacyOptionKey,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  readOnly,
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
        {legacyOptionLabel && legacyOptionKey ? (
          <RadioOption>
            <RadioLabel>
              <input
                type="radio"
                name={inputId}
                value={legacyOptionKey}
                checked={value === legacyOptionKey}
                disabled
                readOnly
              />
              {legacyOptionLabel}
            </RadioLabel>
          </RadioOption>
        ) : null}
        {options.map((entry) => (
          <RadioOption key={entry.key}>
            <RadioLabel>
              <input
                type="radio"
                name={inputId}
                value={entry.key}
                checked={value === entry.key}
                disabled={readOnly || entry.disabled}
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
