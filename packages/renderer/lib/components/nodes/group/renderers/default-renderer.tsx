import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const DefaultRenderer = observer(function DefaultRenderer({
  node,
}: GroupControlProps) {
  return (
    <GroupScaffold node={node}>
      <NodesList nodes={node.visibleNodes} />
    </GroupScaffold>
  );
});
