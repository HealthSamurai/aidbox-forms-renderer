import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createDateTimeAnswerRenderer } from "../answer-renderers.tsx";

export const DateTimeQuestionControl = observer(
  function DateTimeQuestionControl({
    node,
  }: {
    node: IQuestionNode<"dateTime">;
  }) {
    const renderAnswer = useMemo(
      () => createDateTimeAnswerRenderer(node),
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
