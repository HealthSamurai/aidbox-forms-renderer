import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { TypedSuggestionInput } from "../components/typed-suggestion-input.tsx";
import type { AnswerRowRenderer } from "../answer-renderers.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";

import { DatalistAnswerType, getRendererForType } from "../shared.tsx";

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
