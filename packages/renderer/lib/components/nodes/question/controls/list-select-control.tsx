import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import {
  AnswerRenderer,
  type AnswerRenderCallbackProps,
} from "../answers/answer-renderer.tsx";
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
  const { CheckboxGroup, AnswerList: ThemedAnswerList, Button } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);
  const renderCustomInput = useCallback(
    ({
      answer,
      describedById,
      inputId,
      labelId,
    }: AnswerRenderCallbackProps<T>) => (
      <Control
        node={node}
        answer={answer}
        inputId={inputId}
        labelId={labelId}
        describedById={describedById}
      />
    ),
    [Control, node],
  );
  const addCustomAnswer = useCallback(() => {
    node.addAnswer();
  }, [node]);

  if (store.useCheckboxes) {
    const state = store.checkboxState;
    const customControl =
      store.allowCustom && state.isCustomActive ? (
        <ThemedAnswerList
          answers={state.nonOptionAnswers.map((answer) => (
            <AnswerRenderer
              key={answer.key}
              answer={answer}
              render={renderCustomInput}
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
      <CheckboxGroup
        options={state.uiOptions}
        selectedKeys={state.selectedKeys}
        onToggle={store.handleCheckboxToggle}
        inputName={node.key}
        labelId={getNodeLabelId(node)}
        describedById={getNodeDescribedBy(node)}
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
      render={(props) => <OptionRadioRow node={node} rowProps={props} />}
    />
  );
});

const OptionRadioRow = observer(function OptionRadioRow<T extends AnswerType>({
  node,
  rowProps,
}: {
  node: IQuestionNode<T>;
  rowProps: AnswerRenderCallbackProps<T>;
}) {
  const { RadioGroup } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);
  const rowStore = store.getListRowState(rowProps.answer);
  const customInput = rowStore.isCustomActive ? (
    <Control
      node={node}
      answer={rowProps.answer}
      inputId={rowProps.inputId}
      labelId={rowProps.labelId}
      describedById={rowProps.describedById}
    />
  ) : null;

  return (
    <RadioGroup
      options={rowStore.radioOptions}
      selectValue={rowStore.selectValue}
      legacyOptionLabel={rowStore.legacyOption?.label}
      legacyOptionKey={rowStore.legacyOption?.key}
      onChange={rowStore.handleChange}
      inputId={rowProps.inputId}
      labelId={rowProps.labelId}
      describedById={rowProps.describedById}
      readOnly={node.readOnly}
      isLoading={store.isLoading}
      after={customInput}
      afterInset={Boolean(customInput)}
    />
  );
});
