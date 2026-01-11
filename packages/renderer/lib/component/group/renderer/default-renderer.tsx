import { observer } from "mobx-react-lite";
import type { GroupRendererProperties } from "../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupList } from "../group-list.tsx";
import { strings } from "../../../strings.ts";
import { isGroupListStore } from "../../../store/group/group-list-store.ts";
import { DefaultRenderer as DefaultControl } from "../control/default-renderer.tsx";

export const DefaultRenderer = observer(function DefaultRenderer({
  node,
}: GroupRendererProperties) {
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
