import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { strings } from "../../../../strings.ts";
import { buildId } from "../../../../utils.ts";

export const TabContainerRenderer = observer(function TabContainerRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  const { TabContainer } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const visibleNodes = node.visibleNodes;
  const maxIndex = Math.max(visibleNodes.length - 1, 0);
  const activeIndex = Math.min(activeTab, maxIndex);
  const header = <NodeHeader node={node} as="text" />;
  const items = visibleNodes.map((child, idx) => ({
    token: child.token,
    label: <NodeHeader node={child} as="text" />,
    buttonId: buildId(node.token, "tab", idx),
    panelId: buildId(node.token, "panel", idx),
    content: <Node node={child} />,
  }));

  return (
    <TabContainer
      header={header}
      items={items}
      value={activeIndex}
      onChange={setActiveTab}
      errors={<NodeErrors node={node} />}
      empty={strings.tab.empty}
      linkId={node.linkId}
    />
  );
});
