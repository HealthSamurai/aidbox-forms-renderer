import "./page-control.css";
import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";

export const PageControl = observer(function PageControl({
  node,
}: GroupControlProps) {
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  return (
    <GroupScaffold
      node={node}
      className="af-group af-group--page"
      dataControl="page"
    >
      <NodesList nodes={visibleNodes} />
    </GroupScaffold>
  );
});
