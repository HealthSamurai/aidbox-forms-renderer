import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../../answer/answer-list.tsx";
import { NumberSpinnerControl } from "../control/number-spinner-control.tsx";

export const NumberSpinnerRenderer = observer(function SpinnerRenderer({
  node,
}: {
  node: IQuestionNode<"integer" | "decimal">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={NumberSpinnerControl} />
    </QuestionScaffold>
  );
});
