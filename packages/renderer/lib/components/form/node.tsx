import { observer } from "mobx-react-lite";
import { DisplayRenderer } from "../nodes/display/display-renderer.tsx";
import { IPresentableNode } from "../../types.ts";
import { isDisplayNode } from "../../stores/nodes/display/display-store.ts";
import { isGroupListStore } from "../../stores/nodes/groups/group-list-store.ts";
import { isGroupNode } from "../../stores/nodes/groups/group-store.ts";
import { isQuestionNode } from "../../stores/nodes/questions/question-store.ts";

export const Node = observer(function Node({
  node,
}: {
  node: IPresentableNode;
}) {
  if (isQuestionNode(node)) {
    const Renderer = node.renderer;
    return Renderer ? <Renderer node={node} /> : undefined;
  }
  if (isGroupNode(node)) {
    const Renderer = node.renderer;
    return Renderer ? <Renderer node={node} /> : undefined;
  }
  if (isGroupListStore(node)) {
    const Renderer = node.renderer;
    return Renderer ? <Renderer node={node} /> : undefined;
  }
  if (isDisplayNode(node)) return <DisplayRenderer node={node} />;
  return;
});
