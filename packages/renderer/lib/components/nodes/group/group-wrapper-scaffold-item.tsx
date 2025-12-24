import { observer } from "mobx-react-lite";
import { IGroupNode, IGroupWrapper } from "../../../types.ts";
import { NodeErrors } from "../../form/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export const GroupWrapperScaffoldItem = observer(
  function GroupWrapperScaffoldItem({
    wrapper,
    node,
  }: {
    wrapper: IGroupWrapper;
    node: IGroupNode;
  }) {
    const { Button, GroupWrapperScaffoldItem: ThemedGroupWrapperScaffoldItem } =
      useTheme();
    const Renderer = node.renderer;

    return Renderer ? (
      <ThemedGroupWrapperScaffoldItem
        errors={<NodeErrors node={node} />}
        toolbar={
          wrapper.canRemove ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => wrapper.removeNode(node)}
              disabled={!wrapper.canRemove}
            >
              Remove section
            </Button>
          ) : null
        }
      >
        <Renderer node={node} />
      </ThemedGroupWrapperScaffoldItem>
    ) : null;
  },
);
