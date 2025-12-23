import { useEffect, useMemo, useState } from "react";
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
} from "../../../../utils.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeDescribedBy, getNodeLabelId } from "../../../../utils.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import type { RowRenderProps } from "../answers/answer-row.tsx";
import { getAnswerInputRenderer } from "./answer-input-renderer.tsx";
import {
  MultiSelectControl,
  type CustomKind,
} from "./multi-select-control.tsx";

const BOOLEAN_FALLBACK_OPTIONS: Array<AnswerOptionEntry<"boolean">> = [
  {
    key: "yes",
    label: "Yes",
    value: true,
    option: {} as AnswerOptionEntry<"boolean">["option"],
    disabled: false,
  },
  {
    key: "no",
    label: "No",
    value: false,
    option: {} as AnswerOptionEntry<"boolean">["option"],
    disabled: false,
  },
  {
    key: "unanswered",
    label: "Unanswered",
    value: null as unknown as boolean,
    option: {} as AnswerOptionEntry<"boolean">["option"],
    disabled: false,
  },
];

export const OptionListControl = observer(function OptionListControl<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const { CheckboxGroup } = useTheme();
  const hasChildren =
    Array.isArray(node.template.item) && node.template.item.length > 0;
  const useCheckboxes = node.repeats && !hasChildren;
  const isBooleanFallback =
    node.type === "boolean" && node.options.entries.length === 0;
  const options = useMemo(
    () =>
      (isBooleanFallback
        ? BOOLEAN_FALLBACK_OPTIONS
        : node.options.entries) as ReadonlyArray<AnswerOptionEntry<T>>,
    [isBooleanFallback, node.options.entries],
  );
  const isLoading = node.options.loading;
  const customKind = getCustomKind(node);
  const allowCustom = customKind !== "none";
  const [customActive, setCustomActive] = useState(false);

  if (useCheckboxes) {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];
    const selectedKeys = new Set<string>();
    const answerByKey = new Map<string, IAnswerInstance<T>>();
    const matchedAnswerKeys = new Set<string>();

    options.forEach((option) => {
      const match = findAnswer(option, dataType, node);
      if (match) {
        selectedKeys.add(option.key);
        answerByKey.set(option.key, match);
        matchedAnswerKeys.add(match.key);
      }
    });

    const nonOptionAnswers = node.answers.filter(
      (answer) => !matchedAnswerKeys.has(answer.key),
    );
    const customAnswers = nonOptionAnswers.filter(answerHasContent);
    const availableAnswers = nonOptionAnswers.filter(
      (answer) => answer.value == null,
    );
    const canAddSelection =
      !node.readOnly && (node.canAdd || availableAnswers.length > 0);
    const hasCustomAnswers = allowCustom && customAnswers.length > 0;
    const isCustomActive = allowCustom && (customActive || hasCustomAnswers);
    const specifyOthersKey = `${node.key}::__specify_others__`;

    if (isCustomActive) {
      selectedKeys.add(specifyOthersKey);
    }

    const uiOptions = options.map((option) => {
      const isSelected = selectedKeys.has(option.key);
      return {
        key: option.key,
        label: option.label,
        value: option.value,
        disabled:
          option.disabled ||
          (!isSelected && !canAddSelection) ||
          (isSelected && !node.canRemove),
      };
    });

    if (allowCustom) {
      uiOptions.push({
        key: specifyOthersKey,
        label: "Specify others",
        value: null as unknown as AnswerOptionEntry<T>["value"],
        disabled:
          (!isCustomActive && !canAddSelection) ||
          (isCustomActive && !node.canRemove),
      });
    }

    return (
      <div>
        <CheckboxGroup
          options={uiOptions}
          selectedKeys={selectedKeys}
          onToggle={(key) => {
            if (allowCustom && key === specifyOthersKey) {
              if (isCustomActive) {
                if (!node.canRemove) return;
                nonOptionAnswers.forEach((answer) => node.removeAnswer(answer));
                setCustomActive(false);
                return;
              }
              if (!canAddSelection) return;
              setCustomActive(true);
              return;
            }

            const option = options.find((entry) => entry.key === key);
            if (!option) return;
            const existing = answerByKey.get(key);
            if (existing) {
              if (!node.canRemove) return;
              node.removeAnswer(existing);
              return;
            }
            if (!canAddSelection) return;
            const next =
              option.value === undefined
                ? null
                : (cloneValue(option.value) as DataTypeToType<
                    AnswerTypeToDataType<T>
                  >);
            const slot = availableAnswers[0];
            if (slot) {
              slot.setValueByUser(next);
              return;
            }
            node.addAnswer(next);
          }}
          inputName={node.key}
          labelId={getNodeLabelId(node)}
          describedById={getNodeDescribedBy(node)}
          readOnly={node.readOnly}
          isLoading={isLoading}
          renderErrors={(key) => {
            const answer = answerByKey.get(key);
            return answer ? <AnswerErrors answer={answer} /> : null;
          }}
        />
        {allowCustom && isCustomActive ? (
          <MultiSelectControl
            node={node}
            options={options}
            displayOptions={[]}
            mode="autocomplete"
            customKind={customKind}
            showOptions
            showSelectedOptions={false}
          />
        ) : null}
      </div>
    );
  }

  return (
    <AnswerList
      node={node}
      renderRow={(rowProps) => (
        <OptionRadioRow
          node={node}
          rowProps={rowProps}
          options={options}
          isBooleanFallback={isBooleanFallback}
          isLoading={isLoading}
          customKind={customKind}
        />
      )}
    />
  );
});

