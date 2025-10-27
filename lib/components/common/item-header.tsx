import "./item-header.css";
import { ItemText } from "./item-text.tsx";
import { INodeStore } from "../../stores/types.ts";
import { observer } from "mobx-react-lite";
import { getItemHelpId, getItemLabelId } from "../../utils.ts";

interface ItemHeaderProps {
  item: INodeStore;
  htmlFor?: string;
  className?: string;
}

export const ItemHeader = observer(function ItemHeader({
  item,
  htmlFor,
  className,
}: ItemHeaderProps) {
  return (
    <div className={className ?? "af-item-header"}>
      <ItemText
        item={item}
        as="label"
        id={getItemLabelId(item)}
        htmlFor={htmlFor}
      />
      {item.required && (
        <span aria-hidden className="af-required">
          *
        </span>
      )}
      {item.help && (
        <div id={getItemHelpId(item)} className="af-help">
          {item.help}
        </div>
      )}
    </div>
  );
});
