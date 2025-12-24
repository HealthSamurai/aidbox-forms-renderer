import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import type {
  AnswerOptionEntry,
  AnswerType,
  IAnswerInstance,
  IQuestionNode,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { AnswerDisplay } from "../values/answer-display.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import { StringInput } from "../fhir/string/StringInput.tsx";
import { TextInput } from "../fhir/text/TextInput.tsx";
import type {
  CustomKind,
  MultiSelectMode,
} from "../../../../stores/nodes/questions/select-control-types.ts";

export type MultiSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  displayOptions?: ReadonlyArray<AnswerOptionEntry<T>>;
  mode: MultiSelectMode;
  customKind: CustomKind;
  showOptions?: boolean;
  showSelectedOptions?: boolean;
};

export const MultiSelectControl = observer(function MultiSelectControl<
  T extends AnswerType,
>({
  node,
  options,
  displayOptions,
  mode,
  customKind,
  showOptions = true,
  showSelectedOptions = true,
}: MultiSelectControlProps<T>) {
  const { Button, MultiSelectField } = useTheme();
  const store = node.selectStore;

  const config = useMemo(
    () => ({
      options,
      displayOptions,
      mode,
      customKind,
      showOptions,
      showSelectedOptions,
    }),
    [
      options,
      displayOptions,
      mode,
      customKind,
      showOptions,
      showSelectedOptions,
    ],
  );

  useEffect(() => {
    store.setMultiConfig(config);
  }, [store, config]);

  const selectedChips = store.selectedChipItems.map((item) => ({
    key: item.key,
    content: (
      <AnswerDisplay
        type={node.type}
        value={item.answer.value}
        placeholder="Selection"
      />
    ),
    errors: <AnswerErrors answer={item.answer} />,
    onRemove: () => store.handleRemoveAnswer(item.answer),
    removeDisabled: !store.canRemoveSelection,
    removeLabel: "Remove selection",
  }));

  const customChips = store.customChipItems.map((item) => ({
    key: item.key,
    content: item.inlineString ? (
      renderInlineCustomInput(node, item.answer)
    ) : (
      <AnswerDisplay
        type={node.type}
        value={item.answer.value}
        placeholder="Custom value"
      />
    ),
    errors: <AnswerErrors answer={item.answer} />,
    onRemove: () => store.handleRemoveAnswer(item.answer),
    removeDisabled: !store.canRemoveSelection,
    removeLabel: "Remove custom value",
  }));

  const chips = [...selectedChips, ...customChips];

  const customAction =
    store.hasCustomAction && !showOptions ? (
      <Button
        type="button"
        variant="secondary"
        onClick={() => store.handleSelectChange(store.specifyOtherKey)}
        disabled={!store.canAddSelection || store.isLoading}
      >
        Specify other
      </Button>
    ) : null;

  const clearAction = store.hasSelections ? (
    <Button
      type="button"
      variant="secondary"
      onClick={store.handleClearAll}
      disabled={!store.canRemoveSelection}
    >
      Clear all
    </Button>
  ) : null;

  const actions =
    customAction || clearAction ? (
      <>
        {customAction}
        {clearAction}
      </>
    ) : undefined;

  const dialogState = store.dialogState;
  const dialog =
    dialogState && customKind === "type"
      ? (() => {
          const renderer = getAnswerInputRenderer(node);
          const rowProps = store.buildRowProps(dialogState.answer, "custom");

          return {
            open: true,
            title: "Specify other",
            content: (
              <>
                {renderer(rowProps)}
                <AnswerErrors answer={dialogState.answer} />
              </>
            ),
            actions: (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={store.cancelCustomDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="success"
                  onClick={store.confirmCustomDialog}
                  disabled={!dialogState.canConfirm}
                >
                  Add
                </Button>
              </>
            ),
          };
        })()
      : undefined;

  return (
    <MultiSelectField
      mode={mode}
      options={store.extendedOptions}
      selectValue={store.selectValue}
      onSelectOption={store.handleSelectOption}
      searchValue={store.query}
      onSearchValueChange={store.setQuery}
      labelId={store.labelId}
      describedById={store.describedById}
      readOnly={node.readOnly}
      isLoading={store.isLoading}
      showOptions={showOptions}
      chips={chips}
      actions={actions}
      {...(dialog ? { dialog } : {})}
      selectPlaceholder="Select an option"
    />
  );
});

function renderInlineCustomInput<T extends AnswerType>(
  node: IQuestionNode<T>,
  answer: IAnswerInstance<T>,
) {
  const store = node.selectStore;
  const rowProps = store.buildRowProps(answer, "custom-inline");
  if (node.type === "string" || node.type === "text") {
    const value = (rowProps.value ?? "") as string;
    return (
      <>
        {node.type === "text" ? (
          <TextInput
            inputId={rowProps.inputId}
            labelId={rowProps.labelId}
            describedById={rowProps.describedById}
            value={value}
            onChange={(next) => rowProps.setValue(next as never)}
            disabled={node.readOnly}
            placeholder={node.placeholder}
          />
        ) : (
          <StringInput
            inputId={rowProps.inputId}
            labelId={rowProps.labelId}
            describedById={rowProps.describedById}
            value={value}
            onChange={(next) => rowProps.setValue(next as never)}
            disabled={node.readOnly}
            placeholder={node.placeholder}
          />
        )}
      </>
    );
  }

  const renderer = getAnswerInputRenderer(node);
  return renderer(rowProps);
}
