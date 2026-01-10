import { observer } from "mobx-react-lite";
import type { GroupRendererProperties } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { GroupList } from "../group-list.tsx";
import { strings } from "../../../../strings.ts";
import { isGroupListStore } from "../../../../stores/nodes/groups/group-list-store.ts";
import { FooterRenderer as FooterControl } from "../controls/footer-renderer.tsx";

export const FooterRenderer = observer(function FooterRenderer({
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
          <FooterControl node={child} />
        </GroupScaffold>
      ))}
    </GroupList>
  ) : (
    <GroupScaffold node={node}>
      <FooterControl node={node} />
    </GroupScaffold>
  );
});