const OptionRadioRow = observer(function OptionRadioRow<T extends AnswerType>({
  node,
  rowProps,
  options,
  isBooleanFallback,
  isLoading,
  customKind,
}: {
  node: IQuestionNode<T>;
  rowProps: RowRenderProps<T>;
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  isBooleanFallback: boolean;
  isLoading: boolean;
  customKind: CustomKind;
}) {
  const { RadioGroup } = useTheme();
  const [forceCustom, setForceCustom] = useState(false);
  const allowCustom = customKind !== "none";
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];
  const specifyOtherKey = `${node.key}::__specify_other__`;

  const baseOptions = options.map((option) => ({
    key: option.key,
    label: option.label,
    disabled: option.disabled,
  }));
  const radioOptions = allowCustom
    ? [...baseOptions, { key: specifyOtherKey, label: "Specify other" }]
    : baseOptions;

  const selectKey = isBooleanFallback
    ? getKeyForValueFromEntries(options, dataType, rowProps.value)
    : node.options.getKeyForValue(rowProps.value);

  const isCustomValue =
    allowCustom && selectKey === "" && rowProps.value != null;
  const isCustomActive = isCustomValue || forceCustom;

  const legacyOption =
    !allowCustom &&
    !isBooleanFallback &&
    selectKey === "" &&
    rowProps.value != null
      ? node.options.getLegacyEntryForValue(rowProps.answer.key, rowProps.value)
      : null;

  const selectValue = isCustomActive
    ? specifyOtherKey
    : selectKey || legacyOption?.key || "";

  useEffect(() => {
    if (!allowCustom) return;
    if (selectKey && forceCustom) {
      setForceCustom(false);
    }
  }, [allowCustom, forceCustom, selectKey]);

  const customInput =
    allowCustom && isCustomActive
      ? getAnswerInputRenderer(node)(rowProps)
      : null;

  return (
    <div>
      <RadioGroup
        options={radioOptions}
        selectValue={selectValue}
        legacyOptionLabel={legacyOption?.label}
        legacyOptionKey={legacyOption?.key}
        onChange={(key) => {
          if (allowCustom && key === specifyOtherKey) {
            setForceCustom(true);
            if (!isCustomValue) {
              rowProps.setValue(null);
            }
            return;
          }
          setForceCustom(false);
          if (isBooleanFallback) {
            const nextValue = key
              ? getValueForKeyFromEntries(options, key)
              : null;
            rowProps.setValue(nextValue);
            return;
          }
          const nextValue = key ? node.options.getValueForKey(key) : null;
          rowProps.setValue(nextValue);
        }}
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        readOnly={node.readOnly}
        isLoading={isLoading}
      />
      {customInput ? (
        <div style={{ paddingLeft: "1.5rem" }}>{customInput}</div>
      ) : null}
    </div>
  );
});

function getCustomKind(node: IQuestionNode): CustomKind {
  if (node.options.constraint === "optionsOrString") return "string";
  if (node.options.constraint === "optionsOrType") return "type";
  return "none";
}

function findAnswer<T extends AnswerType>(
  option: AnswerOptionEntry<T>,
  dataType: (typeof ANSWER_TYPE_TO_DATA_TYPE)[T],
  node: IQuestionNode<T>,
) {
  return node.answers.find((answer) => {
    if (answer.value == null || option.value == null) {
      return answer.value == null && option.value == null;
    }
    return areValuesEqual(dataType, answer.value, option.value);
  });
}

function getKeyForValueFromEntries<T extends AnswerType>(
  options: ReadonlyArray<AnswerOptionEntry<T>>,
  dataType: (typeof ANSWER_TYPE_TO_DATA_TYPE)[T],
  value: unknown,
) {
  if (value == null) {
    const unanswered = options.find((entry) => entry.key === "unanswered");
    return unanswered?.key ?? "";
  }
  const match = options.find(
    (entry) =>
      entry.value !== undefined &&
      areValuesEqual(dataType, entry.value, value as never),
  );
  return match?.key ?? "";
}

function getValueForKeyFromEntries<T extends AnswerType>(
  options: ReadonlyArray<AnswerOptionEntry<T>>,
  key: string,
) {
  if (!key) return null;
  const match = options.find((entry) => entry.key === key);
  if (!match) return null;
  return match.value === undefined ? null : cloneValue(match.value);
}
