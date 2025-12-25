import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { DropdownSelectControl } from "../controls/dropdown-select-control.tsx";
import { MultiSelectControl } from "../controls/multi-select-control.tsx";
import { VALUE_DISPLAY_BY_TYPE } from "../fhir/index.ts";

export const DropdownRenderer = observer(function DropdownRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const ValueDisplay = VALUE_DISPLAY_BY_TYPE[node.type];
  const isMultiSelect = node.selectStore.isMultiSelect;

  return (
    <QuestionScaffold node={node} showOptionsState>
      {isMultiSelect ? (
        <MultiSelectControl node={node} valueDisplay={ValueDisplay} />
      ) : (
        <DropdownSelectControl node={node} />
      )}
    </QuestionScaffold>
  );
});
