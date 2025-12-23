import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { LookupControl } from "../controls/lookup-control.tsx";

export const LookupRenderer = observer(function LookupRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return (
    <QuestionScaffold
      node={node}
      showOptionsState
      body={<LookupControl node={node} />}
    />
  );
});
