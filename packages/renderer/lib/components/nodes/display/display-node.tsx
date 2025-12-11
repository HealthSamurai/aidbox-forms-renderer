import "./display-node.css";
import { observer } from "mobx-react-lite";
import { NodeText } from "../../form/node-text.tsx";
import { IDisplayNode } from "../../../types.ts";

export const DisplayNode = observer(function DisplayNode({
  node,
}: {
  node: IDisplayNode;
}) {
  return (
    <div className="af-node-display-wrapper" data-linkid={node.linkId}>
      <NodeText node={node} as="span" className="af-node-display" />
    </div>
  );
});
