import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { DropdownSelectControl } from "../controls/dropdown-select-control.tsx";
import { MultiSelectControl } from "../controls/multi-select-control.tsx";

export const DropdownRenderer = observer(function DropdownRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const isMultiSelect = node.selectStore.isMultiSelect;

  return (
    <QuestionScaffold node={node} showOptionsState>
      {isMultiSelect ? (
        <MultiSelectControl node={node} />
      ) : (
        <DropdownSelectControl node={node} />
      )}
    </QuestionScaffold>
  );
});
