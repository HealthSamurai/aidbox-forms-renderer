import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { QuantitySliderControl } from "../controls/quantity-slider-control.tsx";

export const QuantitySliderRenderer = observer(function QuantitySliderRenderer({
  node,
}: {
  node: IQuestionNode<"quantity">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={QuantitySliderControl} />
    </QuestionScaffold>
  );
});
