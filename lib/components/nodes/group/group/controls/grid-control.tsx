import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../../types.ts";
import { NodesList } from "../../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupGridTable } from "../components/grid-table.tsx";
import { isGroupNode } from "../../../../../stores/nodes/groups/group-store.ts";

export const GridControl = observer(function GridControl({
  node,
}: GroupControlProps) {
  const rowGroups = node.nodes.filter(isGroupNode);
  const nonRowChildren = node.nodes.filter((child) => !isGroupNode(child));

  return (
    <GroupScaffold
      node={node}
      className="af-group af-group--grid"
      dataControl="grid"
    >
      {rowGroups.length > 0 ? (
        <GroupGridTable rows={rowGroups} />
      ) : (
        <div className="af-grid-table__empty">
          No row groups configured for this grid.
        </div>
      )}
      {nonRowChildren.length > 0 ? (
        <div className="af-group-table__extras">
          <NodesList nodes={nonRowChildren} />
        </div>
      ) : null}
    </GroupScaffold>
  );
});
