import { observer } from "mobx-react-lite";
import { IPresentableNode } from "../../types.ts";
import { getNodeLegalId } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeLegal = observer(function NodeLegal({
  node,
}: {
  node: IPresentableNode;
}) {
  const { NodeLegal: ThemedNodeLegal } = useTheme();

  if (!node.legal) {
    return null;
  }

  const legalId = getNodeLegalId(node);

  return (
    <ThemedNodeLegal
      id={legalId}
      content={node.legal}
      ariaLabel="Legal information"
    />
  );
});
