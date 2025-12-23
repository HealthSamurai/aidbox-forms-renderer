import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { ReferenceInput } from "../fhir/reference/ReferenceInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const ReferenceRenderer = observer(function ReferenceRenderer({
  node,
}: {
  node: IQuestionNode<"reference">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"reference"> => {
    return (rowProps) => (
      <ReferenceInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        value={rowProps.value ?? null}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
        placeholder={node.placeholder}
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
