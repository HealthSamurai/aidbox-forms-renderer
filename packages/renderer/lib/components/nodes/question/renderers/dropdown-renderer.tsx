import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { DropdownControl } from "../controls/dropdown-control.tsx";

export const DropdownRenderer = observer(function DropdownRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const mode =
    node.control === "lookup"
      ? "lookup"
      : node.control === "autocomplete"
        ? "autocomplete"
        : "select";

  return (
    <QuestionScaffold
      node={node}
      showOptionsState
      children={<DropdownControl node={node} mode={mode} />}
    />
  );
});
