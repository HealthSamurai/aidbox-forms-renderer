import "./repeating-group-wrapper.css";
import React from "react";
import { Observer, observer } from "mobx-react-lite";
import {
  IRepeatingGroupNode,
  IRepeatingGroupWrapper,
} from "../../stores/types.ts";
import { ItemText } from "../common/item-text.tsx";
import { Button } from "../controls/button.tsx";
import { RepeatingGroupNode } from "./repeating-group-node.tsx";

export const RepeatingGroupWrapper = observer(function RepeatingGroupWrapper({
  item,
}: {
  item: IRepeatingGroupWrapper;
}) {
  const handleAddClick = React.useCallback(() => {
    if (!item.canAdd) return;
    item.addInstance();
  }, [item]);

  return (
    <fieldset className="af-group" data-linkid={item.linkId}>
      {item.template.text && <ItemText as="legend" item={item} />}

      <div className="af-group-instance-list">
        <Observer>
          {() => (
            <>
              {item.nodes.map((instance: IRepeatingGroupNode) => (
                <RepeatingGroupNode
                  key={instance.key}
                  instance={instance}
                  canRemove={item.canRemove}
                />
              ))}
            </>
          )}
        </Observer>
      </div>

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
