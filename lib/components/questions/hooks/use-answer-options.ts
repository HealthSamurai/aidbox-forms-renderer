import { useCallback, useMemo } from "react";
import type {
  AnswerType,
  AnswerValueType,
  IQuestionNode,
} from "../../../stores/types.ts";
import { getValue, stringifyValue, areValuesEqual, cloneValue } from "../../../utils.ts";

export type AnswerOptionEntry<T extends AnswerType> = {
  key: string;
  label: string;
  value: AnswerValueType<T>;
};

function computeOptions<T extends AnswerType>(
  item: IQuestionNode<T>,
): AnswerOptionEntry<T>[] {
  const { answerOption = [] } = item.template;
  return answerOption.flatMap((option, index) => {
    const value = getValue(option, item.type);
    if (value === undefined) {
      return [];
    }

    const label = stringifyValue(option, item.type, value, `Option ${index + 1}`);

    return [
      {
        key: `${item.key}::${index}`,
        label,
        value,
      },
    ];
  });
}

export function useAnswerOptions<T extends AnswerType>(item: IQuestionNode<T>) {
  const options = useMemo(() => computeOptions(item), [item]);

  const valueByKey = useMemo(() => {
    const map = new Map<string, AnswerValueType<T>>();
    options.forEach((entry) => {
      map.set(entry.key, entry.value);
    });
    return map;
  }, [options]);

  const getKeyForValue = useCallback(
    (value: AnswerValueType<T> | null) => {
      if (value == null) return "";
      const match = options.find((entry) =>
        areValuesEqual(item.type, value, entry.value),
      );
      return match?.key ?? "";
    },
    [item.type, options],
  );

  const getValueForKey = useCallback(
    (key: string) => {
      const value = valueByKey.get(key);
      return value == null ? null : cloneValue(value);
    },
    [valueByKey],
  );

  return {
    options,
    getKeyForValue,
    getValueForKey,
  } as const;
}
