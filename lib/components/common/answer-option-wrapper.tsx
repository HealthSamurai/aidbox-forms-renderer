import { ReactElement } from "react";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IQuestionNode,
} from "../../stores/types.ts";
import { useAnswerOptions } from "../questions/hooks/use-answer-options.ts";
import type { RowRenderProps } from "./answer.tsx";

export type AnswerOptionWrapperProps<T extends AnswerType> = {
  item: IQuestionNode<T>;
  rowProps: RowRenderProps<DataTypeToType<AnswerTypeToDataType<T>>>;
  renderInput: (
    rowProps: RowRenderProps<DataTypeToType<AnswerTypeToDataType<T>>>,
  ) => ReactElement;
};

export function AnswerOptionWrapper<T extends AnswerType>({
  item,
  rowProps,
  renderInput,
}: AnswerOptionWrapperProps<T>) {
  const { options, getKeyForValue, getValueForKey, getLegacyOptionForValue } =
    useAnswerOptions(item);

  const { value, setValue, inputId, labelId, describedById, answer } = rowProps;

  // If no answer options, render the original input
  if (options.length === 0) {
    return renderInput(rowProps);
  }

  // If answerConstraint is optionsOrType, render input with datalist
  if (item.answerConstraint === "optionsOrType") {
    const datalistId = `${inputId}-datalist`;

    return (
      <>
        {renderInput({ ...rowProps, list: datalistId })}
        {/* TODO:  datalist not working with date like inputs */}
        <datalist id={datalistId}>
          {options.map((entry) => (
            <option key={entry.key} value={entry.label} />
          ))}
        </datalist>
      </>
    );
  }

  // Default: render select for optionsOnly
  const regularKey = getKeyForValue(value);
  const legacyOption =
    regularKey || value == null
      ? null
      : getLegacyOptionForValue(answer.key, value);
  const selectValue = regularKey || legacyOption?.key || "";

  return (
    <select
      id={inputId}
      className="af-input"
      value={selectValue}
      onChange={(event) => {
        const key = event.target.value;
        const nextValue = key ? getValueForKey(key) : null;
        setValue(nextValue);
      }}
      disabled={item.readOnly}
      aria-labelledby={labelId}
      aria-describedby={describedById}
    >
      <option value="">Select an option</option>
      {legacyOption ? (
        <option key={legacyOption.key} value={legacyOption.key} disabled>
          {legacyOption.label}
        </option>
      ) : null}
      {options.map((entry) => (
        <option key={entry.key} value={entry.key}>
          {entry.label}
        </option>
      ))}
    </select>
  );
}
