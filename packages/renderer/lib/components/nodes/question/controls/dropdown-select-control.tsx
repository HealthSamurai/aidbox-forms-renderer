import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
type RowVariant = "options" | "open-choice";

export type DropdownSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  rowVariant: RowVariant;
};

export const DropdownSelectControl = observer(function DropdownSelectControl<
  T extends AnswerType,
>({ node, rowVariant }: DropdownSelectControlProps<T>) {
  const store = node.selectStore;

  return (
    <AnswerList
      node={node}
      renderRow={(rowProps) =>
        rowVariant === "options" ? (
          <OptionsRow
            node={node}
            rowProps={rowProps}
            rowStore={store.getDropdownRowState(rowProps.answer)}
            isLoading={store.isLoading}
          />
        ) : (
          <OpenChoiceRow
            node={node}
            rowProps={rowProps}
            rowStore={store.getDropdownRowState(rowProps.answer)}
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
  rowProps: RowRenderProps<T>;
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
  rowProps: RowRenderProps<T>;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectField, Button, SelectOrInputField } = useTheme();

  if (rowStore.isCustomActive) {
    const renderer = getAnswerInputRenderer(node);
    return (
      <SelectOrInputField
        input={renderer(rowProps)}
        inputFooter={
          <Button
            type="button"
            variant="secondary"
            onClick={rowStore.exitCustom}
            disabled={node.readOnly}
          >
            Back to options
          </Button>
        }
      />
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
