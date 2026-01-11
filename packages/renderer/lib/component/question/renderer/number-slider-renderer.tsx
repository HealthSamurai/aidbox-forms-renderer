import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../../answer/answer-list.tsx";
import { NumberSliderControl } from "../control/number-slider-control.tsx";

export const NumberSliderRenderer = observer(function SliderRenderer({
  node,
}: {
  node: IQuestionNode<"integer" | "decimal">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={NumberSliderControl} />
    </QuestionScaffold>
  );
});
