import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../../types.ts";
import { NodeList } from "../../../form/node-list.tsx";

export const PageRenderer = observer(function PageRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  return <NodeList nodes={node.visibleNodes} />;
});
