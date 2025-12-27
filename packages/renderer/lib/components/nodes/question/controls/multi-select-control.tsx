import { observer } from "mobx-react-lite";
import type {
  AnswerType,
  IAnswerInstance,
  IQuestionNode,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";

const SPECIFY_OTHER_LABEL = "Specify other";
const UNANSWERED_LABEL = "Unanswered";

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
        removeLabel: "Remove selection",
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
          removeLabel: "Remove custom value",
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
        removeLabel: "Remove custom value",
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
        Specify other
      </MultiSelectSpecifyOtherButton>
    ) : null;

  const clearAction = store.hasSelections ? (
    <MultiSelectClearAllButton
      onClick={store.handleClearAll}
      disabled={!store.canRemoveSelection}
    >
      Clear all
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
          title: "Specify other",
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
                Cancel
              </MultiSelectDialogCancelButton>
              <MultiSelectDialogAddButton
                onClick={store.confirmCustomDialog}
                disabled={!dialogState.canConfirm}
              >
                Add
              </MultiSelectDialogAddButton>
            </>
          ),
        };
      })()
    : undefined;
  const options = store.optionsWithSpecifyOther.map((option) => ({
    token: option.token,
    label:
      option.token === store.specifyOtherToken ? (
        SPECIFY_OTHER_LABEL
      ) : option.value == null ? (
        UNANSWERED_LABEL
      ) : (
        <ValueDisplay type={node.type} value={option.value} />
      ),
    disabled: option.disabled,
  }));

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
      placeholder="Select an option"
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
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
    />
  );
}
