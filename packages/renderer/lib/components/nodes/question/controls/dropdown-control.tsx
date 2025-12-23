import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import {
  MultiSelectControl,
  type CustomKind,
  type MultiSelectMode,
} from "./multi-select-control.tsx";
import { AnswerDisplay } from "../values/answer-display.tsx";

type DropdownMode = MultiSelectMode;

export const DropdownControl = observer(function DropdownControl<
  T extends AnswerType,
>({ node, mode }: { node: IQuestionNode<T>; mode: DropdownMode }) {
  const hasChildren =
    Array.isArray(node.template.item) && node.template.item.length > 0;
  const isMultiSelect = node.repeats && !hasChildren;
  const customKind = getCustomKind(node);

  if (isMultiSelect) {
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
            isLoading={node.options.loading}
          />
        ) : (
          <OpenChoiceRow
            node={node}
            rowProps={rowProps}
            mode={mode}
            isLoading={node.options.loading}
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
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  mode: DropdownMode;
  isLoading: boolean;
}) {
  const { SelectField, AutocompleteField } = useTheme();
  const { selectValue, legacyOption } = getOptionSelectionState(node, rowProps);
  const canClear = rowProps.value != null && !node.readOnly;
  const clearHandler = canClear ? () => rowProps.setValue(null) : undefined;

  if (mode === "autocomplete") {
    return (
      <AutocompleteField
        options={node.options.entries}
        selectValue={selectValue}
        legacyOptionLabel={legacyOption?.label}
        onSelect={(key) => {
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
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
        selectValue={selectValue}
        legacyOptionLabel={legacyOption?.label}
        onSelect={(key) => {
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
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
      selectValue={selectValue}
      legacyOption={legacyOption}
      onChange={(key) => {
        const nextValue = key ? node.options.getValueForKey(key) : null;
        rowProps.setValue(nextValue);
      }}
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
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  mode: DropdownMode;
  isLoading: boolean;
}) {
  const { SelectField, AutocompleteField, Button, SelectOrInputField } =
    useTheme();
  const [forceCustom, setForceCustom] = useState(false);
  const customKey = `${node.key}::__specify_other__`;
  const optionKey = node.options.getKeyForValue(rowProps.value);
  const isCustomValue = optionKey === "" && rowProps.value != null;
  const isCustomActive = isCustomValue || forceCustom;
  const canClear = rowProps.value != null && !node.readOnly;
  const clearHandler = canClear ? () => rowProps.setValue(null) : undefined;

  useEffect(() => {
    if (optionKey && forceCustom) {
      setForceCustom(false);
    }
  }, [forceCustom, optionKey]);

  const extendedOptions = [
    ...node.options.entries,
    {
      key: customKey,
      label: "Specify other",
      value: null as unknown as (typeof node.options.entries)[number]["value"],
    },
  ];

  if (isCustomActive) {
    const renderer = getAnswerInputRenderer(node);
    return (
      <SelectOrInputField
        input={renderer(rowProps)}
        inputFooter={
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              rowProps.setValue(null);
              setForceCustom(false);
            }}
            disabled={node.readOnly}
          >
            Back to options
          </Button>
        }
      />
    );
  }

  const handleSelect = (key: string) => {
    if (key === customKey) {
      setForceCustom(true);
      rowProps.setValue(null);
      return;
    }
    const nextValue = key ? node.options.getValueForKey(key) : null;
    rowProps.setValue(nextValue);
  };

  if (mode === "autocomplete") {
    return (
      <AutocompleteField
        options={extendedOptions}
        selectValue={optionKey}
        legacyOptionLabel={undefined}
        onSelect={(key) => handleSelect(key)}
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
        options={extendedOptions}
        selectValue={optionKey}
        legacyOptionLabel={undefined}
        onSelect={(key) => handleSelect(key)}
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
      options={extendedOptions}
      selectValue={optionKey}
      legacyOption={null}
      onChange={(key) => handleSelect(key)}
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

function getCustomKind(node: IQuestionNode): CustomKind {
  if (node.options.constraint === "optionsOrString") return "string";
  if (node.options.constraint === "optionsOrType") return "type";
  return "none";
}

function getOptionSelectionState(
  node: IQuestionNode,
  rowProps: RowRenderProps,
) {
  const regularKey = node.options.getKeyForValue(rowProps.value);
  const legacyOption =
    regularKey || rowProps.value == null
      ? null
      : node.options.getLegacyEntryForValue(
          rowProps.answer.key,
          rowProps.value,
        );
  const selectValue = regularKey || legacyOption?.key || "";

  return { selectValue, legacyOption };
}
