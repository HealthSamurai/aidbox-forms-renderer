import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createTextAnswerRenderer } from "../answer-renderers.tsx";

export const TextQuestionControl = observer(function TextQuestionControl({
  node,
}: {
  node: IQuestionNode<"text">;
}) {
  const renderAnswer = useMemo(() => createTextAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
