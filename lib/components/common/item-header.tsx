import "./item-header.css";
import { ItemText } from "./item-text.tsx";
import { INode } from "../../stores/types.ts";
import { observer } from "mobx-react-lite";
import { getItemLabelId } from "../../utils.ts";
import { ItemHelp } from "./item-help.tsx";

interface ItemHeaderProps {
  item: INode;
  htmlFor?: string;
  className?: string;
}

export const ItemHeader = observer(function ItemHeader({
  item,
  htmlFor,
  className,
}: ItemHeaderProps) {
  const helpText = item.help;
  const labelId = getItemLabelId(item);

  return (
    <div className={className ?? "af-item-header"}>
      <div className="af-item-header-main">
        <ItemText item={item} as="label" id={labelId} htmlFor={htmlFor} />
        {item.required && (
          <span aria-hidden className="af-required">
            *
          </span>
        )}
        {helpText && <ItemHelp item={item} />}
      </div>
    </div>
  );
});
