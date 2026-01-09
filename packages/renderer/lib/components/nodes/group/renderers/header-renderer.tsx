import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodeList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const HeaderRenderer = observer(function HeaderRenderer({
  node,
}: GroupControlProps) {
  return (
    <GroupScaffold node={node} dataControl="header">
      <NodeList nodes={node.visibleNodes} />
    </GroupScaffold>
  );
});
