import "./non-repeating-group-node.css";
import { observer } from "mobx-react-lite";
import { INonRepeatingGroupNode } from "../../stores/types.ts";
import { ItemText } from "../common/item-text.tsx";
import { ItemsList } from "../common/item-list.tsx";
import { ItemErrors } from "../common/item-errors.tsx";

export const NonRepeatingGroupNode = observer(function NonRepeatingGroupNode({
  item,
}: {
  item: INonRepeatingGroupNode;
}) {
  return (
    <fieldset className="af-group" data-linkid={item.linkId}>
      {item.template.text && <ItemText as="legend" item={item} />}
      <div className="af-group-children">
        <ItemsList items={item.nodes} />
      </div>
      <ItemErrors item={item} />
    </fieldset>
  );
});
