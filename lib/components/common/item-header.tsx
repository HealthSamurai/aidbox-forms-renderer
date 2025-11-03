import "./item-header.css";
import { ItemText } from "./item-text.tsx";
import { INode } from "../../stores/types.ts";
import { observer } from "mobx-react-lite";
import { ItemHelp } from "./item-help.tsx";

interface ItemHeaderProps {
  item: INode;
}

export const ItemHeader = observer(function ItemHeader({
  item,
}: ItemHeaderProps) {
  const helpText = item.help;
  return (
    <div className="af-item-header">
      <ItemText item={item} as="label" />
      {item.required && (
        <span aria-hidden className="af-required">
          *
        </span>
      )}
      {helpText && <ItemHelp item={item} />}
    </div>
  );
});
