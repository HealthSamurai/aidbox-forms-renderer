import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { DateTimeControl } from "./date-time-control.tsx";
import type { AnswerRowRenderer } from "../../answers/answer-row.tsx";

export const DateTimeRenderer = observer(function DateTimeRenderer({
  node,
}: {
  node: IQuestionNode<"dateTime">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"dateTime"> => {
    return (rowProps) => (
      <DateTimeControl
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
