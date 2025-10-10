import type { QuestionnaireItem } from "fhir/r5";
import type { ReactNode } from "react";

import { Item } from ".";

export function renderItemChildren(item: QuestionnaireItem): ReactNode {
  if (!item.item || item.item.length === 0) {
    return null;
  }

  return (
    <div className="q-item-children">
      {item.item.map((child) => (
        <Item key={child.linkId} item={child} />
      ))}
    </div>
  );
}
