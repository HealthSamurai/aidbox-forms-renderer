import { computed, makeObservable } from "mobx";
import type {
  AnswerOptionEntry,
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerOptions,
  IQuestionNode,
} from "../../../types.ts";
import type {
  Coding,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerify,
  areValuesEqual,
  booleanify,
  cloneValue,
  getValue,
  stringifyValue,
} from "../../../utils.ts";
import type { IPromiseBasedObservable } from "mobx-utils";
import { fromPromise } from "mobx-utils";

export class AnswerOptions<T extends AnswerType> implements IAnswerOptions<T> {
  constructor(private readonly question: IQuestionNode<T>) {
    makeObservable(this);
  }

  @computed
  private get answerOptions(): QuestionnaireItemAnswerOption[] {
    const slot = this.question.expressionRegistry.answer;
    if (slot) {
      return answerify(this.question.type, slot.value);
    }

    if (this.expandedValueSetOptions) {
      return this.expandedValueSetOptions;
    }

    return this.question.template.answerOption ?? [];
  }

  @computed.struct
  private get expandedValueSetOptions():
    | QuestionnaireItemAnswerOption[]
    | null {
    return (
      this.expansion?.case({
        fulfilled: (value) =>
          value.map((coding: Coding) => ({
            valueCoding: coding,
          })),
      }) ?? null
    );
  }

  @computed({ keepAlive: true })
  private get expansion(): IPromiseBasedObservable<Coding[]> | null {
    return this.question.template.answerValueSet
      ? fromPromise(
          this.question.form.valueSetExpander.expand(
            this.question.template.answerValueSet,
            this.question.preferredTerminologyServers,
          ),
        )
      : null;
  }

  @computed
  get loading(): boolean {
    return this.expansion?.state === "pending";
  }

  @computed
  get error(): string | null {
    return (
      this.expansion?.case({
        rejected: (error) =>
          error instanceof Error
            ? error.message
            : error
              ? String(error)
              : "Unknown error",
      }) ?? null
    );
  }

  @computed
  get entries(): AnswerOptionEntry<T>[] {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.question.type];
    return this.answerOptions.flatMap((option, index) => {
      const value = getValue(option, dataType);
      if (value === undefined) {
        return [];
      }

      const label = stringifyValue(dataType, value, `Option ${index + 1}`);
      const disabled = !this.isOptionEnabled(option);

      return [
        {
          key: `${this.question.key}_/_${index}`,
          label,
          value,
          option,
          disabled,
        } satisfies AnswerOptionEntry<T>,
      ];
    });
  }

  @computed
  get constraint(): QuestionnaireItem["answerConstraint"] {
    return this.question.template.answerConstraint ?? "optionsOnly";
  }

  @computed
  private get valueMap(): Map<
    string,
    DataTypeToType<AnswerTypeToDataType<T>> | null
  > {
    const map = new Map<
      string,
      DataTypeToType<AnswerTypeToDataType<T>> | null
    >();
    for (const entry of this.entries) {
      map.set(entry.key, entry.value);
    }
    return map;
  }

  getKeyForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): string {
    if (value == null) {
      return "";
    }

    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.question.type];
    const match = this.entries.find((entry) =>
      entry.value == null
        ? false
        : areValuesEqual(dataType, value, entry.value),
    );
    return match?.key ?? "";
  }

  getValueForKey(key: string): DataTypeToType<AnswerTypeToDataType<T>> | null {
    const value = this.valueMap.get(key);
    return value == null ? null : cloneValue(value);
  }

  getLegacyEntryForValue(
    answerKey: string,
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): { key: string; label: string } | null {
    if (value == null) {
      return null;
    }

    const label = stringifyValue(
      ANSWER_TYPE_TO_DATA_TYPE[this.question.type],
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
  }

  private isOptionEnabled(option: QuestionnaireItemAnswerOption): boolean {
    const toggles = this.question.expressionRegistry.answerOptionToggles;
    if (toggles.length === 0) {
      return true;
    }

    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.question.type];
    const optionValue = getValue(option, dataType);
    if (optionValue === undefined) {
      return true;
    }

    let matched = false;
    for (const toggle of toggles) {
      const toggleMatches = toggle.options.some((candidate) => {
        const candidateValue = getValue(candidate, dataType);
        return candidateValue === undefined
          ? false
          : areValuesEqual(dataType, candidateValue, optionValue);
      });

      if (toggleMatches) {
        matched = true;
        if (booleanify(toggle.slot.value)) {
          return true;
        }
      }
    }

    return !matched;
  }
}
