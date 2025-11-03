import { observer } from "mobx-react-lite";
import { ItemNode } from "./item-node.tsx";
import { IPresentableNode } from "../../stores/types.ts";

export const ItemsList = observer(function ItemsList({
  items,
}: {
  items: IPresentableNode[];
}) {
  return (
    <>
      {items
        .filter((it) => !it.hidden)
        .map((it) => (
          <ItemNode key={it.key} item={it} />
        ))}
    </>
  );
});
