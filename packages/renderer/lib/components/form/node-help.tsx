import { observer } from "mobx-react-lite";
import { IPresentableNode } from "../../types.ts";
import { getNodeHelpId } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";
import { strings } from "../../strings.ts";

export const NodeHelp = observer(function NodeHelp({
  node,
}: {
  node: IPresentableNode;
}) {
  const { NodeHelp: ThemedNodeHelp } = useTheme();

  if (!node.help) {
    return null;
  }

  const helpId = getNodeHelpId(node);

  return (
    <ThemedNodeHelp id={helpId} ariaLabel={strings.aria.help}>
      {node.help}
    </ThemedNodeHelp>
  );
});
