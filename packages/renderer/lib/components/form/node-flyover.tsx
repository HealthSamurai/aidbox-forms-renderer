import { observer } from "mobx-react-lite";
import { IPresentableNode } from "../../types.ts";
import { getNodeFlyoverId } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";
import { strings } from "../../strings.ts";

export const NodeFlyover = observer(function NodeFlyover({
  node,
}: {
  node: IPresentableNode;
}) {
  const flyoverId = getNodeFlyoverId(node);
  const { NodeFlyover: ThemedNodeFlyover } = useTheme();

  if (!node.flyover) {
    return null;
  }

  return (
    <ThemedNodeFlyover id={flyoverId} ariaLabel={strings.aria.flyover}>
      {node.flyover}
    </ThemedNodeFlyover>
  );
});
