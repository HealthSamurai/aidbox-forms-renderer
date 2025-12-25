import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import {
  AnswerType,
  IQuestionNode,
  ValueControlProps,
} from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { AnswerScaffold } from "../answers/answer-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeDescribedBy, getNodeLabelId } from "../../../../utils.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";

export type ListSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
};

export const ListSelectControl = observer(function ListSelectControl<
  T extends AnswerType,
>({ node }: ListSelectControlProps<T>) {
  const { CheckboxList, AnswerList: ThemedAnswerList, Button } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);
  const addCustomAnswer = useCallback(() => {
    node.addAnswer();
  }, [node]);

  if (store.useCheckboxes) {
    const state = store.checkboxState;
    const customControl =
      store.allowCustom && state.isCustomActive ? (
        <ThemedAnswerList
          answers={state.nonOptionAnswers.map((answer) => (
            <AnswerScaffold
              key={answer.key}
              answer={answer}
              control={Control}
            />
          ))}
          toolbar={
            node.repeats ? (
              <Button
                type="button"
                variant="success"
                onClick={addCustomAnswer}
                disabled={!node.canAdd}
              >
                Add another
              </Button>
            ) : undefined
          }
        />
      ) : null;

    return (
      <CheckboxList
        options={state.uiOptions}
        value={state.selectedKeys}
        onChange={store.handleCheckboxToggle}
        inputName={node.key}
        ariaLabelledBy={getNodeLabelId(node)}
        ariaDescribedBy={getNodeDescribedBy(node)}
        readOnly={node.readOnly}
        isLoading={store.isLoading}
        renderErrors={(key) => {
          const answer = state.answerByKey.get(key);
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
  const rowStore = store.getListRowState(rowProps.answer);
  const customInput = rowStore.isCustomActive ? (
    <Control
      answer={rowProps.answer}
      inputId={rowProps.inputId}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
    />
  ) : null;

  return (
    <RadioButtonList
      options={rowStore.radioOptions}
      value={rowStore.selectValue}
      legacyOptionLabel={rowStore.legacyOption?.label}
      legacyOptionKey={rowStore.legacyOption?.key}
      onChange={rowStore.handleChange}
      inputId={rowProps.inputId}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
      readOnly={node.readOnly}
      isLoading={store.isLoading}
      after={customInput}
      afterInset={Boolean(customInput)}
    />
  );
});
