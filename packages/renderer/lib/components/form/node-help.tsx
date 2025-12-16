import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeHelpId } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeHelp = observer(function NodeHelp({ node }: { node: INode }) {
  const { NodeHelp: ThemedNodeHelp } = useTheme();

  if (!node.help) {
    return null;
  }

  const helpId = getNodeHelpId(node);

  return (
    <ThemedNodeHelp
      id={helpId}
      content={node.help}
      ariaLabel="More information"
    />
  );
});
