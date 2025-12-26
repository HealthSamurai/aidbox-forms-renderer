import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { IGroupWrapper } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { GroupWrapperScaffoldItem } from "./group-wrapper-scaffold-item.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export const GroupWrapperScaffold = observer(function GroupWrapperScaffold({
  wrapper,
  children,
}: {
  wrapper: IGroupWrapper;
  children?: ReactNode;
}) {
  const { GroupAddButton, GroupWrapperScaffold: ThemedGroupWrapperScaffold } =
    useTheme();
  const header = wrapper.template.text ? <NodeHeader node={wrapper} /> : null;
  return (
    <ThemedGroupWrapperScaffold
      linkId={wrapper.linkId}
      header={header}
      toolbar={
        <GroupAddButton
          onClick={() => wrapper.addNode()}
          disabled={!wrapper.canAdd}
        >
          Add section
        </GroupAddButton>
      }
    >
      {children ??
        wrapper.visibleNodes.map((node) => (
          <GroupWrapperScaffoldItem
            key={node.key}
            node={node}
            wrapper={wrapper}
          />
        ))}
    </ThemedGroupWrapperScaffold>
  );
});
