import { getNodeLabelParts } from "./node-text.tsx";
import { INode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { NodeHelp } from "./node-help.tsx";
import { NodeFlyover } from "./node-flyover.tsx";
import { NodeLegal } from "./node-legal.tsx";
import { useTheme } from "../../ui/theme.tsx";

export const NodeHeader = observer(function NodeHeader({
  node,
}: {
  node: INode;
}) {
  const { NodeHeader: ThemedNodeHeader } = useTheme();
  const { labelText, labelId, htmlFor } = getNodeLabelParts(node);

  return (
    <ThemedNodeHeader
      label={labelText}
      labelId={labelId}
      htmlFor={htmlFor}
      required={node.required}
      help={<NodeHelp node={node} />}
      legal={<NodeLegal node={node} />}
      flyover={<NodeFlyover node={node} />}
    />
  );
});
