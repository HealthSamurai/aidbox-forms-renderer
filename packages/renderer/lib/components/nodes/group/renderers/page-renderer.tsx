import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const PageRenderer = observer(function PageRenderer({
  node,
}: GroupControlProps) {
  return (
    <GroupScaffold node={node} dataControl="page">
      <NodesList nodes={node.visibleNodes} />
    </GroupScaffold>
  );
});
