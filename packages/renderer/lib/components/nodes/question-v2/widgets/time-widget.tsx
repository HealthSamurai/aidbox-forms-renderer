import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { TimeQuestionInput } from "../inputs/time-input.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const TimeWidget = observer(function TimeWidget({
  node,
}: {
  node: IQuestionNode<"time">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"time"> => {
    return (rowProps) => (
      <TimeQuestionInput
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
