import { observer } from "mobx-react-lite";
import { IPresentableNode } from "../../types.ts";
import { getNodeLegalId } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";
import { strings } from "../../strings.ts";

export const NodeLegal = observer(function NodeLegal({
  node,
}: {
  node: IPresentableNode;
}) {
  const { Legal: ThemedLegal } = useTheme();

  if (!node.legal) {
    return;
  }

  const legalId = getNodeLegalId(node);

  return (
    <ThemedLegal id={legalId} ariaLabel={strings.aria.legal}>
      {node.legal}
    </ThemedLegal>
  );
});
