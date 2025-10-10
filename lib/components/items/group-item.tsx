import type { QuestionnaireItem } from "fhir/r5";
import { renderItemChildren } from "./item-children";

interface GroupItemProps {
  item: QuestionnaireItem;
}

export function GroupItem({ item }: GroupItemProps) {
  return (
    <fieldset className="q-item q-item-group">
      <legend>
        {item.prefix ? <span className="q-item-prefix">{item.prefix} </span> : null}
        <span>{item.text ?? item.linkId}</span>
      </legend>
      {renderItemChildren(item)}
    </fieldset>
  );
}
