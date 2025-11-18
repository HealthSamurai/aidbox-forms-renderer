import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createCodingAnswerRenderer } from "../answer-renderers.tsx";

export const CodingQuestionControl = observer(function CodingQuestionControl({
  node,
}: {
  node: IQuestionNode<"coding">;
}) {
  const renderAnswer = useMemo(() => createCodingAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
