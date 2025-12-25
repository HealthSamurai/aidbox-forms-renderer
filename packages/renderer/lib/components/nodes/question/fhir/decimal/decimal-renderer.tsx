import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DecimalControl } from "./decimal-control.tsx";
import type { AnswerRowRenderer } from "../../answers/answer-row.tsx";

export const DecimalRenderer = observer(function DecimalRenderer({
  node,
}: {
  node: IQuestionNode<"decimal">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"decimal"> => {
    return (rowProps) => (
      <DecimalControl
        node={node}
        answer={rowProps.answer}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
      />
    );
  }, [node]);

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} renderRow={renderRow} />
    </QuestionScaffold>
  );
});
