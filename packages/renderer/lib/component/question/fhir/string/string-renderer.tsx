import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../../question-scaffold.tsx";
import { AnswerList } from "../../../answer/answer-list.tsx";
import { getValueControl } from "../value-control.ts";

export const StringRenderer = observer(function StringRenderer({
  node,
}: {
  node: IQuestionNode<"string" | "text" | "url">;
}) {
  const Control = getValueControl(node.type);
  return (
    <QuestionScaffold node={node}>
      <AnswerList node={node} control={Control} />
    </QuestionScaffold>
  );
});
