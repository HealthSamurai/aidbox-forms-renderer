import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { SingleDropdownSelectControl } from "../controls/single-dropdown-select-control.tsx";
import { MultiDropdownSelectControl } from "../controls/multi-dropdown-select-control.tsx";

export const DropdownSelectRenderer = observer(function DropdownRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const isMultiSelect = node.selectStore.isMultiSelect;

  return (
    <QuestionScaffold node={node} showOptionsLoading>
      {isMultiSelect ? (
        <MultiDropdownSelectControl node={node} />
      ) : (
        <AnswerList node={node} control={SingleDropdownSelectControl} />
      )}
    </QuestionScaffold>
  );
});
