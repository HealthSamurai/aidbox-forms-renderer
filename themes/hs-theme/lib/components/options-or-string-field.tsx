import { styled } from "@linaria/react";
import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";
import type { ReactElement } from "react";

type OptionsOrStringFieldProps<TValue> = {
  options: ReadonlyArray<{
    key: string;
    label: string;
    value?: TValue;
    disabled: boolean;
  }>;
  renderInput: () => ReactElement;
  getValueForKey: (key: string) => TValue | null;
  customOptionKey: string;
  selectValue: string;
  onSelectValue: (value: TValue | null) => void;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
};

export function OptionsOrStringField<TValue>({
  options,
  renderInput,
  getValueForKey,
  customOptionKey,
  selectValue,
  onSelectValue,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading = false,
}: OptionsOrStringFieldProps<TValue>) {
  return (
    <OpenChoice>
      <div>
        <Select
          id={`${inputId}-select`}
          className={inputClass}
          value={selectValue}
          onChange={(event) => {
            const key = event.target.value;
            if (key === customOptionKey) {
              return;
            }
            const nextValue = key ? getValueForKey(key) : null;
            onSelectValue(nextValue);
          }}
          disabled={readOnly || isLoading}
          aria-labelledby={labelId}
          aria-describedby={describedById}
          aria-busy={isLoading || undefined}
        >
          <option value="">Select an option</option>
          <option value={customOptionKey}>Enter a custom value</option>
          {options.map((entry) => (
            <option key={entry.key} value={entry.key} disabled={entry.disabled}>
              {entry.label}
            </option>
          ))}
        </Select>
      </div>
      <div>{renderInput()}</div>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </OpenChoice>
  );
}

const OpenChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
`;
