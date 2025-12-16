import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { IGroupWrapper } from "../../../types.ts";
import { getNodeLabelParts } from "../../form/node-text.tsx";
import { GroupWrapperScaffoldItem } from "./group-wrapper-scaffold-item.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export const GroupWrapperScaffold = observer(function GroupWrapperScaffold({
  wrapper,
  children,
}: {
  wrapper: IGroupWrapper;
  children?: ReactNode;
}) {
  const { Button, GroupWrapper } = useTheme();
  const { labelText } = getNodeLabelParts(wrapper);
  return (
    <GroupWrapper
      linkId={wrapper.linkId}
      legend={wrapper.template.text ? labelText : null}
      items={
        children ??
        wrapper.visibleNodes.map((node) => (
          <GroupWrapperScaffoldItem
            key={node.key}
            node={node}
            wrapper={wrapper}
          />
        ))
      }
      toolbar={
        <Button
          type="button"
          variant="success"
          onClick={() => wrapper.addNode()}
          disabled={!wrapper.canAdd}
        >
          Add section
        </Button>
      }
    />
  );
});
