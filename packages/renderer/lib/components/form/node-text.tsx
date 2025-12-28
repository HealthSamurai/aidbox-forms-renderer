import type { IPresentableNode, IQuestionNode } from "../../types.ts";
import { getNodeLabelId } from "../../utils.ts";
import { isQuestionNode } from "../../stores/nodes/questions/question-store.ts";

export function getNodeLabelParts(node: IPresentableNode) {
  const ariaLabelledBy = getNodeLabelId(node);
  const htmlFor = getPrimaryControlId(node);
  const labelText = [
    node.prefix ? `${node.prefix} ` : "",
    node.text ?? node.linkId ?? "",
  ]
    .join("")
    .trim();

  return { ariaLabelledBy, htmlFor, labelText };
}

function getPrimaryControlId(node: IPresentableNode): string | undefined {
  if (!isQuestionNode(node)) {
    return undefined;
  }

  const firstAnswer = (node as IQuestionNode).answers[0];
  if (!firstAnswer) {
    return undefined;
  }

  return firstAnswer.token;
}
