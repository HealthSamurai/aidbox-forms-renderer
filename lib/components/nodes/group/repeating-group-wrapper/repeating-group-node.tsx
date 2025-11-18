import "./repeating-group-node.css";
import { observer } from "mobx-react-lite";
import { IGroupNode, IRepeatingGroupWrapper } from "../../../../types.ts";
import { Button } from "../../../controls/button.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";

export type RepeatingGroupNodeProps = {
  node: IGroupNode;
  wrapper: IRepeatingGroupWrapper;
};

export const RepeatingGroupNode = observer(function RepeatingGroupNode({
  node,
  wrapper,
}: RepeatingGroupNodeProps) {
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
});
