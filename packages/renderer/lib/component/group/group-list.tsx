import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { IGroupList } from "../../types.ts";
import { NodeHeader } from "../node/node-header.tsx";
import { GroupScaffold } from "./group-scaffold.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { strings } from "../../strings.ts";

export const GroupList = observer(function GroupList({
  list,
  children,
}: {
  list: IGroupList;
  children?: ReactNode;
}) {
  const { GroupList: ThemedGroupList } = useTheme();
  const header = list.template.text ? (
    <NodeHeader node={list} as="legend" />
  ) : undefined;
  return (
    <ThemedGroupList
      linkId={list.linkId}
      header={header}
      onAdd={() => list.addNode()}
      canAdd={list.canAdd}
      addLabel={strings.group.addSection}
    >
      {children ??
        list.visibleNodes.map((node) => {
          const Renderer = node.renderer;
          if (!Renderer) {
            return;
          }

          return (
            <GroupScaffold
              key={node.token}
              node={node}
              onRemove={
                list.canRemove ? () => list.removeNode(node) : undefined
              }
              canRemove={list.canRemove}
              removeLabel={strings.group.removeSection}
            >
              <Renderer node={node} />
            </GroupScaffold>
          );
        })}
    </ThemedGroupList>
  );
});
