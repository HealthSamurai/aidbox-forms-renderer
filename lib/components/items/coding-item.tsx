import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem } from "fhir/r5";
import {
  getCodingLabel,
  getCodingValue,
  isSameCodingValue,
} from "../../utils/coding-options";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface CodingItemProps {
  item: QuestionnaireItem;
}

export function CodingItem({ item }: CodingItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const inputId = `q-${item.linkId}`;
  const options = item.answerOption ?? [];

  if (options.length === 0) {
    return (
      <div className="q-item q-item-coding">
        {renderItemLabel(item, inputId)}
        <p className="q-item-unsupported">No answer options provided.</p>
        {renderItemChildren(item)}
      </div>
    );
  }

  const internalOptions = options.map((option, index) => {
    const optionValue = getCodingValue(option);
    return {
      key: String(index),
      value: optionValue,
      label: getCodingLabel(option),
    };
  });

  const selected = internalOptions.find((option) => isSameCodingValue(option.value, value));

  return (
    <div className="q-item q-item-coding">
      {renderItemLabel(item, inputId)}
      <select
        id={inputId}
        required={item.required}
        disabled={item.readOnly}
        value={selected?.key ?? ""}
        onChange={(event) => {
          const next = internalOptions.find((option) => option.key === event.target.value);
          writeValue(item, next ? next.value : undefined);
        }}
      >
        <option value="" disabled>
          Select an option
        </option>
        {internalOptions.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      {renderItemChildren(item)}
    </div>
  );
}
