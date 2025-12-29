import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { QuantitySpinnerControl } from "../controls/quantity-spinner-control.tsx";

export const QuantitySpinnerRenderer = observer(
  function QuantitySpinnerRenderer({
    node,
  }: {
    node: IQuestionNode<"quantity">;
  }) {
    return (
      <QuestionScaffold node={node}>
        <AnswerList node={node} control={QuantitySpinnerControl} />
      </QuestionScaffold>
    );
  },
);
