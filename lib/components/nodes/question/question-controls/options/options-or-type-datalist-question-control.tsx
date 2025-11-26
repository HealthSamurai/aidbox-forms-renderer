import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { TypedSuggestionInput } from "./controls/typed-suggestion-input.tsx";
import type { AnswerRowRenderer } from "../answer-renderers.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import type { DatalistAnswerType } from "./option-control-helpers.ts";
import { getRendererForType } from "./option-control-helpers.ts";

export const OptionsOrTypeDatalistQuestionControl = observer(
  function OptionsOrTypeDatalistQuestionControl({
    node,
  }: {
    node: IQuestionNode<DatalistAnswerType>;
  }) {
    const renderInput = getRendererForType(node);
    const typedRenderInput =
      renderInput as AnswerRowRenderer<DatalistAnswerType>;

    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={
          <AnswerList
            node={node}
            renderRow={(rowProps) => (
              <TypedSuggestionInput
                rowProps={rowProps}
                renderInput={typedRenderInput}
                options={node.options.entries}
                isLoading={node.options.loading}
                readOnly={node.readOnly}
              />
            )}
          />
        }
      />
    );
  },
);
