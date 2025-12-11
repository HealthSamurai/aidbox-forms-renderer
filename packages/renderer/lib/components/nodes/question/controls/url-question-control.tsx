import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createUrlAnswerRenderer } from "../answer-renderers.tsx";

export const UrlQuestionControl = observer(function UrlQuestionControl({
  node,
}: {
  node: IQuestionNode<"url">;
}) {
  const renderAnswer = useMemo(() => createUrlAnswerRenderer(node), [node]);
  return (
    <QuestionScaffold
      node={node}
      answers={<AnswerList node={node} renderRow={renderAnswer} />}
    />
  );
});
