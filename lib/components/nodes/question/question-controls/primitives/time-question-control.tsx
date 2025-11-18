import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createTimeAnswerRenderer } from "../answer-renderers.tsx";

export const TimeQuestionControl = observer(function TimeQuestionControl({
  node,
}: {
  node: IQuestionNode<"time">;
}) {
  const renderAnswer = useMemo(() => createTimeAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
