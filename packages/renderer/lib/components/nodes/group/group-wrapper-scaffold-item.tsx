import "./group-wrapper-scaffold-item.css";
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
    const { Button } = useTheme();
    const ControlComponent = node.component;

    return ControlComponent ? (
      <section className="af-group-node">
        <div className="af-group-node-children">
          <ControlComponent node={node} />
        </div>
        <NodeErrors node={node} />
        {wrapper.canRemove ? (
          <div className="af-group-node-toolbar">
            <Button
              type="button"
              variant="danger"
              onClick={() => wrapper.removeNode(node)}
              disabled={!wrapper.canRemove}
            >
              Remove section
            </Button>
          </div>
        ) : null}
      </section>
    ) : null;
  },
);
