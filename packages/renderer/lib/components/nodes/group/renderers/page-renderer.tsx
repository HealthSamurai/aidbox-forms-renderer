import { observer } from "mobx-react-lite";
import type { GroupRendererProps } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupList } from "../group-list.tsx";
import { strings } from "../../../../strings.ts";
import { isGroupListStore } from "../../../../stores/nodes/groups/group-list-store.ts";
import { PageRenderer as PageControl } from "../controls/page-renderer.tsx";

export const PageRenderer = observer(function PageRenderer({
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
          <PageControl node={child} />
        </GroupScaffold>
      ))}
    </GroupList>
  ) : (
    <GroupScaffold node={node}>
      <PageControl node={node} />
    </GroupScaffold>
  );
});
