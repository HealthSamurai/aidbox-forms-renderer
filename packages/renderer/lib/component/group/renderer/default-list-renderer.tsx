import { observer } from "mobx-react-lite";

import type { GroupListRendererProperties } from "../../../types.ts";
import { NodeHeader } from "../../node/node-header.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { Node } from "../../node/node.tsx";
import { renderErrors } from "../../node/errors.tsx";

export const DefaultListRenderer = observer(function DefaultListRenderer({
  node,
}: GroupListRendererProperties) {
  const { GroupList: ThemedGroupList } = useTheme();
  const header =
    node.text || node.shortText ? (
      <NodeHeader node={node} as="legend" />
    ) : undefined;
  return (
    <ThemedGroupList
      linkId={node.linkId}
      header={header}
      errors={renderErrors(node)}
      onAdd={() => node.addNode()}
      canAdd={node.canAdd}
      path={node.path}
      customExtensions={node.customExtensions}
    >
      {node.visibleNodes.map((child) => {
        return (
          <GroupScaffold
            key={child.token}
            node={child}
            onRemove={node.canRemove ? () => node.removeNode(child) : undefined}
            canRemove={node.canRemove}
          >
            <Node node={child} />
          </GroupScaffold>
        );
      })}
    </ThemedGroupList>
  );
});
