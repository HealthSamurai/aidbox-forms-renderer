import "./repeating-group-instance.css";
import { observer } from "mobx-react-lite";
import type { IRepeatingGroupInstance } from "../../stores/types.ts";
import { ItemsList } from "../common/item-list.tsx";
import { Button } from "../controls/button.tsx";

export type RepeatingGroupInstanceProps = {
  instance: IRepeatingGroupInstance;
  canRemove: boolean;
};

export const RepeatingGroupInstance = observer(function RepeatingGroupInstance({
  instance,
  canRemove,
}: RepeatingGroupInstanceProps) {
  return (
    <section className="af-group-instance">
      <div className="af-group-instance-children">
        <ItemsList items={instance.children} />
      </div>
      <div className="af-group-instance-toolbar">
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={instance.remove}
          disabled={!canRemove}
        >
          Remove section
        </Button>
      </div>
    </section>
  );
});
