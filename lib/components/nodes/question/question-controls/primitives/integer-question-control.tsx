import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createIntegerAnswerRenderer } from "../answer-renderers.tsx";

export const IntegerQuestionControl = observer(function IntegerQuestionControl({
  node,
}: {
  node: IQuestionNode<"integer">;
}) {
  const renderAnswer = useMemo(() => createIntegerAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
