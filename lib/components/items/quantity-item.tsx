import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem, Quantity } from "fhir/r5";
import { coerceQuantity } from "../../utils/answer-coercions";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface QuantityItemProps {
  item: QuestionnaireItem;
}

export function QuantityItem({ item }: QuantityItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const quantity = coerceQuantity(value) ?? {};
  const inputId = `q-${item.linkId}`;

  const update = (partial: Partial<Quantity>) => {
    const next: Quantity = { ...quantity, ...partial };
    if (next.value === undefined && !next.unit && !next.code && !next.system) {
      writeValue(item, undefined);
    } else {
      writeValue(item, next);
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (next === "") {
      update({ value: undefined });
      return;
    }

    const parsed = Number.parseFloat(next);
    update({ value: Number.isNaN(parsed) ? undefined : parsed });
  };

  return (
    <div className="q-item q-item-quantity">
      {renderItemLabel(item, inputId)}
      <input
        id={`${inputId}-value`}
        type="number"
        step="any"
        placeholder="Value"
        value={
          typeof quantity.value === "number" && Number.isFinite(quantity.value)
            ? quantity.value
            : ""
        }
        onChange={handleValueChange}
        disabled={item.readOnly}
      />
      <input
        id={`${inputId}-unit`}
        type="text"
        placeholder="Unit"
        value={quantity.unit ?? ""}
        onChange={(event) => update({ unit: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      <input
        id={`${inputId}-system`}
        type="text"
        placeholder="System"
        value={quantity.system ?? ""}
        onChange={(event) => update({ system: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      <input
        id={`${inputId}-code`}
        type="text"
        placeholder="Code"
        value={quantity.code ?? ""}
        onChange={(event) => update({ code: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      {renderItemChildren(item)}
    </div>
  );
}
