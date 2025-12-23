import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { DateTimeInput } from "../fhir/dateTime/DateTimeInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const DateTimeWidget = observer(function DateTimeWidget({
  node,
}: {
  node: IQuestionNode<"dateTime">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"dateTime"> => {
    return (rowProps) => (
      <DateTimeInput
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
