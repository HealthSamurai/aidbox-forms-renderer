import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DateTimeControl } from "./date-time-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-renderer.tsx";

export const DateTimeRenderer = observer(function DateTimeRenderer({
  node,
}: {
  node: IQuestionNode<"dateTime">;
}) {
  const render = useMemo((): AnswerRenderCallback<"dateTime"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <DateTimeControl
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
