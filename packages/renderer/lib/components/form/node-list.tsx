import { observer } from "mobx-react-lite";
import { Node } from "./node.tsx";
import { IPresentableNode } from "../../types.ts";

export const NodesList = observer(function NodesList({
  nodes,
}: {
  nodes: IPresentableNode[];
}) {
  return (
    <>
      {nodes
        .filter((node) => !node.hidden)
        .map((node) => (
          <Node key={node.token} node={node} />
        ))}
    </>
  );
});
