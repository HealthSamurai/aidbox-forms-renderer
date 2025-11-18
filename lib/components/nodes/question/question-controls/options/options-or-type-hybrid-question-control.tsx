import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import { AnswerList } from "../../shared/answer-list.tsx";
import { OptionSelectField } from "./controls/option-select-field.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import {
  getRendererForType,
  getOptionSelectionState,
} from "./option-control-helpers.ts";
import type { AnswerRowRenderer } from "../answer-renderers.tsx";
import type { HybridAnswerType } from "./option-control-helpers.ts";

export const OptionsOrTypeHybridQuestionControl = observer(
  function OptionsOrTypeHybridQuestionControl({
    node,
  }: {
    node: IQuestionNode<HybridAnswerType>;
  }) {
    const isLoading = node.options.loading;
    const renderInput = getRendererForType(node);
    const typedRenderInput = renderInput as AnswerRowRenderer<HybridAnswerType>;

    const renderRow = (rowProps: RowRenderProps<HybridAnswerType>) => {
      const { selectValue, legacyOption } = getOptionSelectionState(
        node,
        rowProps,
      );
      return (
        <div className="af-open-choice">
          <div className="af-open-choice__select">
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
          </div>
          <div className="af-open-choice__input">
            {typedRenderInput(rowProps)}
          </div>
        </div>
      );
    };

    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={<AnswerList node={node} renderRow={renderRow} />}
      />
    );
  },
);
