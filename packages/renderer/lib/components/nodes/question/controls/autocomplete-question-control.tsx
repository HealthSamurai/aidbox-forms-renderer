import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answer-list.tsx";
import { OptionAutocompleteField } from "../components/option-autocomplete-field.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";

import { getOptionSelectionState } from "../shared.tsx";

export const AutocompleteQuestionControl = observer(
  function AutocompleteQuestionControl({ node }: { node: IQuestionNode }) {
    const mode =
      node.control === "lookup" ? "lookup" : ("autocomplete" as const);
    const isLoading = node.options.loading;

    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={
          <AnswerList
            node={node}
            renderRow={(rowProps) => {
              const { selectValue, legacyOption } = getOptionSelectionState(
                node,
                rowProps,
              );
              return (
                <OptionAutocompleteField
                  options={node.options.entries}
                  selectValue={selectValue}
                  legacyOptionLabel={legacyOption?.label}
                  onSelect={(key) => {
                    const nextValue = key
                      ? node.options.getValueForKey(key)
                      : null;
                    rowProps.setValue(nextValue);
                  }}
                  inputId={rowProps.inputId}
                  labelId={rowProps.labelId}
                  describedById={rowProps.describedById}
                  readOnly={node.readOnly}
                  mode={mode}
                  isLoading={isLoading}
                />
              );
            }}
          />
        }
      />
    );
  },
);
