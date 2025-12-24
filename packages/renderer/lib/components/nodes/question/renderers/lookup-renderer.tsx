import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { ModalSelectControl } from "../controls/modal-select-control.tsx";

export const LookupRenderer = observer(function LookupRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return (
    <QuestionScaffold
      node={node}
      showOptionsState
      children={<ModalSelectControl node={node} />}
    />
  );
});
