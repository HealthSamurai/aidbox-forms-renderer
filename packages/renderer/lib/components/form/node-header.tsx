import { getNodeText, getPrimaryControlId } from "./node-text.tsx";
import { IPresentableNode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { NodeHelp } from "./node-help.tsx";
import { NodeFlyover } from "./node-flyover.tsx";
import { NodeLegal } from "./node-legal.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { getNodeLabelId } from "../../utils.ts";
import type { NodeHeaderAs } from "@aidbox-forms/theme";

export const NodeHeader = observer(function NodeHeader({
  node,
  as = "label",
}: {
  node: IPresentableNode;
  as?: NodeHeaderAs | undefined;
}) {
  const { NodeHeader: ThemedNodeHeader } = useTheme();
  const labelText = getNodeText(node);
  const htmlFor = as === "label" ? getPrimaryControlId(node) : undefined;

  return (
    <ThemedNodeHeader
      label={labelText}
      ariaLabelledBy={getNodeLabelId(node)}
      htmlFor={htmlFor}
      required={node.required}
      help={<NodeHelp node={node} />}
      legal={<NodeLegal node={node} />}
      flyover={<NodeFlyover node={node} />}
      as={as}
    />
  );
});
