import { observer } from "mobx-react-lite";
import { IDisplayNode } from "../../types.ts";
import { useTheme } from "../../ui/theme.tsx";
import { NodeHeader } from "../node/node-header.tsx";

export const DisplayRenderer = observer(function DisplayRenderer({
  node,
}: {
  node: IDisplayNode;
}) {
  const { DisplayRenderer: ThemedDisplayRenderer } = useTheme();

  return (
    <ThemedDisplayRenderer linkId={node.linkId}>
      <NodeHeader node={node} as="text" />
    </ThemedDisplayRenderer>
  );
});
