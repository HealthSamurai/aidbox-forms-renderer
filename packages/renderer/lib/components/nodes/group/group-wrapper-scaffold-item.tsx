import { observer } from "mobx-react-lite";
import { IGroupNode, IGroupWrapper } from "../../../types.ts";
import { NodeErrors } from "../../form/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { strings } from "../../../strings.ts";

export const GroupWrapperScaffoldItem = observer(
  function GroupWrapperScaffoldItem({
    wrapper,
    node,
  }: {
    wrapper: IGroupWrapper;
    node: IGroupNode;
  }) {
    const { GroupWrapperScaffoldItem: ThemedGroupWrapperScaffoldItem } =
      useTheme();
    const Renderer = node.renderer;
    const onRemove = wrapper.canRemove
      ? () => wrapper.removeNode(node)
      : undefined;

    return Renderer ? (
      <ThemedGroupWrapperScaffoldItem
        errors={<NodeErrors node={node} />}
        onRemove={onRemove}
        canRemove={wrapper.canRemove}
        removeLabel={strings.group.removeSection}
      >
        <Renderer node={node} />
      </ThemedGroupWrapperScaffoldItem>
    ) : null;
  },
);
