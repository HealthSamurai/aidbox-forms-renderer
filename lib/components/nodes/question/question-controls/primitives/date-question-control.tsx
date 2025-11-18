import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createDateAnswerRenderer } from "../answer-renderers.tsx";

export const DateQuestionControl = observer(function DateQuestionControl({
  node,
}: {
  node: IQuestionNode<"date">;
}) {
  const renderAnswer = useMemo(() => createDateAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
