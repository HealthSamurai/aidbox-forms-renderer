import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DecimalControl } from "./decimal-control.tsx";

export const DecimalRenderer = observer(function DecimalRenderer({
  node,
}: {
  node: IQuestionNode<"decimal">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={DecimalControl} />
    </QuestionScaffold>
  );
});
