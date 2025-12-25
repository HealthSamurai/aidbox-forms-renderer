import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { SliderControl } from "../controls/slider-control.tsx";

export const SliderRenderer = observer(function SliderRenderer({
  node,
}: {
  node: IQuestionNode<"integer" | "decimal" | "quantity">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={SliderControl} />
    </QuestionScaffold>
  );
});
