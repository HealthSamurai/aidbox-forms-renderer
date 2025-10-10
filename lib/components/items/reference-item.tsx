import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem, Reference } from "fhir/r5";
import { coerceReference } from "../../utils/answer-coercions";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface ReferenceItemProps {
  item: QuestionnaireItem;
}

export function ReferenceItem({ item }: ReferenceItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const reference = coerceReference(value) ?? {};
  const inputId = `q-${item.linkId}`;

  const update = (partial: Partial<Reference>) => {
    const next: Reference = { ...reference, ...partial };
    if (!next.reference && !next.display) {
      writeValue(item, undefined);
    } else {
      writeValue(item, next);
    }
  };

  return (
    <div className="q-item q-item-reference">
      {renderItemLabel(item, inputId)}
      <input
        id={`${inputId}-reference`}
        type="text"
        placeholder="Resource reference"
        value={reference.reference ?? ""}
        onChange={(event) => update({ reference: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      <input
        id={`${inputId}-display`}
        type="text"
        placeholder="Display"
        value={reference.display ?? ""}
        onChange={(event) => update({ display: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      {renderItemChildren(item)}
    </div>
  );
}
