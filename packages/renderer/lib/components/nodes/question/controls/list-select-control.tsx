import { observer } from "mobx-react-lite";
import type {
  AnswerType,
  IQuestionNode,
  ValueDisplayComponent,
} from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeDescribedBy, getNodeLabelId } from "../../../../utils.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import { MultiSelectControl } from "./multi-select-control.tsx";
import type { CustomKind } from "../../../../stores/nodes/questions/select-control-types.ts";

export type ListSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  customKind: CustomKind;
  ValueDisplay: ValueDisplayComponent<T>;
};

export const ListSelectControl = observer(function ListSelectControl<
  T extends AnswerType,
>({ node, customKind, ValueDisplay }: ListSelectControlProps<T>) {
  const { CheckboxGroup } = useTheme();
  const store = node.selectStore;

  if (store.useCheckboxes) {
    const state = store.checkboxState;
    const customControl =
      store.allowCustom && state.isCustomActive ? (
        <MultiSelectControl
          node={node}
          options={state.options}
          displayOptions={[]}
          mode="select"
          customKind={customKind}
          ValueDisplay={ValueDisplay}
          showOptions
          showSelectedOptions={false}
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
      renderRow={(rowProps) => (
        <OptionRadioRow node={node} rowProps={rowProps} />
      )}
    />
  );
});

const OptionRadioRow = observer(function OptionRadioRow<T extends AnswerType>({
  node,
  rowProps,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
}) {
  const { RadioGroup } = useTheme();
  const store = node.selectStore;
  const rowStore = store.getListRowState(rowProps.answer);
  const customInput = rowStore.isCustomActive
    ? getAnswerInputRenderer(node)(rowProps)
    : null;

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
