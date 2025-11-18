import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createDecimalAnswerRenderer } from "../answer-renderers.tsx";

export const DecimalQuestionControl = observer(function DecimalQuestionControl({
  node,
}: {
  node: IQuestionNode<"decimal">;
}) {
  const renderAnswer = useMemo(() => createDecimalAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
