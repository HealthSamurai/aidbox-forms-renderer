import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { NodeList } from "../../node/node-list.tsx";

export const HeaderRenderer = observer(function HeaderRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  return <NodeList nodes={node.visibleNodes} />;
});
