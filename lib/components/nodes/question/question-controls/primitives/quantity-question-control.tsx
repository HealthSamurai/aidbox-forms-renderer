import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { createQuantityAnswerRenderer } from "../answer-renderers.tsx";

export const QuantityQuestionControl = observer(
  function QuantityQuestionControl({
    node,
  }: {
    node: IQuestionNode<"quantity">;
  }) {
    const renderAnswer = useMemo(
      () => createQuantityAnswerRenderer(node),
      [node],
    );
    return (
      <QuestionScaffold
        node={node}
        className="af-node-quantity"
        answers={<AnswerList node={node} renderRow={renderAnswer} />}
      />
    );
  },
);
