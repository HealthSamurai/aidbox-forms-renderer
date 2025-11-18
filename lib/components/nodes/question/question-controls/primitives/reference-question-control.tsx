import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createReferenceAnswerRenderer } from "../answer-renderers.tsx";

export const ReferenceQuestionControl = observer(
  function ReferenceQuestionControl({
    node,
  }: {
    node: IQuestionNode<"reference">;
  }) {
    const renderAnswer = useMemo(
      () => createReferenceAnswerRenderer(node),
      [node],
    );
    return (
      <QuestionScaffold
        node={node}
        answers={<AnswerList node={node} renderRow={renderAnswer} />}
      />
    );
  },
);
