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
  getAnswerErrorId,
  getNodeDescribedBy,
  getNodeLabelId,
  safeJoin,
} from "../../../../utils.ts";

export const MultiListSelectControl = observer(function MultiListSelectControl<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const { CheckboxList, CustomOptionForm } = useTheme();
  const store = node.selectStore;
  const customControlType =
    node.answerOptions.constraint === "optionsOrString" ? "string" : node.type;
  const CustomControl = getValueControl(customControlType);
  const selectedOptions = useMemo(() => {
    return store.selectedOptions.map((selection) => ({
      token: selection.token,
      label: (
        <ValueDisplay type={selection.answerType} value={selection.value} />
      ),
      ariaDescribedBy:
        selection.answer.issues.length > 0
          ? getAnswerErrorId(selection.answer)
          : undefined,
      errors: <AnswerErrors answer={selection.answer} />,
      disabled: selection.disabled,
    }));
  }, [store.selectedOptions]);

  const ariaLabelledBy = getNodeLabelId(node);
  const ariaDescribedBy = getNodeDescribedBy(node);
  const formState = store.customOptionFormState;
  const customOptionForm = formState ? (
    <CustomOptionForm
      content={
        <CustomControl
          answer={formState.answer}
          id={`${formState.answer.token}_/_custom-input`}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={safeJoin([
            ariaDescribedBy,
            formState.answer && formState.answer.issues.length > 0
              ? getAnswerErrorId(formState.answer)
              : undefined,
          ])}
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

  const customOption = store.allowCustom
    ? {
        token: store.specifyOtherToken,
        label: strings.selection.specifyOther,
        disabled: !store.canAddSelection || store.isLoading,
      }
    : undefined;
  const inputId = `af_/_${node.token}_/_multi-select`;

  const handleDeselect = (token: string) => {
    if (store.allowCustom && token === store.specifyOtherToken) {
      store.cancelCustomOptionForm();
      return;
    }
    const answer = store.answersByOptionToken.get(token);
    if (answer) {
      store.removeAnswer(answer);
    }
  };

  return (
    <CheckboxList
      options={options}
      onSelect={store.selectOption}
      onDeselect={handleDeselect}
      customOption={customOption}
      id={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={store.isLoading}
      selectedOptions={selectedOptions}
      customOptionForm={customOptionForm}
    />
  );
});
