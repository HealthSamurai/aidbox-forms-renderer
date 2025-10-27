import { createElement } from "react";
import { INodeStore } from "../../stores/types.ts";
import { observer } from "mobx-react-lite";

interface ItemTextProps {
  item: INodeStore;
  as?: "label" | "span" | "legend";
  id?: string;
  className?: string;
  htmlFor?: string | undefined;
}

export const ItemText = observer(function ItemText({
  item,
  as = "span",
  id,
  className,
  htmlFor,
}: ItemTextProps) {
  return createElement(
    as,
    { id, className, htmlFor: as === "label" ? htmlFor : undefined },
    item.prefix ? <span className="af-prefix">{item.prefix} </span> : null,
    <span className="af-text">{item.text ?? item.linkId ?? ""}</span>,
  );
});
