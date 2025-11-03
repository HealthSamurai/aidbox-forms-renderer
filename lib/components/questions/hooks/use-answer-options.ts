import { useCallback, useMemo } from "react";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IQuestionNode,
} from "../../../stores/types.ts";
import {
  getValue,
  stringifyValue,
  areValuesEqual,
  cloneValue,
  ANSWER_TYPE_TO_DATA_TYPE,
} from "../../../utils.ts";

export type AnswerOptionEntry<T extends AnswerType> = {
  key: string;
  label: string;
  value: DataTypeToType<AnswerTypeToDataType<T>>;
};

type LegacyOption = {
  key: string;
  label: string;
};

export function useAnswerOptions<T extends AnswerType>(item: IQuestionNode<T>) {
  const answerOptions = item.answerOptions;
  const answerType = item.type;
  const itemKey = item.key;

  const options = useMemo(() => {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[answerType];
    return answerOptions.flatMap((option, index) => {
      const value = getValue(option, dataType);
      if (value === undefined) {
        return [];
      }

      const label = stringifyValue(dataType, value, `Option ${index + 1}`);

      return [
        {
          key: `${itemKey}::${index}`,
          label,
          value,
        } satisfies AnswerOptionEntry<T>,
      ];
    });
  }, [answerOptions, answerType, itemKey]);

  const valueByKey = useMemo(() => {
    const map = new Map<string, DataTypeToType<AnswerTypeToDataType<T>>>();
    options.forEach((entry) => {
      map.set(entry.key, entry.value);
    });
    return map;
  }, [options]);

  const getKeyForValue = useCallback(
    (value: DataTypeToType<AnswerTypeToDataType<T>> | null) => {
      if (value == null) return "";
      const match = options.find((entry) =>
        areValuesEqual(ANSWER_TYPE_TO_DATA_TYPE[item.type], value, entry.value),
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

  const getLegacyOptionForValue = useCallback(
    (
      answerKey: string,
      value: DataTypeToType<AnswerTypeToDataType<T>> | null,
    ): LegacyOption | null => {
      if (value == null) {
        return null;
      }

      const label = stringifyValue(
        ANSWER_TYPE_TO_DATA_TYPE[item.type],
        value,
        "Legacy answer",
      );
      if (!label) {
        return null;
      }

      return {
        key: `${answerKey}::__legacy__`,
        label,
      };
    },
    [item.type],
  );

  return {
    options,
    getKeyForValue,
    getValueForKey,
    getLegacyOptionForValue,
  } as const;
}
