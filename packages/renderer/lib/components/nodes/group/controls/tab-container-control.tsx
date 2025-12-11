import "./tab-container-control.css";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodeText } from "../../../form/node-text.tsx";
import { Node } from "../../../form/node.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";

export const TabContainerControl = observer(function TabContainerControl({
  node,
}: GroupControlProps) {
  const [activeTab, setActiveTab] = useState(0);
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  const activeIndex = Math.min(activeTab, Math.max(visibleNodes.length - 1, 0));
  const activeNode = visibleNodes[activeIndex];

  return (
    <div
      className="af-tab-container"
      data-linkid={node.linkId}
      data-item-control="tab-container"
    >
      {node.template.text ? (
        <div className="af-tab-container__header">
          <NodeText node={node} as="legend" />
        </div>
      ) : null}
      <div className="af-tablist" role="tablist">
        {visibleNodes.map((child, idx) => {
          const tabId = `${node.key}-tab-${idx}`;
          const panelId = `${node.key}-tabpanel`;
          const label = child.text ?? child.linkId ?? `Tab ${idx + 1}`;
          return (
            <button
              key={child.key}
              type="button"
              className="af-tab-button"
              role="tab"
              id={tabId}
              aria-selected={idx === activeIndex}
              aria-controls={panelId}
              onClick={() => setActiveTab(idx)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div
        className="af-tabpanel"
        role="tabpanel"
        id={`${node.key}-tabpanel`}
        aria-labelledby={`${node.key}-tab-${activeIndex}`}
      >
        {activeNode ? (
          <Node node={activeNode} />
        ) : (
          <p className="af-tabpanel__empty">No tab content</p>
        )}
      </div>
      <NodeErrors node={node} />
    </div>
  );
});
