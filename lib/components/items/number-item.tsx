import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem } from "fhir/r5";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface NumberItemProps {
  item: QuestionnaireItem;
}

export function NumberItem({ item }: NumberItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const numericValue = typeof value === "number" && Number.isFinite(value) ? value : "";
  const step = item.type === "decimal" ? "any" : 1;
  const inputId = `q-${item.linkId}`;

  return (
    <div className="q-item q-item-number">
      {renderItemLabel(item, inputId)}
      <input
        id={inputId}
        type="number"
        required={item.required}
        readOnly={item.readOnly}
        value={numericValue}
        step={step}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "") {
            writeValue(item, undefined);
            return;
          }

          const parsed =
            item.type === "integer" ? Number.parseInt(next, 10) : Number.parseFloat(next);
          writeValue(item, Number.isNaN(parsed) ? undefined : parsed);
        }}
      />
      {renderItemChildren(item)}
    </div>
  );
}
