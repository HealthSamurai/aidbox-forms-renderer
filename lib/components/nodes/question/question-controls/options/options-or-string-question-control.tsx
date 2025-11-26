import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import {
  type AnswerRowRenderer,
  createStringAnswerRenderer,
  createTextAnswerRenderer,
} from "../answer-renderers.tsx";
import type { StringLikeAnswerType } from "./option-control-helpers.ts";
import { OptionsOrStringField } from "./controls/options-or-string-field.tsx";

const CUSTOM_STRING_KEY = "__af-custom-value__";

export const OptionsOrStringQuestionControl = observer(
  function OptionsOrStringQuestionControl({
    node,
  }: {
    node: IQuestionNode<StringLikeAnswerType>;
  }) {
    const isLoading = node.options.loading;
    const renderInput =
      node.type === "text"
        ? createTextAnswerRenderer(node as IQuestionNode<"text">)
        : createStringAnswerRenderer(node as IQuestionNode<"string">);
    const typedRenderInput =
      renderInput as AnswerRowRenderer<StringLikeAnswerType>;

    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={
          <AnswerList
            node={node}
            renderRow={(rowProps) => (
              <OptionsOrStringField
                node={node}
                rowProps={rowProps}
                options={node.options.entries}
                renderInput={typedRenderInput}
                getValueForKey={(key) => node.options.getValueForKey(key)}
                getKeyForValue={(value) => node.options.getKeyForValue(value)}
                customOptionKey={CUSTOM_STRING_KEY}
                isLoading={isLoading}
              />
            )}
          />
        }
      />
    );
  },
);
