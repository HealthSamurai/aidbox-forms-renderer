import "./node-legal.css";
import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeLegalId } from "../../utils.ts";

export const NodeLegal = observer(function NodeLegal({
  node,
}: {
  node: INode;
}) {
  if (!node.legal) {
    return null;
  }

  const legalId = getNodeLegalId(node);

  return (
    <>
      <button
        type="button"
        className="af-legal"
        aria-describedby={legalId}
        aria-label="Legal information"
      >
        §
      </button>
      <div className="af-legal-tooltip" role="dialog" aria-hidden="true">
        {node.legal}
      </div>
      <span id={legalId} className="af-legal-sr">
        {node.legal}
      </span>
    </>
  );
});
