import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type {
  AnswerOptionEntry,
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IQuestionNode,
  IAnswerInstance,
} from "../../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  areValuesEqual,
  cloneValue,
} from "../../../../utils.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNodeDescribedBy, getNodeLabelId } from "../../../../utils.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";

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
  const { OptionRadioGroup, OptionCheckboxGroup } = useTheme();
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

  if (useCheckboxes) {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];
    const selectedKeys = new Set<string>();
    const answerByKey = new Map<string, IAnswerInstance<T>>();
    options.forEach((option) => {
      const match = findAnswer(option, dataType, node);
      if (match) {
        selectedKeys.add(option.key);
        answerByKey.set(option.key, match);
      }
    });
    const uiOptions = options.map((option) => ({
      ...option,
      disabled:
        option.disabled || (!selectedKeys.has(option.key) && !node.canAdd),
    }));
    return (
      <OptionCheckboxGroup
        options={uiOptions}
        selectedKeys={selectedKeys}
        onToggle={(key) => {
          const option = options.find((entry) => entry.key === key);
          if (!option) return;
          const existing = answerByKey.get(key);
          if (existing) {
            node.removeAnswer(existing);
            return;
          }
          const next =
            option.value === undefined
              ? null
              : (cloneValue(option.value) as DataTypeToType<
                  AnswerTypeToDataType<T>
                >);
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
    );
  }

  const dataType = ANSWER_TYPE_TO_DATA_TYPE[node.type];

  return (
    <AnswerList
      node={node}
      renderRow={(rowProps) => {
        const selectKey = isBooleanFallback
          ? getKeyForValueFromEntries(options, dataType, rowProps.value)
          : node.options.getKeyForValue(rowProps.value);

        const legacyOption =
          !isBooleanFallback && selectKey === "" && rowProps.value != null
            ? node.options.getLegacyEntryForValue(
                rowProps.answer.key,
                rowProps.value,
              )
            : null;

        const selectValue = selectKey || legacyOption?.key || "";

        return (
          <OptionRadioGroup
            options={options}
            selectValue={selectValue}
            legacyOptionLabel={legacyOption?.label}
            legacyOptionKey={legacyOption?.key}
            onChange={(key) => {
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
        );
      }}
    />
  );
});

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
