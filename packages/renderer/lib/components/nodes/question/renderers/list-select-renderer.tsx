import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { MultiListSelectControl } from "../controls/multi-list-select-control.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { SingleListSelectControl } from "../controls/single-list-select-control.tsx";

export const ListSelectRenderer = observer(function ListSelectRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return (
    <QuestionScaffold node={node} showOptionsLoading>
      {node.isRepeatingWithoutChildren ? (
        <MultiListSelectControl node={node} />
      ) : (
        <AnswerList node={node} control={SingleListSelectControl} />
      )}
    </QuestionScaffold>
  );
});
