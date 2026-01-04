import { observer } from "mobx-react-lite";
import type {
  AnswerType,
  IAnswerInstance,
  IQuestionNode,
  OptionItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";

export type MultiSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  showOptions?: boolean;
};

export const MultiSelectControl = observer(function MultiSelectControl<
  T extends AnswerType,
>({ node, showOptions = true }: MultiSelectControlProps<T>) {
  const {
    MultiSelectInput,
    MultiSelectSpecifyOtherButton,
    MultiSelectClearAllButton,
    MultiSelectDialogCancelButton,
    MultiSelectDialogAddButton,
  } = useTheme();
  const store = node.selectStore;
  const Control = getValueControl(node.type);

  const selectedChips = store.selectedChipItems.flatMap((item) => {
    const value = item.answer.value;
    if (value == null) return [];
    return [
      {
        token: item.token,
        content: <ValueDisplay type={node.type} value={value} />,
        errors: <AnswerErrors answer={item.answer} />,
        onRemove: () => store.handleRemoveAnswer(item.answer),
        removeDisabled: !store.canRemoveSelection,
        removeLabel: strings.selection.removeSelection,
      },
    ];
  });

  const customChips = store.customChipItems.flatMap((item) => {
    if (item.inlineString) {
      return [
        {
          token: item.token,
          content: renderInlineCustomInput(node, item.answer),
          errors: <AnswerErrors answer={item.answer} />,
          onRemove: () => store.handleRemoveAnswer(item.answer),
          removeDisabled: !store.canRemoveSelection,
          removeLabel: strings.selection.removeCustomValue,
        },
      ];
    }
    const value = item.answer.value;
    if (value == null) return [];
    return [
      {
        token: item.token,
        content: <ValueDisplay type={node.type} value={value} />,
        errors: <AnswerErrors answer={item.answer} />,
        onRemove: () => store.handleRemoveAnswer(item.answer),
        removeDisabled: !store.canRemoveSelection,
        removeLabel: strings.selection.removeCustomValue,
      },
    ];
  });

  const chips = [...selectedChips, ...customChips];

  const customAction =
    store.hasCustomAction && !showOptions ? (
      <MultiSelectSpecifyOtherButton
        onClick={() => store.handleSelectChange(store.specifyOtherToken)}
        disabled={!store.canAddSelection || store.isLoading}
      >
        {strings.selection.specifyOther}
      </MultiSelectSpecifyOtherButton>
    ) : null;

  const clearAction = store.hasSelections ? (
    <MultiSelectClearAllButton
      onClick={store.handleClearAll}
      disabled={!store.canRemoveSelection}
    >
      {strings.selection.clearAll}
    </MultiSelectClearAllButton>
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
          title: strings.dialog.specifyOtherTitle,
          content: (
            <>
              <Control
                answer={rowProps.answer}
                id={rowProps.id}
                ariaLabelledBy={rowProps.ariaLabelledBy}
                ariaDescribedBy={rowProps.ariaDescribedBy}
              />
              <AnswerErrors answer={dialogState.answer} />
            </>
          ),
          actions: (
            <>
              <MultiSelectDialogCancelButton
                onClick={store.cancelCustomDialog}
                disabled={false}
              >
                {strings.dialog.cancel}
              </MultiSelectDialogCancelButton>
              <MultiSelectDialogAddButton
                onClick={store.confirmCustomDialog}
                disabled={!dialogState.canConfirm}
              >
                {strings.dialog.add}
              </MultiSelectDialogAddButton>
            </>
          ),
        };
      })()
    : undefined;
  const options: OptionItem[] = [];
  store.optionsWithSpecifyOther.forEach((option) => {
    if (option.token === store.specifyOtherToken) {
      options.push({
        token: option.token,
        label: strings.selection.specifyOther,
        disabled: option.disabled,
      });
      return;
    }
    if (option.value == null) {
      return;
    }
    options.push({
      token: option.token,
      label: <ValueDisplay type={node.type} value={option.value} />,
      disabled: option.disabled,
    });
  });

  return (
    <MultiSelectInput
      options={options}
      token={store.pendingSelectToken}
      onChange={store.handleSelectOption}
      ariaLabelledBy={store.ariaLabelledBy}
      ariaDescribedBy={store.ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={store.isLoading}
      showOptions={showOptions}
      chips={chips}
      actions={actions}
      {...(dialog ? { dialog } : {})}
      placeholder={strings.selection.selectPlaceholder}
    />
  );
});

function renderInlineCustomInput<T extends AnswerType>(
  node: IQuestionNode<T>,
  answer: IAnswerInstance<T>,
) {
  const rowProps = node.selectStore.buildRowProps(answer, "custom-inline");
  const Control = getValueControl(
    node.options.constraint === "optionsOrString" ? "string" : node.type,
  );
  return (
    <Control
      answer={rowProps.answer}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
    />
  );
}
