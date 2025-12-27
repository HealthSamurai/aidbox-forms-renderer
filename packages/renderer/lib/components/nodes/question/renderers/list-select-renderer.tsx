import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { ListSelectControl } from "../controls/list-select-control.tsx";

export const ListSelectRenderer = observer(function ListSelectRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return (
    <QuestionScaffold node={node} showOptionsLoading>
      <ListSelectControl node={node} />
    </QuestionScaffold>
  );
});
