import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { AttachmentInput } from "../fhir/attachment/AttachmentInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const AttachmentRenderer = observer(function AttachmentRenderer({
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
    <QuestionScaffold
      node={node}
      className="af-node-attachment"
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
