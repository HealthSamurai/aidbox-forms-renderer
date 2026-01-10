import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../../types.ts";
import { NodeList } from "../../../form/node-list.tsx";

export const FooterRenderer = observer(function FooterRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  return <NodeList nodes={node.visibleNodes} />;
});
