import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { DropdownControl } from "../controls/dropdown-control.tsx";

export const DropdownWidget = observer(function DropdownWidget<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const mode =
    node.control === "lookup"
      ? "lookup"
      : node.control === "autocomplete"
        ? "autocomplete"
        : "select";

  return (
    <WidgetScaffold
      node={node}
      showOptionsState
      body={<DropdownControl node={node} mode={mode} />}
    />
  );
});
