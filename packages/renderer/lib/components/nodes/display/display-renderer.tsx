import { observer } from "mobx-react-lite";
import { getNodeLabelParts } from "../../form/node-text.tsx";
import { IDisplayNode } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";

export const DisplayRenderer = observer(function DisplayRenderer({
  node,
}: {
  node: IDisplayNode;
}) {
  const { DisplayRenderer: ThemedDisplayRenderer } = useTheme();
  const { labelText } = getNodeLabelParts(node);
  return (
    <ThemedDisplayRenderer linkId={node.linkId}>
      {labelText}
    </ThemedDisplayRenderer>
  );
});
