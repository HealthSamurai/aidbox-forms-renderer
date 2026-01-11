import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../../answer/answer-list.tsx";
import { AttachmentControl } from "./attachment-control.tsx";

export const AttachmentRenderer = observer(function AttachmentRenderer({
  node,
}: {
  node: IQuestionNode<"attachment">;
}) {
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={AttachmentControl} />
    </QuestionScaffold>
  );
});
