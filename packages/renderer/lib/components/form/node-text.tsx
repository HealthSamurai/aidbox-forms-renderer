import type { IPresentableNode } from "../../types.ts";
import { isQuestionNode } from "../../stores/nodes/questions/question-store.ts";
import { buildId } from "../../utilities.ts";

export function getNodeText(node: IPresentableNode): string {
  return [node.prefix ? `${node.prefix} ` : "", node.text ?? ""]
    .join("")
    .trim();
}

export function getPrimaryControlId(
  node: IPresentableNode,
): string | undefined {
  if (isQuestionNode(node)) {
    const token = node.answers[0]?.token;
    if (token) return buildId(token, "control");
  }
  return undefined;
}
