import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const DefaultControl = observer(function DefaultControl({
  node,
}: GroupControlProps) {
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  return (
    <GroupScaffold node={node}>
      <NodesList nodes={visibleNodes} />
    </GroupScaffold>
  );
});
