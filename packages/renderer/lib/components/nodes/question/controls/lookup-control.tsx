import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { DropdownControl } from "./dropdown-control.tsx";

export const LookupControl = observer(function LookupControl<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return <DropdownControl node={node} mode="lookup" />;
});
