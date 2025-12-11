import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { OptionSelectField } from "../components/option-select-field.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";

import { getOptionSelectionState } from "../shared.tsx";

export const SelectQuestionControl = observer(function SelectQuestionControl({
  node,
}: {
  node: IQuestionNode;
}) {
  const isLoading = node.options.loading;

  return (
    <QuestionScaffold
      node={node}
      showOptionsStatus
      answers={
        <AnswerList
          node={node}
          renderRow={(rowProps) => {
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
                  const nextValue = key
                    ? node.options.getValueForKey(key)
                    : null;
                  rowProps.setValue(nextValue);
                }}
                inputId={rowProps.inputId}
                labelId={rowProps.labelId}
                describedById={rowProps.describedById}
                readOnly={node.readOnly}
                isLoading={isLoading}
              />
            );
          }}
        />
      }
    />
  );
});
