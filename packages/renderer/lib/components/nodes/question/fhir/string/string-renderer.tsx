import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { getValueControl } from "../index.ts";
import type { AnswerRenderCallback } from "../../answers/answer-scaffold.tsx";

export const StringRenderer = observer(function StringRenderer({
  node,
}: {
  node: IQuestionNode<"string" | "text" | "url">;
}) {
  const Control = getValueControl(node.type);
  const render = useMemo(
    (): AnswerRenderCallback<"string" | "text" | "url"> =>
      ({ answer, describedById, inputId, labelId }) => (
        <Control
          node={node}
          answer={answer}
          inputId={inputId}
          labelId={labelId}
          describedById={describedById}
        />
      ),
    [Control, node],
  );

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} render={render} />
    </QuestionScaffold>
  );
});
