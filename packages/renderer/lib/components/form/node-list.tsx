import { observer } from "mobx-react-lite";
import { Node } from "./node.tsx";
import { IPresentableNode } from "../../types.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeList = observer(function NodeList({
  nodes,
}: {
  nodes: IPresentableNode[];
}) {
  const { NodeList: ThemedNodeList } = useTheme();
  const visibleNodes = nodes.filter((node) => !node.hidden);

  return visibleNodes.length > 0 ? (
    <ThemedNodeList>
      {visibleNodes.map((node) => (
        <Node key={node.token} node={node} />
      ))}
    </ThemedNodeList>
  ) : null;
});
