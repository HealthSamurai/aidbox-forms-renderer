import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { getNodeLabelParts } from "../../../form/node-text.tsx";
import { Node } from "../../../form/node.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";

export const TabContainerControl = observer(function TabContainerControl({
  node,
}: GroupControlProps) {
  const { TabContainer } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  const activeIndex = Math.min(activeTab, Math.max(visibleNodes.length - 1, 0));
  const { labelText } = getNodeLabelParts(node);
  const items = visibleNodes.map((child, idx) => ({
    key: child.key,
    label: child.text ?? child.linkId ?? `Tab ${idx + 1}`,
    tabId: `${node.key}-tab-${idx}`,
    panelId: `${node.key}-panel-${idx}`,
    content: <Node node={child} />,
  }));
  const legend = node.template.text ? labelText : undefined;

  return (
    <TabContainer
      legend={legend}
      items={items}
      activeIndex={activeIndex}
      onSelect={setActiveTab}
      errors={<NodeErrors node={node} />}
      empty="No tab content"
      linkId={node.linkId}
    />
  );
});
