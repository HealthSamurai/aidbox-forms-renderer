import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { ReferenceControl } from "./reference-control.tsx";
import type { AnswerRenderCallback } from "../../answers/answer-scaffold.tsx";

export const ReferenceRenderer = observer(function ReferenceRenderer({
  node,
}: {
  node: IQuestionNode<"reference">;
}) {
  const render = useMemo((): AnswerRenderCallback<"reference"> => {
    return ({ answer, describedById, inputId, labelId }) => (
      <ReferenceControl
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
