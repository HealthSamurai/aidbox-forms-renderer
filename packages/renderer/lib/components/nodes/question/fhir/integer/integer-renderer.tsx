import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { IntegerControl } from "./integer-control.tsx";
import type { AnswerRowRenderer } from "../../answers/answer-row.tsx";

export const IntegerRenderer = observer(function IntegerRenderer({
  node,
}: {
  node: IQuestionNode<"integer">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"integer"> => {
    return (rowProps) => (
      <IntegerControl
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
