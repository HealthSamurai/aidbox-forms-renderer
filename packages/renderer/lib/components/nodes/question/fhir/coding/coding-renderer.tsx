import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { CodingControl } from "./coding-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-renderer.tsx";

export const CodingRenderer = observer(function CodingRenderer({
  node,
}: {
  node: IQuestionNode<"coding">;
}) {
  const render = useMemo((): AnswerRenderCallback<"coding"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <CodingControl
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
