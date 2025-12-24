import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { DropdownSelectControl } from "../controls/dropdown-select-control.tsx";
import { MultiSelectControl } from "../controls/multi-select-control.tsx";
import type { CustomKind } from "../../../../stores/nodes/questions/select-control-types.ts";
import { VALUE_DISPLAY_BY_TYPE } from "../fhir/index.ts";

export function getSelectCustomKind(
  constraint: string | undefined,
): CustomKind {
  if (constraint === "optionsOrString") return "string";
  if (constraint === "optionsOrType") return "type";
  return "none";
}

export const DropdownRenderer = observer(function DropdownRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const customKind = getSelectCustomKind(node.options.constraint);
  const rowVariant = customKind === "none" ? "options" : "open-choice";
  const ValueDisplay = VALUE_DISPLAY_BY_TYPE[node.type];
  const isMultiSelect = node.selectStore.isMultiSelect;

  return (
    <QuestionScaffold
      node={node}
      showOptionsState
      children={
        isMultiSelect ? (
          <MultiSelectControl node={node} ValueDisplay={ValueDisplay} />
        ) : (
          <DropdownSelectControl node={node} rowVariant={rowVariant} />
        )
      }
    />
  );
});
