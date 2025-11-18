import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import { AnswerList } from "../../shared/answer-list.tsx";
import { OptionSelectField } from "./controls/option-select-field.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { getOptionSelectionState } from "./option-control-helpers.ts";

export const SelectQuestionControl = observer(function SelectQuestionControl({
  node,
}: {
  node: IQuestionNode;
}) {
  const isLoading = node.options.loading;
  const renderRow = (rowProps: RowRenderProps<AnswerType>) => {
    const { selectValue, legacyOption } = getOptionSelectionState(
      node,
      rowProps,
    );
    return (
      <OptionSelectField
        options={node.options.entries}
        selectValue={selectValue}
        legacyOption={legacyOption}
        onChange={(key) => {
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        isLoading={isLoading}
      />
    );
  };

  return (
    <QuestionScaffold
      node={node}
      showOptionsStatus
      answers={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
