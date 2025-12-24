import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { ListSelectControl } from "../controls/list-select-control.tsx";
import { getSelectCustomKind } from "./dropdown-renderer.tsx";
import { VALUE_DISPLAY_BY_TYPE } from "../fhir/index.ts";

export const ListSelectRenderer = observer(function ListSelectRenderer<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const customKind = getSelectCustomKind(node.options.constraint);
  const ValueDisplay = VALUE_DISPLAY_BY_TYPE[node.type];

  return (
    <QuestionScaffold
      node={node}
      showOptionsState
      children={
        <ListSelectControl
          node={node}
          customKind={customKind}
          ValueDisplay={ValueDisplay}
        />
      }
    />
  );
});
