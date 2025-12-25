import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DecimalControl } from "./decimal-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-renderer.tsx";

export const DecimalRenderer = observer(function DecimalRenderer({
  node,
}: {
  node: IQuestionNode<"decimal">;
}) {
  const render = useMemo((): AnswerRenderCallback<"decimal"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <DecimalControl
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
