import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem } from "fhir/r5";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface TextItemProps {
  item: QuestionnaireItem;
}

export function TextItem({ item }: TextItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const currentValue = typeof value === "string" ? value : "";
  const inputId = `q-${item.linkId}`;

  return (
    <div className="q-item q-item-text">
      {renderItemLabel(item, inputId)}
      <textarea
        id={inputId}
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
