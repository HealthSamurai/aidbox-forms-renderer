import type { QuestionnaireItem } from "fhir/r5";
import { renderItemChildren } from "./item-children";

interface DisplayItemProps {
  item: QuestionnaireItem;
}

export function DisplayItem({ item }: DisplayItemProps) {
  return (
    <div className="q-item q-item-display-wrapper">
      <p className="q-item-display">{item.text}</p>
      {renderItemChildren(item)}
    </div>
  );
}
