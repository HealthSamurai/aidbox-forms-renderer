import "./repeating-group-node.css";
import React from "react";
import { Observer, observer } from "mobx-react-lite";
import { IRepeatingGroupStore } from "../../stores/types.ts";
import { ItemText } from "../common/item-text.tsx";
import { ItemErrors } from "../common/item-errors.tsx";
import { Button } from "../controls/button.tsx";
import { RepeatingGroupInstance } from "./repeating-group-instance.tsx";

export const RepeatingGroupNode = observer(function RepeatingGroupNode({
  item,
}: {
  item: IRepeatingGroupStore;
}) {
  const handleAddClick = React.useCallback(() => {
    if (!item.canAdd) {
      return;
    }
    item.addInstance();
  }, [item]);

  return (
    <fieldset className="af-group" data-linkid={item.linkId}>
      {item.template.text && <ItemText as="legend" item={item} />}

      <div className="af-group-instance-list">
        <Observer>
          {() => (
            <>
              {item.instances.map((instance) => (
                <RepeatingGroupInstance
                  key={instance.key}
                  instance={instance}
                  canRemove={item.canRemove}
                />
              ))}
            </>
          )}
        </Observer>
      </div>
      <ItemErrors item={item} />

      <div className="af-group-instance-list-toolbar">
        <Button
          type="button"
          variant="success"
          onClick={handleAddClick}
          disabled={!item.canAdd}
        >
          Add section
        </Button>
      </div>
    </fieldset>
  );
});
