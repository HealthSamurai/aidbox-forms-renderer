import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeFlyoverId } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeFlyover = observer(function NodeFlyover({
  node,
}: {
  node: INode;
}) {
  const flyoverId = getNodeFlyoverId(node);
  const { NodeFlyover: ThemedNodeFlyover } = useTheme();

  if (!node.flyover) {
    return null;
  }

  return (
    <ThemedNodeFlyover
      id={flyoverId}
      content={node.flyover}
      ariaLabel="More context"
    />
  );
});
