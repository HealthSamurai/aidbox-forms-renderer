import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createStringAnswerRenderer } from "../answer-renderers.tsx";
import { useMemo } from "react";

export const StringQuestionControl = observer(function StringQuestionControl({
  node,
}: {
  node: IQuestionNode<"string">;
}) {
  const renderAnswer = useMemo(() => createStringAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
