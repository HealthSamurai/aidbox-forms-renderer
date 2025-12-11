import { observer } from "mobx-react-lite";
import { DisplayNode } from "../nodes/display/display-node.tsx";
import { IPresentableNode } from "../../types.ts";
import { isDisplayNode } from "../../stores/nodes/display/display-store.ts";
import { isGroupWrapper } from "../../stores/nodes/groups/group-wrapper.ts";
import { isGroupNode } from "../../stores/nodes/groups/group-store.ts";
import { isQuestionNode } from "../../stores/nodes/questions/question-store.ts";

export const Node = observer(function Node({
  node,
}: {
  node: IPresentableNode;
}) {
  if (isQuestionNode(node)) {
    const Component = node.component;
    return Component ? <Component node={node} /> : null;
  }
  if (isGroupNode(node)) {
    const Component = node.component;
    return Component ? <Component node={node} /> : null;
  }
  if (isGroupWrapper(node)) {
    const Component = node.component;
    return Component ? <Component wrapper={node} /> : null;
  }
  if (isDisplayNode(node)) return <DisplayNode node={node} />;
  return null;
});
