import { observer } from "mobx-react-lite";
import type {
  IPresentableNode,
  IQuestionNode,
  GroupControlProps,
} from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { SelectionMatrixTable } from "../components/selection-matrix.tsx";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export const TableControl = observer(function TableControl({
  node,
}: GroupControlProps) {
  const { GroupActions } = useTheme();
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  const { questions, others } = partitionNodes(visibleNodes);
  return (
    <GroupScaffold node={node} dataControl="table">
      <SelectionMatrixTable questions={questions} />
      {others.length > 0 ? (
        <GroupActions>
          <NodesList nodes={others} />
        </GroupActions>
      ) : null}
    </GroupScaffold>
  );
});

function partitionNodes(nodes: IPresentableNode[]): {
  questions: IQuestionNode[];
  others: IPresentableNode[];
} {
  const questions: IQuestionNode[] = [];
  const others: IPresentableNode[] = [];
  nodes.forEach((node) => {
    if (isQuestionNode(node)) {
      questions.push(node);
    } else {
      others.push(node);
    }
  });
  return { questions, others };
}
