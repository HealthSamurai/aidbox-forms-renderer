import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";

export const TabContainerRenderer = observer(function TabContainerRenderer({
  node,
}: GroupControlProps) {
  const { TabContainer } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const visibleNodes = node.visibleNodes;
  const maxIndex = Math.max(visibleNodes.length - 1, 0);
  const activeIndex = Math.min(activeTab, maxIndex);
  const header = <NodeHeader node={node} />;
  const items = visibleNodes.map((child, idx) => ({
    key: child.key,
    label: <NodeHeader node={child} />,
    buttonId: `${node.key}-tab-${idx}`,
    panelId: `${node.key}-panel-${idx}`,
    content: <Node node={child} />,
  }));

  return (
    <TabContainer
      header={header}
      items={items}
      value={activeIndex}
      onChange={setActiveTab}
      errors={<NodeErrors node={node} />}
      empty="No tab content"
      linkId={node.linkId}
    />
  );
});
