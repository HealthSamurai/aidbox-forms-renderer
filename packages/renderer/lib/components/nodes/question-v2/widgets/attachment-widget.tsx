import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { AttachmentInput } from "../inputs/attachment-input.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const AttachmentWidget = observer(function AttachmentWidget({
  node,
}: {
  node: IQuestionNode<"attachment">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"attachment"> => {
    return (rowProps) => (
      <AttachmentInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        value={rowProps.value ?? null}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
      />
    );
  }, [node]);

  return (
    <WidgetScaffold
      node={node}
      className="af-node-attachment"
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
