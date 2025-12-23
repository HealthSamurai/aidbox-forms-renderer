import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { TimeInput } from "../fhir/time/TimeInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const TimeRenderer = observer(function TimeRenderer({
  node,
}: {
  node: IQuestionNode<"time">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"time"> => {
    return (rowProps) => (
      <TimeInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        placeholder={node.placeholder}
        value={rowProps.value ?? ""}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
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
