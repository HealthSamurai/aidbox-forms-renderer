import "./node-header.css";
import { NodeText } from "./node-text.tsx";
import { INode } from "../../types.ts";
import { observer } from "mobx-react-lite";
import { NodeHelp } from "./node-help.tsx";
import { NodeFlyover } from "./node-flyover.tsx";
import { NodeLegal } from "./node-legal.tsx";

export const NodeHeader = observer(function NodeHeader({
  node,
}: {
  node: INode;
}) {
  return (
    <div className="af-node-header">
      <div className="af-node-header__label">
        <NodeText node={node} as="label" />
        {node.required && (
          <span aria-hidden className="af-required">
            *
          </span>
        )}
        <NodeHelp node={node} />
        <NodeLegal node={node} />
        <NodeFlyover node={node} />
      </div>
    </div>
  );
});
