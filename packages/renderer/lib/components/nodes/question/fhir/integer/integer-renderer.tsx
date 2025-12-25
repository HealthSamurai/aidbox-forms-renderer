import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { IntegerControl } from "./integer-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-renderer.tsx";

export const IntegerRenderer = observer(function IntegerRenderer({
  node,
}: {
  node: IQuestionNode<"integer">;
}) {
  const render = useMemo((): AnswerRenderCallback<"integer"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <IntegerControl
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
