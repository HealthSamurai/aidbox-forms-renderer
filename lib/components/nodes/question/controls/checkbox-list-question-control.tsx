import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { OptionCheckboxGroup } from "../components/option-checkbox-group.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";

export const CheckboxListQuestionControl = observer(
  function CheckboxListQuestionControl({ node }: { node: IQuestionNode }) {
    const isLoading = node.options.loading;

    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={
          <OptionCheckboxGroup
            node={node}
            options={node.options.entries}
            isLoading={isLoading}
          />
        }
      />
    );
  },
);
