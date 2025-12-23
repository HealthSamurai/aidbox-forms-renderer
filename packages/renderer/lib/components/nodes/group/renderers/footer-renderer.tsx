import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const FooterRenderer = observer(function FooterRenderer({
  node,
}: GroupControlProps) {
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  return (
    <GroupScaffold node={node} dataControl="footer">
      <NodesList nodes={visibleNodes} />
    </GroupScaffold>
  );
});
