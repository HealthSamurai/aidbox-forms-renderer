import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupGridTable } from "../components/grid-table.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { isGroupNode } from "../../../../stores/nodes/groups/group-store.ts";

export const GridControl = observer(function GridControl({
  node,
}: GroupControlProps) {
  const { GroupActions, EmptyState } = useTheme();
  const rowGroups = node.nodes.filter(isGroupNode);
  const nonRowChildren = node.nodes.filter((child) => !isGroupNode(child));

  const gridContent =
    rowGroups.length > 0 ? (
      <GroupGridTable rows={rowGroups} />
    ) : (
      <EmptyState>No row groups configured for this grid.</EmptyState>
    );

  return (
    <GroupScaffold node={node} dataControl="grid">
      {gridContent}
      {nonRowChildren.length > 0 ? (
        <GroupActions>
          <NodesList nodes={nonRowChildren} />
        </GroupActions>
      ) : null}
    </GroupScaffold>
  );
});
