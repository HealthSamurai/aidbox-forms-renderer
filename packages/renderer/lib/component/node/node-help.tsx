import { observer } from "mobx-react-lite";
import { IPresentableNode } from "../../types.ts";
import { getNodeHelpId } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";
import { strings } from "../../strings.ts";

export const NodeHelp = observer(function NodeHelp({
  node,
}: {
  node: IPresentableNode;
}) {
  const { Help: ThemedHelp } = useTheme();
  const id = getNodeHelpId(node);

  return id ? (
    <ThemedHelp id={id} ariaLabel={strings.aria.help}>
      {node.help}
    </ThemedHelp>
  ) : undefined;
});
