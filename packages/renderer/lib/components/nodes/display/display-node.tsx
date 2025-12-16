import { observer } from "mobx-react-lite";
import { getNodeLabelParts } from "../../form/node-text.tsx";
import { IDisplayNode } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";

export const DisplayNode = observer(function DisplayNode({
  node,
}: {
  node: IDisplayNode;
}) {
  const { DisplayNode: ThemedDisplayNode } = useTheme();
  const { labelText } = getNodeLabelParts(node);
  return <ThemedDisplayNode linkId={node.linkId} content={labelText} />;
});
