import { observer } from "mobx-react-lite";
import { DisplayNode } from "../nodes/display-node.tsx";
import { INodeStore } from "../../stores/types.ts";
import { NonRepeatingGroupNode } from "../nodes/non-repeating-group-node.tsx";
import { RepeatingGroupNode } from "../nodes/repeating-group-node.tsx";
import { QuestionNode } from "../nodes/question-node.tsx";
import {
  isDisplay,
  isNonRepeatingGroup,
  isRepeatingGroup,
} from "../../utils.ts";

export const ItemNode = observer(function ItemNode({
  item,
}: {
  item: INodeStore;
}) {
  if (isDisplay(item)) return <DisplayNode item={item} />;
  if (isNonRepeatingGroup(item)) return <NonRepeatingGroupNode item={item} />;
  if (isRepeatingGroup(item)) return <RepeatingGroupNode item={item} />;

  return <QuestionNode item={item} />;
});
