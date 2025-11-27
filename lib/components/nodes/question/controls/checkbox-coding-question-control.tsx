import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { CodingCheckboxGroup } from "../components/coding-checkbox-group.tsx";

export const CheckboxCodingQuestionControl = observer(
  function CheckboxCodingQuestionControl({
    node,
  }: {
    node: IQuestionNode<"coding">;
  }) {
    const isLoading = node.options.loading;
    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={
          <CodingCheckboxGroup
            node={node}
            options={node.options.entries}
            isLoading={isLoading}
          />
        }
      />
    );
  },
);
