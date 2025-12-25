import { styled } from "@linaria/react";
import { optionStatusClass } from "./option-status.ts";
import type { ReactNode } from "react";

type OptionEntry<TValue> = {
  key: string;
  label: string;
  value: TValue;
  disabled?: boolean;
};

export type CheckboxListProps<TValue> = {
  options: ReadonlyArray<OptionEntry<TValue>>;
  value: Set<string>;
  onChange: (key: string) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  isLoading?: boolean;
  renderErrors?: (key: string) => ReactNode;
  after?: ReactNode;
};

export function CheckboxList<TValue>({
  options,
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
  renderErrors,
  after,
}: CheckboxListProps<TValue>) {
  return (
    <CheckboxControl
      data-disabled={disabled}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = `${id}-option-${index}`;
        const isChecked = value.has(option.key);
        const disableToggle = disabled || isLoading || option.disabled;

        return (
          <CheckboxOption key={option.key}>
            <CheckboxLabel>
              <input
                type="checkbox"
                name={id}
                checked={isChecked}
                disabled={disableToggle}
                aria-labelledby={`${ariaLabelledBy} ${optionId}`}
                aria-describedby={ariaDescribedBy}
                onChange={() => onChange(option.key)}
              />
              <span id={optionId}>{option.label}</span>
            </CheckboxLabel>
            {renderErrors ? renderErrors(option.key) : null}
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
