import "./repeating-group-node.css";
import { observer } from "mobx-react-lite";
import { IRepeatingGroupStore } from "../../stores/types.ts";
import { ItemText } from "../common/item-text.tsx";
import { ItemsList } from "../common/item-list.tsx";

export const RepeatingGroupNode = observer(function RepeatingGroupNode({
  item,
}: {
  item: IRepeatingGroupStore;
}) {
  return (
    <fieldset className="af-group" data-linkid={item.linkId}>
      {item.template.text && <ItemText as="legend" item={item} />}

      <div className="af-group-instance-list">
        {item.instances.map((instance, ix) => (
          <section
            key={instance.path}
            className="af-group-instance"
            data-instance={ix}
          >
            <div className="af-group-instance-children">
              <ItemsList items={instance.children} />
            </div>
            <div className="af-group-instance-toolbar">
              <button
                type="button"
                className="af-group-instance-remove"
                onClick={() => item.removeInstance(ix)}
                disabled={!item.canRemove}
              >
                Remove section
              </button>
            </div>
          </section>
        ))}
      </div>

      <div className="af-group-instance-list-toolbar">
        <button
          type="button"
          className="af-group-instance-list-add"
          onClick={() => item.addInstance()}
          disabled={!item.canAdd}
        >
          Add section
        </button>
      </div>
    </fieldset>
  );
});
