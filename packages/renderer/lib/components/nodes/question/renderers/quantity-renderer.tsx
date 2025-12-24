import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { QuantityControl } from "../fhir/quantity/QuantityControl.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const QuantityRenderer = observer(function QuantityRenderer({
  node,
}: {
  node: IQuestionNode<"quantity">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"quantity"> => {
    return (rowProps) => (
      <QuantityControl
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
