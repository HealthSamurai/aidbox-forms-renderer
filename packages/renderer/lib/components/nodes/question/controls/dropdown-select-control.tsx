import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import { MultiSelectControl } from "./multi-select-control.tsx";
import { AnswerDisplay } from "../values/answer-display.tsx";
import type { MultiSelectMode } from "../../../../stores/nodes/questions/select-control-types.ts";

type DropdownMode = MultiSelectMode;

export const DropdownSelectControl = observer(function DropdownSelectControl<
  T extends AnswerType,
>({ node, mode }: { node: IQuestionNode<T>; mode: DropdownMode }) {
  const store = node.selectStore;

  const customKind =
    node.options.constraint === "optionsOrString"
      ? "string"
      : node.options.constraint === "optionsOrType"
        ? "type"
        : "none";

  if (store.isMultiSelect) {
    return (
      <MultiSelectControl
        node={node}
        options={node.options.entries}
        mode={mode}
        customKind={customKind}
      />
    );
  }

  return (
    <AnswerList
      node={node}
      renderRow={(rowProps) =>
        customKind === "none" ? (
          <OptionsRow
            node={node}
            rowProps={rowProps}
            mode={mode}
            rowStore={store.getDropdownRowState(rowProps.answer)}
            isLoading={store.isLoading}
          />
        ) : (
          <OpenChoiceRow
            node={node}
            rowProps={rowProps}
            mode={mode}
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
  mode,
  rowStore,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  mode: DropdownMode;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectField, AutocompleteField } = useTheme();
  const clearHandler = rowStore.canClear ? rowStore.clearValue : undefined;

  if (mode === "autocomplete") {
    return (
      <AutocompleteField
        options={node.options.entries}
        selectValue={rowStore.selectValue}
        legacyOptionLabel={rowStore.legacyOption?.label}
        onSelect={rowStore.handleSelect}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        mode="autocomplete"
        isLoading={isLoading}
        onClear={clearHandler}
        clearLabel="Clear"
      />
    );
  }

  if (mode === "lookup") {
    return (
      <AutocompleteField
        options={node.options.entries}
        selectValue={rowStore.selectValue}
        legacyOptionLabel={rowStore.legacyOption?.label}
        onSelect={rowStore.handleSelect}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        mode="lookup"
        isLoading={isLoading}
        onClear={clearHandler}
        clearLabel="Clear"
        valueDisplay={
          <AnswerDisplay
            type={node.type}
            value={rowProps.value}
            placeholder="Select an option"
          />
        }
      />
    );
  }

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
  mode,
  rowStore,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  mode: DropdownMode;
  rowStore: ReturnType<IQuestionNode<T>["selectStore"]["getDropdownRowState"]>;
  isLoading: boolean;
}) {
  const { SelectField, AutocompleteField, Button, SelectOrInputField } =
    useTheme();

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

  if (mode === "autocomplete") {
    return (
      <AutocompleteField
        options={rowStore.extendedOptions}
        selectValue={rowStore.optionKey}
        legacyOptionLabel={undefined}
        onSelect={rowStore.handleSelect}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        mode="autocomplete"
        isLoading={isLoading}
        onClear={clearHandler}
        clearLabel="Clear"
      />
    );
  }

  if (mode === "lookup") {
    return (
      <AutocompleteField
        options={rowStore.extendedOptions}
        selectValue={rowStore.optionKey}
        legacyOptionLabel={undefined}
        onSelect={rowStore.handleSelect}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        mode="lookup"
        isLoading={isLoading}
        onClear={clearHandler}
        clearLabel="Clear"
        valueDisplay={
          <AnswerDisplay
            type={node.type}
            value={rowProps.value}
            placeholder="Select an option"
          />
        }
      />
    );
  }

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
