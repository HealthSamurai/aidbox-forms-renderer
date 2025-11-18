import "./node-help.css";
import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeHelpId } from "../../utils.ts";

export const NodeHelp = observer(function NodeHelp({ node }: { node: INode }) {
  if (!node.help) {
    return null;
  }

  const helpId = getNodeHelpId(node);

  return (
    <>
      <button
        type="button"
        className="af-help"
        aria-describedby={helpId}
        aria-label="More information"
      >
        ?
      </button>
      <div className="af-help-tooltip" role="tooltip" aria-hidden="true">
        {node.help}
      </div>
      <span id={helpId} className="af-help-sr">
        {node.help}
      </span>
    </>
  );
});
