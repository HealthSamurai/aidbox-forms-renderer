import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type {
  AnswerType,
  IQuestionNode,
  OptionItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";
import {
  buildId,
  concatIds,
  getAnswerErrorId,
  getNodeErrorId,
  getNodeHelpId,
  getNodeLabelId,
} from "../../../../utilities.ts";

export const MultiDropdownSelectControl = observer(
  function MultiDropdownSelectControl<T extends AnswerType>({
    node,
  }: {
    node: IQuestionNode<T>;
  }) {
    const { MultiSelectInput, CustomOptionForm } = useTheme();
    const store = node.answerOption.select;
    const CustomControl = getValueControl(store.customType);

    const selectedOptions = useMemo(() => {
      return store.selectedOptions.map((selection) => ({
        token: selection.token,
        label: (
          <ValueDisplay type={selection.answerType} value={selection.value} />
        ),
        ariaDescribedBy: getAnswerErrorId(selection.answer),
        errors: <AnswerErrors answer={selection.answer} />,
        disabled: selection.disabled,
      }));
    }, [store.selectedOptions]);

    const formState = store.customOptionFormState;

    const customOptionForm = formState ? (
      <CustomOptionForm
        content={
          <CustomControl
            answer={formState.answer}
            id={buildId(formState.answer.token, "custom-input")}
            ariaLabelledBy={getNodeLabelId(node)}
            ariaDescribedBy={getAnswerErrorId(formState.answer)}
          />
        }
        errors={<AnswerErrors answer={formState.answer} />}
        cancel={{
          label: strings.dialog.cancel,
          onClick: store.cancelCustomOptionForm,
        }}
        submit={{
          label: strings.dialog.add,
          onClick: store.submitCustomOptionForm,
          disabled: !formState.canSubmit,
        }}
      />
    ) : undefined;

    const options = useMemo<OptionItem[]>(() => {
      return store.filteredOptions.map((entry) => ({
        token: entry.token,
        disabled: entry.disabled,
        label: <ValueDisplay type={entry.answerType} value={entry.value} />,
      }));
    }, [store.filteredOptions]);

    const specifyOtherOption = store.allowCustom
      ? {
          token: store.specifyOtherToken,
          label: strings.selection.specifyOther,
          disabled: !store.canAddSelection || store.isLoading,
        }
      : undefined;

    return (
      <MultiSelectInput
        options={options}
        onSelect={store.selectOption}
        onDeselect={store.deselectOption}
        onSearch={store.setSearchQuery}
        specifyOtherOption={specifyOtherOption}
        id={buildId(node.token, "multi-select")}
        ariaLabelledBy={getNodeLabelId(node)}
        ariaDescribedBy={concatIds(getNodeHelpId(node), getNodeErrorId(node))}
        disabled={node.readOnly}
        isLoading={store.isLoading}
        selectedOptions={selectedOptions}
        customOptionForm={customOptionForm}
        placeholder={strings.selection.selectPlaceholder}
      />
    );
  },
);
