import { observer } from "mobx-react-lite";
import type {
  AnswerType,
  IAnswerInstance,
  IQuestionNode,
  ValueDisplayComponent,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";

export type MultiSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  valueDisplay: ValueDisplayComponent<T>;
  showOptions?: boolean;
};

export const MultiSelectControl = observer(function MultiSelectControl<
  T extends AnswerType,
>({ node, valueDisplay, showOptions = true }: MultiSelectControlProps<T>) {
  const { Button, MultiSelectField } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);
  const ValueDisplay = valueDisplay;

  const selectedChips = store.selectedChipItems.flatMap((item) => {
    const value = item.answer.value;
    if (value == null) return [];
    return [
      {
        key: item.key,
        content: <ValueDisplay value={value} />,
        errors: <AnswerErrors answer={item.answer} />,
        onRemove: () => store.handleRemoveAnswer(item.answer),
        removeDisabled: !store.canRemoveSelection,
        removeLabel: "Remove selection",
      },
    ];
  });

  const customChips = store.customChipItems.flatMap((item) => {
    if (item.inlineString) {
      return [
        {
          key: item.key,
          content: renderInlineCustomInput(node, item.answer),
          errors: <AnswerErrors answer={item.answer} />,
          onRemove: () => store.handleRemoveAnswer(item.answer),
          removeDisabled: !store.canRemoveSelection,
          removeLabel: "Remove custom value",
        },
      ];
    }
    const value = item.answer.value;
    if (value == null) return [];
    return [
      {
        key: item.key,
        content: <ValueDisplay value={value} />,
        errors: <AnswerErrors answer={item.answer} />,
        onRemove: () => store.handleRemoveAnswer(item.answer),
        removeDisabled: !store.canRemoveSelection,
        removeLabel: "Remove custom value",
      },
    ];
  });

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
  const dialog = dialogState
    ? (() => {
        const rowProps = store.buildRowProps(dialogState.answer, "custom");

        return {
          open: true,
          title: "Specify other",
          content: (
            <>
              <Control
                answer={rowProps.answer}
                inputId={rowProps.inputId}
                labelId={rowProps.labelId}
                describedById={rowProps.describedById}
              />
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
      options={store.extendedOptions}
      selectValue={store.selectValue}
      onSelectOption={store.handleSelectOption}
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
  const Control = getValueControl(node.type);
  return (
    <Control
      answer={rowProps.answer}
      inputId={rowProps.inputId}
      labelId={rowProps.labelId}
      describedById={rowProps.describedById}
    />
  );
}
