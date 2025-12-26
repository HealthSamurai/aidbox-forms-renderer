import { styled } from "@linaria/react";
import type { CheckboxListProps } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";

export function CheckboxList({
  options,
  tokens,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
  renderErrors,
  after,
}: CheckboxListProps) {
  return (
    <CheckboxControl
      data-disabled={disabled}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = `${id}-option-${index}`;
        const isChecked = tokens.has(option.token);
        const disableToggle = disabled || isLoading || option.disabled;

        return (
          <CheckboxOption key={option.token}>
            <CheckboxLabel>
              <input
                type="checkbox"
                name={id}
                checked={isChecked}
                disabled={disableToggle}
                aria-labelledby={`${ariaLabelledBy} ${optionId}`}
                aria-describedby={ariaDescribedBy}
                onChange={() => onChange(option.token)}
              />
              <span id={optionId}>{option.label}</span>
            </CheckboxLabel>
            {renderErrors ? renderErrors(option.token) : null}
          </CheckboxOption>
        );
      })}
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {after ? <AfterContainer>{after}</AfterContainer> : null}
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
