import { observer } from "mobx-react-lite";
import type { GroupRendererProps } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupList } from "../group-list.tsx";
import { strings } from "../../../../strings.ts";
import { isGroupListStore } from "../../../../stores/nodes/groups/group-list-store.ts";
import { SelectionTableRenderer as SelectionTableControl } from "../controls/selection-table-renderer.tsx";

export const SelectionTableRenderer = observer(function SelectionTableRenderer({
  node,
}: GroupRendererProps) {
  return isGroupListStore(node) ? (
    <GroupList list={node}>
      {node.visibleNodes.map((child) => (
        <GroupScaffold
          key={child.token}
          node={child}
          onRemove={node.canRemove ? () => node.removeNode(child) : undefined}
          canRemove={node.canRemove}
          removeLabel={strings.group.removeSection}
        >
          <SelectionTableControl node={child} />
        </GroupScaffold>
      ))}
    </GroupList>
  ) : (
    <GroupScaffold node={node}>
      <SelectionTableControl node={node} />
    </GroupScaffold>
  );
});
