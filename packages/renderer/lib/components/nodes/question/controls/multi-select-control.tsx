import { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import type {
  AnswerOptionEntry,
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
} from "../../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  areValuesEqual,
  cloneValue,
  getAnswerErrorId,
  getNodeDescribedBy,
  getNodeLabelId,
  sanitizeForId,
} from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { AnswerDisplay } from "../values/answer-display.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import { StringInput } from "../fhir/string/StringInput.tsx";
import { TextInput } from "../fhir/text/TextInput.tsx";

export type MultiSelectMode = "select" | "autocomplete" | "lookup";
export type CustomKind = "none" | "string" | "type";

export type MultiSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  displayOptions?: ReadonlyArray<AnswerOptionEntry<T>>;
  mode: MultiSelectMode;
  customKind: CustomKind;
  showOptions?: boolean;
  showSelectedOptions?: boolean;
};

type PendingDialog<T extends AnswerType> = {
  answer: IAnswerInstance<T>;
  isNew: boolean;
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
  const listOptions = displayOptions ?? options;
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];
  const [pendingCustomKeys, setPendingCustomKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectValue, setSelectValue] = useState("");
  const [query, setQuery] = useState("");
  const [customDialog, setCustomDialog] = useState<PendingDialog<T> | null>(
    null,
  );

  const labelId = getNodeLabelId(node);
  const describedById = getNodeDescribedBy(node);

  const selectedOptionAnswers = new Map<string, IAnswerInstance<T>>();
  const usedAnswerKeys = new Set<string>();
  options.forEach((option) => {
    const match = node.answers.find((answer) => {
      if (answer.value == null) return false;
      if (usedAnswerKeys.has(answer.key)) return false;
      return areValuesEqual(
        dataType,
        answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
        option.value,
      );
    });
    if (match) {
      selectedOptionAnswers.set(option.key, match);
      usedAnswerKeys.add(match.key);
    }
  });

  const customAnswers = node.answers.filter((answer) => {
    if (usedAnswerKeys.has(answer.key)) return false;
    if (customKind === "type" && pendingCustomKeys.has(answer.key)) {
      return false;
    }
    if (pendingCustomKeys.has(answer.key)) return true;
    return answer.value != null;
  });

  const availableAnswers = node.answers.filter((answer) => {
    if (usedAnswerKeys.has(answer.key)) return false;
    if (pendingCustomKeys.has(answer.key)) return false;
    return answer.value == null;
  });

  const canAddSelection =
    !node.readOnly && (node.canAdd || availableAnswers.length > 0);
  const canRemoveSelection = !node.readOnly && node.canRemove;
  const isLoading = node.options.loading;

  const specifyOtherKey = `${node.key}::__specify_other__`;
  const hasCustomAction = customKind !== "none";

  const addPendingKey = (key: string) => {
    setPendingCustomKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const removePendingKey = (key: string) => {
    setPendingCustomKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const takeAvailableAnswer = () => availableAnswers[0];

  const addOptionAnswer = (option: AnswerOptionEntry<T>) => {
    if (!canAddSelection || isLoading) return;
    if (selectedOptionAnswers.has(option.key)) return;
    const nextValue =
      option.value === undefined
        ? null
        : (cloneValue(option.value) as DataTypeToType<AnswerTypeToDataType<T>>);
    const slot = takeAvailableAnswer();
    if (slot) {
      slot.setValueByUser(nextValue);
      return;
    }
    node.addAnswer(nextValue);
  };

  const addCustomStringAnswer = () => {
    if (!canAddSelection || isLoading) return;
    const slot = takeAvailableAnswer();
    if (slot) {
      slot.setValueByUser("" as never);
      addPendingKey(slot.key);
      return;
    }
    const created = node.addAnswer("" as never);
    if (created) {
      addPendingKey(created.key);
    }
  };

  const addCustomTypeAnswer = () => {
    if (!canAddSelection || isLoading) return;
    const slot = takeAvailableAnswer();
    if (slot) {
      addPendingKey(slot.key);
      setCustomDialog({ answer: slot, isNew: false });
      return;
    }
    const created = node.addAnswer(null);
    if (created) {
      addPendingKey(created.key);
      setCustomDialog({ answer: created as IAnswerInstance<T>, isNew: true });
    }
  };

  const handleRemoveAnswer = (answer: IAnswerInstance<T>) => {
    if (!canRemoveSelection) return;
    removePendingKey(answer.key);
    node.removeAnswer(answer);
  };

  const handleClearAll = () => {
    if (!canRemoveSelection) return;
    const answersToClear = showSelectedOptions ? node.answers : customAnswers;
    [...answersToClear].forEach((answer) => node.removeAnswer(answer));
  };

  const handleSelectChange = (key: string) => {
    if (!key) return;
    if (key === specifyOtherKey) {
      if (customKind === "string") {
        addCustomStringAnswer();
      } else if (customKind === "type") {
        addCustomTypeAnswer();
      }
      return;
    }
    const option = options.find((entry) => entry.key === key);
    if (option) {
      addOptionAnswer(option);
    }
  };

  const handleSelectOption = (key: string) => {
    if (mode === "select") {
      setSelectValue("");
    }
    handleSelectChange(key);
  };

  const filteredOptions = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) return listOptions;
    return listOptions.filter((option) =>
      option.label.toLowerCase().includes(lowered),
    );
  }, [listOptions, query]);

  const baseOptions = mode === "select" ? listOptions : filteredOptions;
  const preparedOptions = baseOptions.map((entry) => {
    const isSelected = selectedOptionAnswers.has(entry.key);
    return {
      ...entry,
      disabled: entry.disabled || isSelected || !canAddSelection,
    };
  });

  const extendedOptions = hasCustomAction
    ? mode === "select"
      ? [
          ...preparedOptions,
          {
            key: specifyOtherKey,
            label: "Specify other",
            value: null as unknown as AnswerOptionEntry<T>["value"],
            disabled: !canAddSelection,
          },
        ]
      : [
          {
            key: specifyOtherKey,
            label: "Specify other",
            value: null as unknown as AnswerOptionEntry<T>["value"],
            disabled: !canAddSelection,
          },
          ...preparedOptions,
        ]
    : preparedOptions;

  const selectedChips = showSelectedOptions
    ? [...selectedOptionAnswers.values()].map((answer) => ({
        key: answer.key,
        content: (
          <AnswerDisplay
            type={node.type}
            value={answer.value}
            placeholder="Selection"
          />
        ),
        errors: <AnswerErrors answer={answer} />,
        onRemove: () => handleRemoveAnswer(answer),
        removeDisabled: !canRemoveSelection,
        removeLabel: "Remove selection",
      }))
    : [];

  const customChips = customAnswers.map((answer) => {
    const isInlineString = customKind === "string";
    return {
      key: answer.key,
      content: isInlineString ? (
        renderInlineCustomInput(node, answer)
      ) : (
        <AnswerDisplay
          type={node.type}
          value={answer.value}
          placeholder="Custom value"
        />
      ),
      errors: <AnswerErrors answer={answer} />,
      onRemove: () => handleRemoveAnswer(answer),
      removeDisabled: !canRemoveSelection,
      removeLabel: "Remove custom value",
    };
  });

  const chips = [...selectedChips, ...customChips];

  const customAction =
    hasCustomAction && !showOptions ? (
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          if (customKind === "string") {
            addCustomStringAnswer();
          } else if (customKind === "type") {
            addCustomTypeAnswer();
          }
        }}
        disabled={!canAddSelection || isLoading}
      >
        Specify other
      </Button>
    ) : null;

  const hasSelections =
    (showSelectedOptions
      ? selectedOptionAnswers.size + customAnswers.length
      : customAnswers.length) > 0;

  const clearAction = hasSelections ? (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClearAll}
      disabled={!canRemoveSelection}
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

  const dialog =
    customDialog && customKind === "type"
      ? (() => {
          const renderer = getAnswerInputRenderer(node);
          const rowProps = buildRowProps(node, customDialog.answer, "custom");
          const canConfirm = answerHasContent(customDialog.answer);

          return {
            open: true,
            title: "Specify other",
            content: (
              <>
                {renderer(rowProps)}
                <AnswerErrors answer={customDialog.answer} />
              </>
            ),
            actions: (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    removePendingKey(customDialog.answer.key);
                    if (customDialog.isNew) {
                      node.removeAnswer(customDialog.answer);
                    } else {
                      customDialog.answer.setValueByUser(null);
                    }
                    setCustomDialog(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => {
                    removePendingKey(customDialog.answer.key);
                    setCustomDialog(null);
                  }}
                  disabled={!canConfirm}
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
      options={extendedOptions}
      selectValue={selectValue}
      onSelectOption={handleSelectOption}
      searchValue={query}
      onSearchValueChange={setQuery}
      labelId={labelId}
      describedById={describedById}
      readOnly={node.readOnly}
      isLoading={isLoading}
      showOptions={showOptions}
      chips={chips}
      actions={actions}
      {...(dialog ? { dialog } : {})}
      selectPlaceholder="Select an option"
    />
  );
});

function buildRowProps<T extends AnswerType>(
  node: IQuestionNode<T>,
  answer: IAnswerInstance<T>,
  suffix: string,
): RowRenderProps<T> {
  const answerErrorId =
    answer.issues.length > 0 ? getAnswerErrorId(answer) : undefined;
  const describedByPieces = [getNodeDescribedBy(node), answerErrorId].filter(
    (value): value is string => Boolean(value),
  );
  const describedById =
    describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;

  return {
    value: answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    setValue: (value) => answer.setValueByUser(value),
    inputId: sanitizeForId(`${answer.key}-${suffix}`),
    labelId: getNodeLabelId(node),
    describedById,
    answer,
  };
}

function renderInlineCustomInput<T extends AnswerType>(
  node: IQuestionNode<T>,
  answer: IAnswerInstance<T>,
) {
  const rowProps = buildRowProps(node, answer, "custom-inline");
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
