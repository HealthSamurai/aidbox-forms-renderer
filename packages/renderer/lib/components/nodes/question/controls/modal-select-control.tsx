import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { DropdownSelectControl } from "./dropdown-select-control.tsx";

export const ModalSelectControl = observer(function ModalSelectControl<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return <DropdownSelectControl node={node} mode="lookup" />;
});
