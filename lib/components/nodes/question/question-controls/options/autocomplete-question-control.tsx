import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import { AnswerList } from "../../shared/answer-list.tsx";
import { OptionAutocompleteField } from "./controls/option-autocomplete-field.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { getOptionSelectionState } from "./option-control-helpers.ts";

export const AutocompleteQuestionControl = observer(
  function AutocompleteQuestionControl({ node }: { node: IQuestionNode }) {
    const mode =
      node.control === "lookup" ? "lookup" : ("autocomplete" as const);
    const isLoading = node.options.loading;

    const renderRow = (rowProps: RowRenderProps<AnswerType>) => {
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
            const nextValue = key ? node.options.getValueForKey(key) : null;
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
    };

    return (
      <QuestionScaffold
        node={node}
        showOptionsStatus
        answers={<AnswerList node={node} renderRow={renderRow} />}
      />
    );
  },
);
