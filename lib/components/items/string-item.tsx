import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem } from "fhir/r5";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface StringItemProps {
  item: QuestionnaireItem;
}

export function StringItem({ item }: StringItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const currentValue = typeof value === "string" ? value : "";
  const inputType = item.type === "url" ? "url" : "text";
  const inputId = `q-${item.linkId}`;

  return (
    <div className="q-item q-item-string">
      {renderItemLabel(item, inputId)}
      <input
        id={inputId}
        type={inputType}
        required={item.required}
        readOnly={item.readOnly}
        value={currentValue}
        onChange={(event) => {
          const next = event.target.value;
          writeValue(item, next === "" ? undefined : next);
        }}
      />
      {renderItemChildren(item)}
    </div>
  );
}
