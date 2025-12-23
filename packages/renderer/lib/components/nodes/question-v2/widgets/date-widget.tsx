import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { DateInput } from "../fhir/date/DateInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const DateWidget = observer(function DateWidget({
  node,
}: {
  node: IQuestionNode<"date">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"date"> => {
    return (rowProps) => (
      <DateInput
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
    <WidgetScaffold
      node={node}
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
