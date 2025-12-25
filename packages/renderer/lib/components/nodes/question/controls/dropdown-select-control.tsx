import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import type { AnswerRenderCallbackProps } from "../answers/answer-scaffold.tsx";
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
      render={(props) =>
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
  rowProps: AnswerRenderCallbackProps<T>;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectField } = useTheme();
  const clearHandler = rowStore.canClear ? rowStore.clearValue : undefined;

  return (
    <SelectField
      options={node.options.entries}
      selectValue={rowStore.selectValue}
      legacyOption={rowStore.legacyOption}
      onChange={rowStore.handleSelect}
      inputId={rowProps.inputId}
      labelId={rowProps.labelId}
      describedById={rowProps.describedById}
      readOnly={node.readOnly}
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
  rowProps: AnswerRenderCallbackProps<T>;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectField, Button } = useTheme();

  if (rowStore.isCustomActive) {
    const Control = getValueControl(node.type);
    return (
      <>
        <Control
          node={node}
          answer={rowProps.answer}
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={rowStore.exitCustom}
          disabled={node.readOnly}
        >
          Back to options
        </Button>
      </>
    );
  }

  const clearHandler = rowStore.canClear ? rowStore.clearValue : undefined;

  return (
    <SelectField
      options={rowStore.extendedOptions}
      selectValue={rowStore.optionKey}
      legacyOption={null}
      onChange={rowStore.handleSelect}
      inputId={rowProps.inputId}
      labelId={rowProps.labelId}
      describedById={rowProps.describedById}
      readOnly={node.readOnly}
      isLoading={isLoading}
      onClear={clearHandler}
      clearLabel="Clear"
    />
  );
});
