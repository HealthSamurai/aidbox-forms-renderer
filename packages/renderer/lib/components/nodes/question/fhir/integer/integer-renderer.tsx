import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { IntegerControl } from "./integer-control.tsx";

export const IntegerRenderer = observer(function IntegerRenderer({
  node,
}: {
  node: IQuestionNode<"integer">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={IntegerControl} />
    </QuestionScaffold>
  );
});
