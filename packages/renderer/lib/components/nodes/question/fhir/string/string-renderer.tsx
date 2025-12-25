import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../answers/answer-list.tsx";
import { getValueControl } from "../index.ts";
import type { AnswerRowRenderer } from "../../answers/answer-row.tsx";

export const StringRenderer = observer(function StringRenderer({
  node,
}: {
  node: IQuestionNode<"string" | "text" | "url">;
}) {
  const Control = getValueControl(node.type);
  const renderRow = useMemo(
    (): AnswerRowRenderer<"string" | "text" | "url"> => (rowProps) => (
      <Control
        node={node}
        answer={rowProps.answer}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
      />
    ),
    [Control, node],
  );

  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} renderRow={renderRow} />
    </QuestionScaffold>
  );
});
