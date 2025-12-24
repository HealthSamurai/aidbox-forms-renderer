import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { DropdownRenderer } from "./dropdown-renderer.tsx";

export const LookupRenderer = observer(function LookupRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  return <DropdownRenderer node={node} />;
});
