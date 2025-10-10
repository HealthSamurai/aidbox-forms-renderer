import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem } from "fhir/r5";
import { renderItemChildren } from "./item-children";

interface BooleanItemProps {
  item: QuestionnaireItem;
}

export function BooleanItem({ item }: BooleanItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const checked = typeof value === "boolean" ? value : false;
  const inputId = `q-${item.linkId}`;

  return (
    <div className="q-item q-item-boolean">
      <label className="q-item-label q-item-label-inline">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          required={item.required}
          onChange={(event) => writeValue(item, event.target.checked)}
          disabled={item.readOnly}
        />
        <span>{item.text ?? item.linkId}</span>
        {item.required ? <span className="q-item-required">*</span> : null}
      </label>
      {renderItemChildren(item)}
    </div>
  );
}
