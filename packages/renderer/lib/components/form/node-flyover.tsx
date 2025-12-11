import "./node-flyover.css";
import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeFlyoverId } from "../../utils.ts";

export const NodeFlyover = observer(function NodeFlyover({
  node,
}: {
  node: INode;
}) {
  const flyoverId = getNodeFlyoverId(node);

  if (!node.flyover) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="af-flyover"
        aria-describedby={flyoverId}
        aria-label="More context"
      >
        i
      </button>
      <div className="af-flyover-tooltip" role="tooltip" aria-hidden="true">
        {node.flyover}
      </div>
      <span id={flyoverId} className="af-flyover-sr">
        {node.flyover}
      </span>
    </>
  );
});
