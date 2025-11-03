import { createElement } from "react";
import type { ICoreNode, IQuestionNode } from "../../stores/types.ts";
import { observer } from "mobx-react-lite";
import { getItemLabelId, sanitizeForId } from "../../utils.ts";
import { isQuestionNode } from "../../stores/question-store.ts";

interface ItemTextProps {
  item: ICoreNode;
  as?: "label" | "span" | "legend";
  id?: string;
  className?: string;
}

export const ItemText = observer(function ItemText({
  item,
  as = "span",
  id,
  className,
}: ItemTextProps) {
  const labelId = id ?? getItemLabelId(item);
  const htmlFor =
    as === "label" ? getPrimaryControlId(item) : undefined;

  return createElement(
    as,
    {
      id: labelId,
      className,
      htmlFor,
    },
    item.prefix ? <span className="af-prefix">{item.prefix} </span> : null,
    <span className="af-text">{item.text ?? item.linkId ?? ""}</span>,
  );
});

function getPrimaryControlId(item: ICoreNode): string | undefined {
  if (!isQuestionNode(item)) {
    return undefined;
  }

  const firstAnswer = (item as IQuestionNode).answers[0];
  if (!firstAnswer) {
    return undefined;
  }

  return sanitizeForId(firstAnswer.key);
}
