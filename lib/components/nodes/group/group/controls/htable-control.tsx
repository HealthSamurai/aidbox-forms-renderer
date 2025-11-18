import "./table-control.css";
import { observer } from "mobx-react-lite";
import type {
  IPresentableNode,
  IQuestionNode,
  GroupControlProps,
} from "../../../../../types.ts";
import { NodesList } from "../../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { ChoiceMatrixHorizontalTable } from "../components/choice-matrix.tsx";
import { isQuestionNode } from "../../../../../stores/nodes/questions/question-store.ts";

export const HTableControl = observer(function HTableControl({
  node,
}: GroupControlProps) {
  const visibleNodes = node.nodes.filter((child) => !child.hidden);
  const { questions, others } = partitionNodes(visibleNodes);
  return (
    <GroupScaffold
      node={node}
      className="af-group af-group--htable"
      dataControl="htable"
    >
      <ChoiceMatrixHorizontalTable questions={questions} />
      {others.length > 0 ? (
        <div className="af-group-table__extras">
          <NodesList nodes={others} />
        </div>
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
