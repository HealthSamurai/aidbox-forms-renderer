import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import {
  AnswerType,
  IQuestionNode,
  OptionItem,
  ValueControlProps,
} from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { AnswerScaffold } from "../answers/answer-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeDescribedBy, getNodeLabelId } from "../../../../utils.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";

export type ListSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
};

export const ListSelectControl = observer(function ListSelectControl<
  T extends AnswerType,
>({ node }: ListSelectControlProps<T>) {
  const {
    AnswerAddButton,
    CheckboxList,
    AnswerList: ThemedAnswerList,
  } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);
  const addCustomAnswer = useCallback(() => {
    node.addAnswer();
  }, [node]);

  if (store.useCheckboxes) {
    const state = store.checkboxState;
    const uiOptions: OptionItem[] = state.options.flatMap((option) => {
      if (option.value == null) {
        return [];
      }
      const isSelected = state.selectedTokens.has(option.token);
      return [
        {
          token: option.token,
          label: <ValueDisplay type={node.type} value={option.value} />,
          disabled:
            option.disabled ||
            (!isSelected && !state.canAddSelection) ||
            (isSelected && !node.canRemove),
        },
      ];
    });
    if (store.allowCustom) {
      uiOptions.push({
        token: state.specifyOtherToken,
        label: strings.selection.specifyOther,
        disabled:
          (!state.isCustomActive && !state.canAddSelection) ||
          (state.isCustomActive && !node.canRemove),
      });
    }
    const customControl =
      store.allowCustom && state.isCustomActive ? (
        <ThemedAnswerList
          toolbar={
            node.repeats ? (
              <AnswerAddButton
                onClick={addCustomAnswer}
                disabled={!node.canAdd}
              >
                {strings.selection.addAnother}
              </AnswerAddButton>
            ) : undefined
          }
        >
          {state.nonOptionAnswers.map((answer) => (
            <AnswerScaffold
              key={answer.token}
              answer={answer}
              control={Control}
            />
          ))}
        </ThemedAnswerList>
      ) : null;

    return (
      <CheckboxList
        options={uiOptions}
        tokens={state.selectedTokens}
        onChange={store.handleCheckboxToggle}
        id={node.token}
        ariaLabelledBy={getNodeLabelId(node)}
        ariaDescribedBy={getNodeDescribedBy(node)}
        disabled={node.readOnly}
        isLoading={store.isLoading}
        renderErrors={(token) => {
          const answer = state.answerByToken.get(token);
          return answer ? <AnswerErrors answer={answer} /> : null;
        }}
        after={customControl}
      />
    );
  }

  return (
    <AnswerList
      node={node}
      control={(props) => <OptionRadioRow node={node} rowProps={props} />}
    />
  );
});

const OptionRadioRow = observer(function OptionRadioRow<T extends AnswerType>({
  node,
  rowProps,
}: {
  node: IQuestionNode<T>;
  rowProps: ValueControlProps<T>;
}) {
  const { RadioButtonList } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);
  const answer = rowProps.answer;
  const [isCustomForced, setIsCustomForced] = useState(false);
  const selectToken = store.resolveTokenForValue(answer.value);
  const isBooleanFallback =
    node.type === "boolean" && node.options.resolvedOptions.length === 0;
  const legacyOption =
    store.allowCustom ||
    isBooleanFallback ||
    selectToken ||
    answer.value == null
      ? null
      : {
          token: `${answer.token}::__legacy__`,
          label: <ValueDisplay type={node.type} value={answer.value} />,
        };
  const isCustomValue =
    store.allowCustom && selectToken === "" && answer.value != null;
  const isCustomActive =
    store.allowCustom && !selectToken && (isCustomValue || isCustomForced);
  const selectValue = isCustomActive
    ? store.specifyOtherToken
    : selectToken || legacyOption?.token || "";
  const radioOptions: OptionItem[] = store.resolvedOptions.flatMap((option) => {
    if (option.value == null) {
      return [];
    }
    return [
      {
        token: option.token,
        label: <ValueDisplay type={node.type} value={option.value} />,
        disabled: option.disabled,
      },
    ];
  });
  if (store.allowCustom) {
    radioOptions.push({
      token: store.specifyOtherToken,
      label: strings.selection.specifyOther,
      disabled: !store.canAddSelection,
    });
  }

  const handleChange = (token: string) => {
    if (store.allowCustom && token === store.specifyOtherToken) {
      setIsCustomForced(true);
      if (!isCustomValue) {
        answer.setValueByUser(null);
      }
      return;
    }

    setIsCustomForced(false);
    const nextValue = store.resolveValueForToken(token);
    answer.setValueByUser(nextValue);
  };

  const customInput = isCustomActive ? (
    <Control
      answer={answer}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
    />
  ) : null;

  return (
    <RadioButtonList
      options={radioOptions}
      token={selectValue}
      legacyOption={legacyOption}
      onChange={handleChange}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={store.isLoading}
      after={customInput}
      afterInset={Boolean(customInput)}
    />
  );
});
