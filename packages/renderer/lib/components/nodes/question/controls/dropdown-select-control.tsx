import { observer } from "mobx-react-lite";
import {
  AnswerType,
  IQuestionNode,
  ValueControlProps,
} from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getValueControl } from "../fhir/index.ts";

export type DropdownSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
};

export const DropdownSelectControl = observer(function DropdownSelectControl<
  T extends AnswerType,
>({ node }: DropdownSelectControlProps<T>) {
  const store = node.selectStore;

  return (
    <AnswerList
      node={node}
      control={(props) =>
        node.options.constraint === "optionsOrString" ||
        node.options.constraint === "optionsOrType" ? (
          <OpenChoiceRow
            node={node}
            rowProps={props}
            rowStore={store.getDropdownRowState(props.answer)}
            isLoading={store.isLoading}
          />
        ) : (
          <OptionsRow
            node={node}
            rowProps={props}
            rowStore={store.getDropdownRowState(props.answer)}
            isLoading={store.isLoading}
          />
        )
      }
    />
  );
});

const OptionsRow = observer(function OptionsRow<T extends AnswerType>({
  node,
  rowProps,
  rowStore,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: ValueControlProps<T>;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectInput } = useTheme();
  const options = node.options.entries.map((option) => ({
    token: option.token,
    label: option.label,
    disabled: option.disabled,
  }));
  const clearHandler = rowStore.canClear ? rowStore.clearValue : undefined;

  return (
    <SelectInput
      options={options}
      token={rowStore.selectValue}
      legacyOption={rowStore.legacyOption}
      onChange={rowStore.handleSelect}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={isLoading}
      onClear={clearHandler}
      clearLabel="Clear"
    />
  );
});

const OpenChoiceRow = observer(function OpenChoiceRow<T extends AnswerType>({
  node,
  rowProps,
  rowStore,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: ValueControlProps<T>;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectInput, OpenChoiceBackButton } = useTheme();

  if (rowStore.isCustomActive) {
    const Control = getValueControl(node.type);
    return (
      <>
        <Control
          answer={rowProps.answer}
          id={rowProps.id}
          ariaLabelledBy={rowProps.ariaLabelledBy}
          ariaDescribedBy={rowProps.ariaDescribedBy}
        />
        <OpenChoiceBackButton
          onClick={rowStore.exitCustom}
          disabled={node.readOnly}
        >
          Back to options
        </OpenChoiceBackButton>
      </>
    );
  }

  const clearHandler = rowStore.canClear ? rowStore.clearValue : undefined;
  const options = rowStore.extendedOptions.map((option) => ({
    token: option.token,
    label: option.label,
    disabled: option.disabled,
  }));

  return (
    <SelectInput
      options={options}
      token={rowStore.optionKey}
      legacyOption={null}
      onChange={rowStore.handleSelect}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={isLoading}
      onClear={clearHandler}
      clearLabel="Clear"
    />
  );
});
