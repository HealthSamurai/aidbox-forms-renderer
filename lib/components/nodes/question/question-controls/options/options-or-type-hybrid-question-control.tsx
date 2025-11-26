import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { OptionSelectField } from "./controls/option-select-field.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import type { HybridAnswerType } from "./option-control-helpers.ts";
import {
  getOptionSelectionState,
  getRendererForType,
} from "./option-control-helpers.ts";
import type { AnswerRowRenderer } from "../answer-renderers.tsx";

export const OptionsOrTypeHybridQuestionControl = observer(
  function OptionsOrTypeHybridQuestionControl({
    node,
  }: {
    node: IQuestionNode<HybridAnswerType>;
  }) {
    const isLoading = node.options.loading;
    const renderInput = getRendererForType(node);
    const typedRenderInput = renderInput as AnswerRowRenderer<HybridAnswerType>;

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
                <div className="af-open-choice">
                  <div className="af-open-choice__select">
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
                  </div>
                  <div className="af-open-choice__input">
                    {typedRenderInput(rowProps)}
                  </div>
                </div>
              );
            }}
          />
        }
      />
    );
  },
);
