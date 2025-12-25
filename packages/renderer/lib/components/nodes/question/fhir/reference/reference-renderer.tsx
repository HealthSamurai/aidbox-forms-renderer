import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { ReferenceControl } from "./reference-control.tsx";

export const ReferenceRenderer = observer(function ReferenceRenderer({
  node,
}: {
  node: IQuestionNode<"reference">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={ReferenceControl} />
    </QuestionScaffold>
  );
});
