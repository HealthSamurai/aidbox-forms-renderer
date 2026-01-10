import { observer } from "mobx-react-lite";
import type { GroupRendererProps } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupList } from "../group-list.tsx";
import { strings } from "../../../../strings.ts";
import { isGroupListStore } from "../../../../stores/nodes/groups/group-list-store.ts";
import { DefaultRenderer as DefaultControl } from "../controls/default-renderer.tsx";

export const DefaultRenderer = observer(function DefaultRenderer({
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
          <DefaultControl node={child} />
        </GroupScaffold>
      ))}
    </GroupList>
  ) : (
    <GroupScaffold node={node}>
      <DefaultControl node={node} />
    </GroupScaffold>
  );
});
