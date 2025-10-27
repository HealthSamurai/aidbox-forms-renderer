import "./display-node.css";
import { observer } from "mobx-react-lite";
import { ItemText } from "../common/item-text.tsx";
import { INodeStore } from "../../stores/types.ts";

export const DisplayNode = observer(function DisplayNode({
  item,
}: {
  item: INodeStore;
}) {
  return (
    <div className="af-item-display-wrapper" data-linkid={item.linkId}>
      <ItemText item={item} as="span" className="af-item-display" />
    </div>
  );
});
