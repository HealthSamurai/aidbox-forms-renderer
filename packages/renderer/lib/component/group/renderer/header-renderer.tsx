import { observer } from "mobx-react-lite";
import type { GroupRendererProperties } from "../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupList } from "../group-list.tsx";
import { strings } from "../../../strings.ts";
import { isGroupListStore } from "../../../store/group/group-list-store.ts";
import { HeaderRenderer as HeaderControl } from "../control/header-renderer.tsx";

export const HeaderRenderer = observer(function HeaderRenderer({
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
          <HeaderControl node={child} />
        </GroupScaffold>
      ))}
    </GroupList>
  ) : (
    <GroupScaffold node={node}>
      <HeaderControl node={node} />
    </GroupScaffold>
  );
});
