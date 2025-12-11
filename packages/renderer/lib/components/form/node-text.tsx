import { createElement } from "react";
import type { IPresentableNode, IQuestionNode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { getNodeLabelId, sanitizeForId } from "../../utils.ts";
import { isQuestionNode } from "../../stores/nodes/questions/question-store.ts";

export const NodeText = observer(function NodeText({
  node,
  as = "span",
  id,
  className,
}: {
  node: IPresentableNode;
  as?: "label" | "span" | "legend";
  id?: string;
  className?: string;
}) {
  const labelId = id ?? getNodeLabelId(node);
  const htmlFor = as === "label" ? getPrimaryControlId(node) : undefined;

  return createElement(
    as,
    {
      id: labelId,
      className,
      htmlFor,
    },
    node.prefix ? <span className="af-prefix">{node.prefix} </span> : null,
    <span className="af-text">{node.text ?? node.linkId ?? ""}</span>,
  );
});

function getPrimaryControlId(node: IPresentableNode): string | undefined {
  if (!isQuestionNode(node)) {
    return undefined;
  }

  const firstAnswer = (node as IQuestionNode).answers[0];
  if (!firstAnswer) {
    return undefined;
  }

  return sanitizeForId(firstAnswer.key);
}
