import { observer } from "mobx-react-lite";
import { AnswerType, IQuestionNode, OptionItem } from "../../../../types.ts";
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
  const customDisplayType =
    node.options.constraint === "optionsOrString" ? "string" : node.type;

  const state = store.checkboxState;
  const legacyAnswers = store.allowCustom
    ? []
    : state.nonOptionAnswers.filter((answer) => answer.value != null);
  const legacyAnswerByToken = new Map(
    legacyAnswers.map((answer) => [`${answer.token}_/_legacy`, answer]),
  );
  const customAnswers = store.allowCustom ? store.customAnswers : [];
  const customAnswerByToken = new Map(
    customAnswers.map((answer) => [answer.token, answer]),
  );
  const checkboxOptions: OptionItem[] = state.options.map((option) => ({
    token: option.token,
    label: <ValueDisplay type={node.type} value={option.value} />,
    disabled: option.disabled,
  }));
  if (legacyAnswers.length > 0) {
    legacyAnswers.forEach((answer) => {
      if (answer.value !== null) {
        checkboxOptions.push({
          token: `${answer.token}_/_legacy`,
          label: <ValueDisplay type={node.type} value={answer.value} />,
          disabled: true,
        });
      }
    });
  }
  if (customAnswers.length > 0) {
    customAnswers.forEach((answer) => {
      if (answer.value !== null) {
        checkboxOptions.push({
          token: answer.token,
          label: <ValueDisplay type={customDisplayType} value={answer.value} />,
          disabled: !store.canRemoveSelection,
        });
      }
    });
  }
  if (store.allowCustom) {
    const hasCustomInput = Boolean(store.customInputState);
    checkboxOptions.push({
      token: state.specifyOtherToken,
      label: strings.selection.specifyOther,
      disabled: store.isLoading || (!hasCustomInput && !state.canAddSelection),
    });
  }
  const customInput = store.customInputState ? (
    <CustomOptionForm
      content={
        <CustomControl
          {...store.buildRowProps(
            store.customInputState.answer,
            "custom-input",
          )}
        />
      }
      errors={<AnswerErrors answer={store.customInputState.answer} />}
      cancel={{
        label: strings.dialog.cancel,
        onClick: store.cancelCustomInput,
        disabled: false,
      }}
      submit={{
        label: strings.dialog.add,
        onClick: store.submitCustomInput,
        disabled: !store.customInputState.canSubmit,
      }}
    />
  ) : null;

  const selectedTokens = new Set(state.selectedTokens);
  selectedTokens.delete(state.specifyOtherToken);
  legacyAnswerByToken.forEach((_answer, token) => {
    selectedTokens.add(token);
  });
  customAnswerByToken.forEach((_answer, token) => {
    selectedTokens.add(token);
  });
  if (store.customInputState) {
    selectedTokens.add(state.specifyOtherToken);
  }
  const answerByToken = new Map(state.answerByToken);
  customAnswerByToken.forEach((answer, token) => {
    answerByToken.set(token, answer);
  });
  legacyAnswerByToken.forEach((answer, token) => {
    answerByToken.set(token, answer);
  });

  const handleToggle = (token: string) => {
    if (store.allowCustom && token === state.specifyOtherToken) {
      if (store.customInputState) {
        store.cancelCustomInput();
      } else {
        store.openCustomInput();
      }
      return;
    }

    const customAnswer = customAnswerByToken.get(token);
    if (customAnswer) {
      store.handleRemoveAnswer(customAnswer);
      return;
    }

    store.handleCheckboxToggle(token);
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
        const answer = answerByToken.get(token);
        return answer ? <AnswerErrors answer={answer} /> : null;
      }}
      after={customInput}
    />
  );
});
