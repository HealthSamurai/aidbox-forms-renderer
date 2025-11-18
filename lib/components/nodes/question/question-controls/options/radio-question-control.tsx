import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import { AnswerList } from "../../shared/answer-list.tsx";
import { OptionRadioGroup } from "./controls/option-radio-group.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { getOptionSelectionState } from "./option-control-helpers.ts";

export const RadioQuestionControl = observer(function RadioQuestionControl({
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
      <OptionRadioGroup
        options={node.options.entries}
        selectValue={selectValue}
        legacyOptionLabel={legacyOption?.label}
        legacyOptionKey={legacyOption?.key}
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
