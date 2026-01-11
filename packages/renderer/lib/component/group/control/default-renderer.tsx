import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { NodeList } from "../../node/node-list.tsx";

export const DefaultRenderer = observer(function DefaultRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  return <NodeList nodes={node.visibleNodes} />;
});
