import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodeList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const PageRenderer = observer(function PageRenderer({
  node,
}: GroupControlProps) {
  return (
    <GroupScaffold node={node} dataControl="page">
      <NodeList nodes={node.visibleNodes} />
    </GroupScaffold>
  );
});
