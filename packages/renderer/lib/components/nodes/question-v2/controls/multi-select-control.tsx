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

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
} as const;

const dialogStyle = {
  background: "#fff",
  color: "#1a202c",
  padding: "1rem",
  borderRadius: "0.5rem",
  minWidth: "min(90vw, 420px)",
  maxHeight: "90vh",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
} as const;

const chipListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  alignItems: "flex-start",
} as const;

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.25rem 0.5rem",
  border: "1px solid #cbd5e0",
  borderRadius: "9999px",
  background: "#f7fafc",
} as const;

const chipColumnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
} as const;

const chipActionsStyle = {
  display: "inline-flex",
  gap: "0.5rem",
  alignItems: "center",
} as const;

const controlStackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
} as const;

const optionListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: 0,
  margin: 0,
  listStyle: "none",
  border: "1px solid #cbd5e0",
  borderRadius: "0.375rem",
  maxHeight: "12rem",
  overflow: "auto",
} as const;

const optionButtonStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  border: "none",
  background: "transparent",
  cursor: "pointer",
} as const;

const optionButtonDisabledStyle = {
  cursor: "not-allowed",
  opacity: 0.6,
} as const;

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
  const { Button } = useTheme();
  const listOptions = displayOptions ?? options;
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];
  const [pendingCustomKeys, setPendingCustomKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectValue, setSelectValue] = useState("");
  const [query, setQuery] = useState("");
  const [lookupOpen, setLookupOpen] = useState(false);
  const [customDialog, setCustomDialog] = useState<PendingDialog<T> | null>(
    null,
  );

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

  const filteredOptions = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) return listOptions;
    return listOptions.filter((option) =>
      option.label.toLowerCase().includes(lowered),
    );
  }, [listOptions, query]);

  const renderOptionList = () => {
    if (!showOptions) return null;
    if (mode === "select") {
      const selectOptions = listOptions.map((entry) => {
        const isSelected = selectedOptionAnswers.has(entry.key);
        return {
          ...entry,
          disabled: entry.disabled || isSelected || !canAddSelection,
        };
      });
      const extendedOptions = hasCustomAction
        ? [
            ...selectOptions,
            {
              key: specifyOtherKey,
              label: "Specify other",
              value: null as unknown as AnswerOptionEntry<T>["value"],
              disabled: !canAddSelection,
            },
          ]
        : selectOptions;

      return (
        <div style={controlStackStyle}>
          <select
            id={sanitizeForId(`${node.key}-multi-select`)}
            value={selectValue}
            onChange={(event) => {
              const nextKey = event.target.value;
              setSelectValue("");
              handleSelectChange(nextKey);
            }}
            disabled={node.readOnly || isLoading || !canAddSelection}
            aria-labelledby={getNodeLabelId(node)}
            aria-describedby={getNodeDescribedBy(node)}
            aria-busy={isLoading || undefined}
          >
            <option value="">Select an option</option>
            {extendedOptions.map((entry) => (
              <option
                key={entry.key}
                value={entry.key}
                disabled={entry.disabled}
              >
                {entry.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    const optionEntries = filteredOptions.map((entry) => {
      const isSelected = selectedOptionAnswers.has(entry.key);
      return {
        key: entry.key,
        label: entry.label,
        disabled: entry.disabled || isSelected || !canAddSelection,
        onSelect: () => handleSelectChange(entry.key),
      };
    });

    const optionButtons = hasCustomAction
      ? [
          {
            key: specifyOtherKey,
            label: "Specify other",
            disabled: !canAddSelection,
            onSelect: () => handleSelectChange(specifyOtherKey),
          },
          ...optionEntries,
        ]
      : optionEntries;

    const list = (
      <ul style={optionListStyle} aria-label="Options">
        {optionButtons.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              style={{
                ...optionButtonStyle,
                ...(entry.disabled ? optionButtonDisabledStyle : null),
              }}
              onClick={() => entry.onSelect()}
              disabled={entry.disabled || node.readOnly || isLoading}
            >
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
    );

    const search = (
      <StringInput
        inputId={sanitizeForId(`${node.key}-${mode}-search`)}
        labelId={getNodeLabelId(node)}
        describedById={getNodeDescribedBy(node)}
        placeholder={mode === "lookup" ? "Search directory" : "Type to search"}
        value={query}
        onChange={setQuery}
        disabled={node.readOnly || isLoading}
      />
    );

    if (mode === "lookup") {
      return (
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setLookupOpen(true)}
            disabled={node.readOnly}
          >
            Open lookup
          </Button>
          {lookupOpen ? (
            <div style={overlayStyle} role="dialog" aria-modal="true">
              <div style={dialogStyle}>
                <div style={controlStackStyle}>
                  <div style={{ fontWeight: 600 }}>Lookup options</div>
                  {search}
                  {list}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setLookupOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </>
      );
    }

    return (
      <div style={controlStackStyle}>
        {search}
        {list}
      </div>
    );
  };

  const renderCustomActions = () => {
    if (!hasCustomAction || showOptions) return null;
    if (customKind === "string") {
      return (
        <Button
          type="button"
          variant="secondary"
          onClick={addCustomStringAnswer}
          disabled={!canAddSelection || isLoading}
        >
          Specify other
        </Button>
      );
    }
    if (customKind === "type") {
      return (
        <Button
          type="button"
          variant="secondary"
          onClick={addCustomTypeAnswer}
          disabled={!canAddSelection || isLoading}
        >
          Specify other
        </Button>
      );
    }
    return null;
  };

  const renderCustomDialog = () => {
    if (!customDialog || customKind !== "type") return null;
    const renderer = getAnswerInputRenderer(node);
    const rowProps = buildRowProps(node, customDialog.answer, "custom");
    const canConfirm = answerHasContent(customDialog.answer);
    return (
      <div style={overlayStyle} role="dialog" aria-modal="true">
        <div style={dialogStyle}>
          <div style={{ fontWeight: 600 }}>Specify other</div>
          <div>{renderer(rowProps)}</div>
          <AnswerErrors answer={customDialog.answer} />
          <div style={chipActionsStyle}>
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={controlStackStyle}>
      {renderCustomDialog()}
      <div style={chipListStyle}>
        {showSelectedOptions
          ? [...selectedOptionAnswers.values()].map((answer) => (
              <div key={answer.key} style={chipColumnStyle}>
                <div style={chipStyle}>
                  <AnswerDisplay
                    type={node.type}
                    value={answer.value}
                    placeholder="Selection"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(answer)}
                    disabled={!canRemoveSelection}
                    aria-label="Remove selection"
                  >
                    Remove
                  </button>
                </div>
                <AnswerErrors answer={answer} />
              </div>
            ))
          : null}
        {customAnswers.map((answer) => {
          const isInlineString = customKind === "string";
          return (
            <div key={answer.key} style={chipColumnStyle}>
              <div style={chipStyle}>
                {isInlineString ? (
                  renderInlineCustomInput(node, answer)
                ) : (
                  <AnswerDisplay
                    type={node.type}
                    value={answer.value}
                    placeholder="Custom value"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveAnswer(answer)}
                  disabled={!canRemoveSelection}
                  aria-label="Remove custom value"
                >
                  Remove
                </button>
              </div>
              <AnswerErrors answer={answer} />
            </div>
          );
        })}
      </div>
      <div style={chipActionsStyle}>
        {renderOptionList()}
        {renderCustomActions()}
        {(showSelectedOptions
          ? selectedOptionAnswers.size + customAnswers.length
          : customAnswers.length) > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearAll}
            disabled={!canRemoveSelection}
          >
            Clear all
          </Button>
        ) : null}
      </div>
    </div>
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
