import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { CodingInput } from "../fhir/coding/CodingInput.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const CodingRenderer = observer(function CodingRenderer({
  node,
}: {
  node: IQuestionNode<"coding">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"coding"> => {
    return (rowProps) => (
      <CodingInput
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
    <QuestionScaffold node={node}>
      <AnswerList node={node} renderRow={renderRow} />
    </QuestionScaffold>
  );
});
