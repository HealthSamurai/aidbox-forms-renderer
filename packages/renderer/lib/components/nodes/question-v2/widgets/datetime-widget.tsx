import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { DateTimeQuestionInput } from "../inputs/datetime-input.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const DateTimeWidget = observer(function DateTimeWidget({
  node,
}: {
  node: IQuestionNode<"dateTime">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"dateTime"> => {
    return (rowProps) => (
      <DateTimeQuestionInput
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
