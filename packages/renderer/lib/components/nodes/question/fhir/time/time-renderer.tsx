import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { TimeControl } from "./time-control.tsx";

export const TimeRenderer = observer(function TimeRenderer({
  node,
}: {
  node: IQuestionNode<"time">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={TimeControl} />
    </QuestionScaffold>
  );
});
