import { IPresentableNode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { NodeHelp } from "./node-help.tsx";
import { NodeFlyover } from "./node-flyover.tsx";
import { NodeLegal } from "./node-legal.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { buildId, getNodeLabelId } from "../../utilities.ts";
import type { LabelAs } from "@aidbox-forms/theme";
import { isQuestionNode } from "../../store/question/question-store.ts";

function getPrimaryControlId(node: IPresentableNode): string | undefined {
  if (isQuestionNode(node)) {
    const token = node.answers[0]?.token;
    if (token) return buildId(token, "control");
  }
  return undefined;
}

export const NodeHeader = observer(function NodeHeader({
  node,
  as = "label",
}: {
  node: IPresentableNode;
  as?: LabelAs | undefined;
}) {
  const { Label: ThemedLabel } = useTheme();
  const htmlFor = as === "label" ? getPrimaryControlId(node) : undefined;

  return (
    <ThemedLabel
      prefix={node.prefix}
      id={getNodeLabelId(node)}
      htmlFor={htmlFor}
      required={node.required}
      help={<NodeHelp node={node} />}
      legal={<NodeLegal node={node} />}
      flyover={<NodeFlyover node={node} />}
      as={as}
    >
      {node.text}
    </ThemedLabel>
  );
});
