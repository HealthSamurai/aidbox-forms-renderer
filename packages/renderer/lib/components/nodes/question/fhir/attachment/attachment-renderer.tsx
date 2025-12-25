import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { AttachmentControl } from "./attachment-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-scaffold.tsx";

export const AttachmentRenderer = observer(function AttachmentRenderer({
  node,
}: {
  node: IQuestionNode<"attachment">;
}) {
  const render = useMemo((): AnswerRenderCallback<"attachment"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <AttachmentControl
        node={node}
        answer={answer}
        inputId={inputId}
        labelId={labelId}
        describedById={describedById}
      />
    );
  }, [node]);

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} render={render} />
    </QuestionScaffold>
  );
});
