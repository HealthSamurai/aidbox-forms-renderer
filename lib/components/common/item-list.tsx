import { observer } from "mobx-react-lite";
import { ItemNode } from "./item-node.tsx";
import { INodeStore } from "../../stores/types.ts";

export const ItemsList = observer(function ItemsList({
  items,
}: {
  items: INodeStore[];
}) {
  return (
    <>
      {items
        .filter((it) => it.isEnabled)
        .map((it) => (
          <ItemNode key={it.path} item={it} />
        ))}
    </>
  );
});
