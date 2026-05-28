import { IPresentableNode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { NodeHelp } from "./node-help.tsx";
import { NodeFlyover } from "./node-flyover.tsx";
import { NodeLegal } from "./node-legal.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { buildId, getNodeLabelId } from "../../utilities.ts";
import type { LabelAs } from "@formbox/theme";
import { isQuestionNode } from "../../store/question/question-store.ts";

function isSelectLikeBooleanControl(control: string | undefined): boolean {
  return (
    control === "radio-button" ||
    control === "check-box" ||
    control === "drop-down" ||
    control === "autocomplete" ||
    control === "lookup"
  );
}

function isMultiSelectQuestion(node: IPresentableNode): boolean {
  if (!isQuestionNode(node)) {
    return false;
  }

  return (
    node.isRepeatingWithoutChildren &&
    (node.hasOptions ||
      (node.type === "boolean" && isSelectLikeBooleanControl(node.control)))
  );
}

function getPrimaryControlId(node: IPresentableNode): string | undefined {
  if (isMultiSelectQuestion(node)) {
    return buildId(node.token, "multi-select");
  }

  if (isQuestionNode(node)) {
    const token = node.answers[0]?.token;
    if (token) return buildId(token, "control");
  }

  return;
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
      shortText={node.shortText}
      supportHyperlinks={node.supportHyperlinks}
      media={node.itemMedia}
      isExpanded={node.isExpanded}
      onToggleExpanded={node.isExpandable ? node.toggleExpanded : undefined}
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
