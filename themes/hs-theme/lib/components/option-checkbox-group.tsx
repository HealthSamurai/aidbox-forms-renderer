import "./option-status.css";
import "./text-input.css";
import type { ReactNode } from "react";

type OptionEntry<TValue> = {
  key: string;
  label: string;
  value: TValue;
  disabled?: boolean;
};

export type OptionCheckboxGroupProps<TValue> = {
  options: ReadonlyArray<OptionEntry<TValue>>;
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
  inputName: string;
  labelId: string;
  describedById?: string | undefined;
  readOnly?: boolean;
  isLoading?: boolean;
  renderErrors?: (key: string) => ReactNode;
};

export function OptionCheckboxGroup<TValue>({
  options,
  selectedKeys,
  onToggle,
  inputName,
  labelId,
  describedById,
  readOnly,
  isLoading = false,
  renderErrors,
}: OptionCheckboxGroupProps<TValue>) {
  return (
    <div
      className="af-checkbox-control"
      data-readonly={readOnly}
      aria-busy={isLoading || undefined}
    >
      {options.map((option, index) => {
        const optionId = `${inputName}-option-${index}`;
        const isChecked = selectedKeys.has(option.key);
        const disableNewSelection =
          readOnly || isLoading || (!isChecked && option.disabled);

        return (
          <div className="af-checkbox-option" key={option.key}>
            <label className="af-checkbox-option__label">
              <input
                type="checkbox"
                name={inputName}
                checked={isChecked}
                disabled={disableNewSelection}
                aria-labelledby={`${labelId} ${optionId}`}
                aria-describedby={describedById}
                onChange={() => onToggle(option.key)}
              />
              <span id={optionId}>{option.label}</span>
            </label>
            {renderErrors ? renderErrors(option.key) : null}
          </div>
        );
      })}
      {isLoading ? (
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
