import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { LookupControl } from "../controls/lookup-control.tsx";

export const LookupWidget = observer(function LookupWidget<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return (
    <WidgetScaffold
      node={node}
      showOptionsState
      body={<LookupControl node={node} />}
    />
  );
});
