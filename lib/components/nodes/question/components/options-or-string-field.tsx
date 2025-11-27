import "./option-status.css";
import "../../../controls/text-input.css";
import type { ReactElement } from "react";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import type { RowRenderProps } from "../answer.tsx";

type OptionsOrStringFieldProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  options: ReadonlyArray<{
    key: string;
    label: string;
    value?: unknown;
    disabled: boolean;
  }>;
  renderInput: (rowProps: RowRenderProps<T>) => ReactElement;
  getValueForKey: (key: string) => string | null;
  getKeyForValue: (value: string | null) => string;
  customOptionKey: string;
  isLoading?: boolean;
};

export function OptionsOrStringField({
  node,
  rowProps,
  options,
  renderInput,
  getValueForKey,
  getKeyForValue,
  customOptionKey,
  isLoading = false,
}: OptionsOrStringFieldProps<"string" | "text">) {
  const { inputId, labelId, describedById, setValue, value } = rowProps;
  const optionKey = getKeyForValue(value);
  const hasCustomValue =
    optionKey === "" && value != null && value.trim().length > 0;
  const selectValue = hasCustomValue ? customOptionKey : optionKey;

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
            setValue(nextValue);
          }}
          disabled={node.readOnly || isLoading}
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
      <div className="af-open-choice__input">{renderInput(rowProps)}</div>
      {isLoading ? (
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
