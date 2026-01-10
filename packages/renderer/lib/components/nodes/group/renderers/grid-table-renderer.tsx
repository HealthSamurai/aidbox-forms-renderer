import { observer } from "mobx-react-lite";
import type { GroupRendererProps } from "../../../../types.ts";
import { GroupList } from "../group-list.tsx";
import { isGroupListStore } from "../../../../stores/nodes/groups/group-list-store.ts";
import { GridTableRenderer as GridTableControl } from "../controls/grid-table-renderer.tsx";

export const GridTableRenderer = observer(function GridTableRenderer({
  node,
}: GroupRendererProps) {
  return isGroupListStore(node) ? (
    <GroupList list={node}>
      <GridTableControl list={node} />
    </GroupList>
  ) : null;
});
