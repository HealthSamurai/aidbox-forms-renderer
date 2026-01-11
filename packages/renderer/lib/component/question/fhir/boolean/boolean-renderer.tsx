import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../../answer/answer-list.tsx";
import { BooleanControl } from "./boolean-control.tsx";

export const BooleanRenderer = observer(function BooleanRenderer({
  node,
}: {
  node: IQuestionNode<"boolean">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={BooleanControl} />
    </QuestionScaffold>
  );
});
