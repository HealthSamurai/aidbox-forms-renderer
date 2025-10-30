import "./repeating-group-node.css";
import { observer } from "mobx-react-lite";
import type { IRepeatingGroupNode } from "../../stores/types.ts";
import { ItemsList } from "../common/item-list.tsx";
import { Button } from "../controls/button.tsx";

export type RepeatingGroupNodeProps = {
  instance: IRepeatingGroupNode;
  canRemove: boolean;
};

export const RepeatingGroupNode = observer(function RepeatingGroupNode({
  instance,
  canRemove,
}: RepeatingGroupNodeProps) {
  return (
    <section className="af-group-instance">
      <div className="af-group-instance-children">
        <ItemsList items={instance.nodes} />
      </div>
      {canRemove ? (
        <div className="af-group-instance-toolbar">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => instance.remove()}
            disabled={!canRemove}
          >
            Remove section
          </Button>
        </div>
      ) : null}
    </section>
  );
});
