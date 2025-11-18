import { observer } from "mobx-react-lite";
import { DisplayNode } from "../nodes/display/display-node.tsx";
import { IPresentableNode } from "../../types.ts";
import { isDisplayNode } from "../../stores/nodes/display/display-store.ts";
import { isRepeatingGroupWrapper } from "../../stores/nodes/groups/repeating-group-wrapper.ts";
import { isGroupNode } from "../../stores/nodes/groups/group-store.ts";
import { isQuestionNode } from "../../stores/nodes/questions/question-store.ts";

export const Node = observer(function Node({
  node,
}: {
  node: IPresentableNode;
}) {
  if (isQuestionNode(node)) {
    const ControlComponent = node.component;
    return ControlComponent ? <ControlComponent node={node} /> : null;
  }
  if (isGroupNode(node)) {
    const ControlComponent = node.component;
    return ControlComponent ? <ControlComponent node={node} /> : null;
  }
  if (isRepeatingGroupWrapper(node)) {
    const ControlComponent = node.component;
    return ControlComponent ? <ControlComponent wrapper={node} /> : null;
  }
  if (isDisplayNode(node)) return <DisplayNode node={node} />;
  return null;
});
