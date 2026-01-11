import { observer } from "mobx-react-lite";
import { IPresentableNode } from "../../types.ts";
import { getNodeFlyoverId } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";
import { strings } from "../../strings.ts";

export const NodeFlyover = observer(function NodeFlyover({
  node,
}: {
  node: IPresentableNode;
}) {
  const flyoverId = getNodeFlyoverId(node);
  const { Flyover: ThemedFlyover } = useTheme();

  if (!node.flyover) {
    return;
  }

  return (
    <ThemedFlyover id={flyoverId} ariaLabel={strings.aria.flyover}>
      {node.flyover}
    </ThemedFlyover>
  );
});
