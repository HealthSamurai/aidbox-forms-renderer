import { observer } from "mobx-react-lite";
import type {
  AnswerType,
  IQuestionNode,
  OptionItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeDescribedBy, getNodeLabelId } from "../../../../utils.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";

export type MultiListSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
};

export const MultiListSelectControl = observer(function MultiListSelectControl<
  T extends AnswerType,
>({ node }: MultiListSelectControlProps<T>) {
  const { CheckboxList, CustomOptionForm } = useTheme();
  const store = node.selectStore;
  const customControlType =
    node.options.constraint === "optionsOrString" ? "string" : node.type;
  const CustomControl = getValueControl(customControlType);
  const selectedTokens = new Set(store.selectedTokens);
  if (store.allowCustom && store.customOptionFormState) {
    selectedTokens.add(store.specifyOtherToken);
  }

  const checkboxOptions: OptionItem[] = store.options.map((entry) => ({
    token: entry.token,
    disabled: entry.disabled,
    label: <ValueDisplay type={entry.answerType} value={entry.value} />,
  }));
  if (store.allowCustom) {
    const hasCustomOptionForm = Boolean(store.customOptionFormState);
    checkboxOptions.push({
      token: store.specifyOtherToken,
      label: strings.selection.specifyOther,
      disabled:
        store.isLoading || (!hasCustomOptionForm && !store.canAddSelection),
    });
  }
  const customOptionForm = store.customOptionFormState ? (
    <CustomOptionForm
      content={
        <CustomControl
          {...store.buildRowProps(
            store.customOptionFormState.answer,
            "custom-input",
          )}
        />
      }
      errors={<AnswerErrors answer={store.customOptionFormState.answer} />}
      cancel={{
        label: strings.dialog.cancel,
        onClick: store.cancelCustomOptionForm,
        disabled: false,
      }}
      submit={{
        label: strings.dialog.add,
        onClick: store.submitCustomOptionForm,
        disabled: !store.customOptionFormState.canSubmit,
      }}
    />
  ) : null;

  const handleToggle = (token: string) => {
    if (store.allowCustom && token === store.specifyOtherToken) {
      if (store.customOptionFormState) {
        store.cancelCustomOptionForm();
      } else {
        store.openCustomOptionForm();
      }
      return;
    }

    const selectedAnswer = store.answerByToken.get(token);
    if (selectedAnswer) {
      store.removeAnswer(selectedAnswer);
      return;
    }
    store.selectOption(token);
  };

  return (
    <CheckboxList
      options={checkboxOptions}
      tokens={selectedTokens}
      onChange={handleToggle}
      id={node.token}
      ariaLabelledBy={getNodeLabelId(node)}
      ariaDescribedBy={getNodeDescribedBy(node)}
      disabled={node.readOnly}
      isLoading={store.isLoading}
      renderErrors={(token) => {
        const answer = store.answerByToken.get(token);
        return answer ? <AnswerErrors answer={answer} /> : null;
      }}
      after={customOptionForm}
    />
  );
});
