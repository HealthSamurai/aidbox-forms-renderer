import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { QuantityInput } from "../fhir/quantity/QuantityInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const QuantityWidget = observer(function QuantityWidget({
  node,
}: {
  node: IQuestionNode<"quantity">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"quantity"> => {
    return (rowProps) => (
      <QuantityInput
        answer={rowProps.answer}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        placeholder={node.placeholder}
        disabled={node.readOnly}
        list={rowProps.list}
      />
    );
  }, [node]);

  return (
    <WidgetScaffold
      node={node}
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
