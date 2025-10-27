import "./non-repeating-group-node.css";
import { observer } from "mobx-react-lite";
import { INonRepeatingGroupStore } from "../../stores/types.ts";
import { ItemText } from "../common/item-text.tsx";
import { ItemsList } from "../common/item-list.tsx";

export const NonRepeatingGroupNode = observer(function NonRepeatingGroupNode({
  item,
}: {
  item: INonRepeatingGroupStore;
}) {
  return (
    <fieldset className="af-group" data-linkid={item.linkId}>
      {item.template.text && <ItemText as="legend" item={item} />}
      <div className="af-group-children">
        <ItemsList items={item.children} />
      </div>
    </fieldset>
  );
});
