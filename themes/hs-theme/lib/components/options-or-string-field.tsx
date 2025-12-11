import "./option-status.css";
import "./text-input.css";
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
    <div className="af-open-choice">
      <div className="af-open-choice__select">
        <select
          id={`${inputId}-select`}
          className="af-input"
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
        </select>
      </div>
      <div className="af-open-choice__input">{renderInput()}</div>
      {isLoading ? (
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
