import "./item-help.css";
import { observer } from "mobx-react-lite";
import { INode } from "../../stores/types.ts";
import { getItemHelpId } from "../../utils.ts";

export const ItemHelp = observer(function ItemHelp({ item }: { item: INode }) {
  const text = item.help;
  if (!text) {
    return null;
  }

  const helpId = getItemHelpId(item);

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
        {text}
      </div>
      <span id={helpId} className="af-help-sr">
        {text}
      </span>
    </>
  );
});
