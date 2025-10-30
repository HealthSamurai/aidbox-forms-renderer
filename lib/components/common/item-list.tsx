import { observer } from "mobx-react-lite";
import { ItemNode } from "./item-node.tsx";
import { ICoreNode } from "../../stores/types.ts";

export const ItemsList = observer(function ItemsList({
  items,
}: {
  items: ICoreNode[];
}) {
  return (
    <>
      {items
        .filter((it) => it.isEnabled)
        .map((it) => (
          <ItemNode key={it.key} item={it} />
        ))}
    </>
  );
});
