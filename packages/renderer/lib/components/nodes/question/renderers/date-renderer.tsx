import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { DateControl } from "../fhir/date/DateControl.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const DateRenderer = observer(function DateRenderer({
  node,
}: {
  node: IQuestionNode<"date">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"date"> => {
    return (rowProps) => (
      <DateControl
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
