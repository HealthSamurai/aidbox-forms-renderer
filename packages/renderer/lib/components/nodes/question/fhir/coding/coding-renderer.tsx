import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { CodingControl } from "./coding-control.tsx";

export const CodingRenderer = observer(function CodingRenderer({
  node,
}: {
  node: IQuestionNode<"coding">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={CodingControl} />
    </QuestionScaffold>
  );
});
