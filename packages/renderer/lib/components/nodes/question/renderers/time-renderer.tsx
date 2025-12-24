import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { TimeControl } from "../fhir/time/TimeControl.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const TimeRenderer = observer(function TimeRenderer({
  node,
}: {
  node: IQuestionNode<"time">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"time"> => {
    return (rowProps) => (
      <TimeControl
        node={node}
        answer={rowProps.answer}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
      />
    );
  }, [node]);

  return (
    <QuestionScaffold
      node={node}
      children={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
