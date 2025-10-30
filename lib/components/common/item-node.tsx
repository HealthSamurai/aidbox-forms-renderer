import { observer } from "mobx-react-lite";
import { DisplayNode } from "../nodes/display-node.tsx";
import { ICoreNode } from "../../stores/types.ts";
import { NonRepeatingGroupNode } from "../nodes/non-repeating-group-node.tsx";
import { RepeatingGroupWrapper } from "../nodes/repeating-group-wrapper.tsx";
import { QuestionNode } from "../nodes/question-node.tsx";
import { isDisplayNode } from "../../stores/display-store.ts";
import { isRepeatingGroupWrapper } from "../../stores/repeating-group-wrapper.ts";
import { isNonRepeatingGroupNode } from "../../stores/non-repeating-group-store.ts";
import { isQuestionNode } from "../../stores/question-store.ts";

export const ItemNode = observer(function ItemNode({
  item,
}: {
  item: ICoreNode;
}) {
  if (isQuestionNode(item)) return <QuestionNode item={item} />;
  if (isNonRepeatingGroupNode(item))
    return <NonRepeatingGroupNode item={item} />;
  if (isRepeatingGroupWrapper(item))
    return <RepeatingGroupWrapper item={item} />;
  if (isDisplayNode(item)) return <DisplayNode item={item} />;
  return null;
});
