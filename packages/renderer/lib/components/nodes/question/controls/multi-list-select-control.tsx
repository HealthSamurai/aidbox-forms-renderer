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
  concatIds,
  getAnswerErrorId,
  getNodeErrorId,
  getNodeHelpId,
  getNodeLabelId,
  buildId,
} from "../../../../utilities.ts";

export const MultiListSelectControl = observer(function MultiListSelectControl<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const { CheckboxList, CustomOptionForm } = useTheme();
  const store = node.answerOption;
  const customControlType =
    node.answerOption.constraint === "optionsOrString" ? "string" : node.type;
  const CustomControl = getValueControl(customControlType);
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

  const ariaLabelledBy = getNodeLabelId(node);
  const ariaDescribedBy = concatIds(getNodeHelpId(node), getNodeErrorId(node));
  const formState = store.customOptionFormState;
  const customAriaDescribedBy = formState?.answer
    ? getAnswerErrorId(formState.answer)
    : undefined;
  const customOptionForm = formState ? (
    <CustomOptionForm
      content={
        <CustomControl
          answer={formState.answer}
          id={buildId(formState.answer.token, "custom-input")}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={customAriaDescribedBy}
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
    <CheckboxList
      options={options}
      onSelect={store.selectOption}
      onDeselect={store.deselectOption}
      specifyOtherOption={specifyOtherOption}
      id={buildId(node.token, "multi-select")}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={store.isLoading}
      selectedOptions={selectedOptions}
      customOptionForm={customOptionForm}
    />
  );
});
