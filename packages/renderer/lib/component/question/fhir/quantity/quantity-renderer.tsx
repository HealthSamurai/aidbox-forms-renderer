import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../../answer/answer-list.tsx";
import { QuantityControl } from "./quantity-control.tsx";

export const QuantityRenderer = observer(function QuantityRenderer({
  node,
}: {
  node: IQuestionNode<"quantity">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={QuantityControl} />
    </QuestionScaffold>
  );
});
