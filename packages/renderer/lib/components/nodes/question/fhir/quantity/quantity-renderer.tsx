import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { QuantityControl } from "./quantity-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-scaffold.tsx";

export const QuantityRenderer = observer(function QuantityRenderer({
  node,
}: {
  node: IQuestionNode<"quantity">;
}) {
  const render = useMemo((): AnswerRenderCallback<"quantity"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <QuantityControl
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
