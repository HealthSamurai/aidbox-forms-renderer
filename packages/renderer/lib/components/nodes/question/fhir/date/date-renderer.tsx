import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DateControl } from "./date-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-scaffold.tsx";

export const DateRenderer = observer(function DateRenderer({
  node,
}: {
  node: IQuestionNode<"date">;
}) {
  const render = useMemo((): AnswerRenderCallback<"date"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <DateControl
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
