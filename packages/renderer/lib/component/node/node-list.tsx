import { observer } from "mobx-react-lite";
import { Node } from "./node.tsx";
import { IPresentableNode } from "../../types.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeList = observer(function NodeList({
  nodes,
}: {
  nodes: IPresentableNode[];
}) {
  const { Stack: ThemedStack } = useTheme();
  const visibleNodes = nodes.filter((node) => !node.hidden);

  return visibleNodes.length > 0 ? (
    <ThemedStack>
      {visibleNodes.map((node) => (
        <Node key={node.token} node={node} />
      ))}
    </ThemedStack>
  ) : undefined;
});
