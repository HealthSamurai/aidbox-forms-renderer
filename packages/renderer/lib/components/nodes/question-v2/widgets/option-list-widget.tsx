import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { OptionListControl } from "../controls/option-list-control.tsx";

export const OptionListWidget = observer(function OptionListWidget<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return (
    <WidgetScaffold
      node={node}
      showOptionsStatus
      body={<OptionListControl node={node} />}
    />
  );
});
