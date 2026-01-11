import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../../answer/answer-list.tsx";
import { DateControl } from "./date-control.tsx";

export const DateRenderer = observer(function DateRenderer({
  node,
}: {
  node: IQuestionNode<"date">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={DateControl} />
    </QuestionScaffold>
  );
});
