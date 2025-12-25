import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DateTimeControl } from "./date-time-control.tsx";

export const DateTimeRenderer = observer(function DateTimeRenderer({
  node,
}: {
  node: IQuestionNode<"dateTime">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={DateTimeControl} />
    </QuestionScaffold>
  );
});
