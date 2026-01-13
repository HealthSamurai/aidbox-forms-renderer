import { observer } from "mobx-react-lite";
import type { GroupRendererProperties } from "../../../types.ts";
import { GroupList } from "../group-list.tsx";
import { isGroupListStore } from "../../../store/group/group-list-store.ts";
import { GridTableControl } from "../control/grid-table-control.tsx";

export const GridTableRenderer = observer(function GridTableRenderer({
  node,
}: GroupRendererProperties) {
  return isGroupListStore(node) ? (
    <GroupList list={node}>
      <GridTableControl list={node} />
    </GroupList>
  ) : undefined;
});
