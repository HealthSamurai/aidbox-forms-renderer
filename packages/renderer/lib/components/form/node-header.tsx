import { getNodeLabelParts } from "./node-text.tsx";
import { IPresentableNode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { NodeHelp } from "./node-help.tsx";
import { NodeFlyover } from "./node-flyover.tsx";
import { NodeLegal } from "./node-legal.tsx";
import { useTheme } from "../../ui/theme.tsx";

export const NodeHeader = observer(function NodeHeader({
  node,
}: {
  node: IPresentableNode;
}) {
  const { NodeHeader: ThemedNodeHeader } = useTheme();
  const { labelText, ariaLabelledBy, htmlFor } = getNodeLabelParts(node);

  return (
    <ThemedNodeHeader
      label={labelText}
      ariaLabelledBy={ariaLabelledBy}
      htmlFor={htmlFor}
      required={node.required}
      help={<NodeHelp node={node} />}
      legal={<NodeLegal node={node} />}
      flyover={<NodeFlyover node={node} />}
    />
  );
});
