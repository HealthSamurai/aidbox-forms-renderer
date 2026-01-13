import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { Node } from "../../node/node.tsx";
import { NodeHeader } from "../../node/node-header.tsx";
import { NodeErrors } from "../../node/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { buildId } from "../../../utilities.ts";

export const TabContainerControl = observer(function TabContainerControl({
  node,
}: {
  node: IGroupNode;
}) {
  const { TabContainer } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const visibleNodes = node.visibleNodes;
  const maxIndex = Math.max(visibleNodes.length - 1, 0);
  const activeIndex = Math.min(activeTab, maxIndex);
  const header = <NodeHeader node={node} as="legend" />;
  const items = visibleNodes.map((child, index) => ({
    token: child.token,
    label: <NodeHeader node={child} as="text" />,
    buttonId: buildId(node.token, "tab", index),
    panelId: buildId(node.token, "panel", index),
    content: <Node node={child} />,
  }));

  return (
    <TabContainer
      header={header}
      items={items}
      value={activeIndex}
      onChange={setActiveTab}
      errors={<NodeErrors node={node} />}
      linkId={node.linkId}
    />
  );
});
