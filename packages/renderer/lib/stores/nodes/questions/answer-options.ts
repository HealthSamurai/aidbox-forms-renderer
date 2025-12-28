import { computed, makeObservable } from "mobx";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerOptions,
  IQuestionNode,
  ResolvedAnswerOption,
} from "../../../types.ts";
import type {
  Coding,
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerify,
  areValuesEqual,
  booleanify,
  getValue,
  OPTIONS_ISSUE_EXPRESSION,
  tokenify,
} from "../../../utils.ts";
import type { IPromiseBasedObservable } from "mobx-utils";
import { fromPromise } from "mobx-utils";
import { strings } from "../../../strings.ts";

function getOptionsErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error == null) {
    return strings.errors.unknown;
  }
  return String(error);
}

function toOptionsIssue(error: unknown): OperationOutcomeIssue {
  const message = getOptionsErrorMessage(error);
  return {
    severity: "error",
    code: "invalid",
    diagnostics: message,
    details: { text: message },
    expression: [OPTIONS_ISSUE_EXPRESSION],
  };
}

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
  get error(): OperationOutcomeIssue | null {
    return (
      this.expansion?.case({
        rejected: (error) => toOptionsIssue(error),
      }) ?? null
    );
  }

  @computed
  get resolvedOptions(): ResolvedAnswerOption<T>[] {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.question.type];
    const seen = new Set<string>();
    return this.answerOptions.flatMap((option) => {
      const value = getValue(option, dataType);
      if (value === undefined) {
        return [];
      }

      const token = tokenify(dataType, value);
      if (seen.has(token)) {
        return [];
      }
      seen.add(token);

      const disabled = !this.isOptionEnabled(option);

      return [
        {
          token,
          value,
          disabled,
        } satisfies ResolvedAnswerOption<T>,
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
    for (const entry of this.resolvedOptions) {
      map.set(entry.token, entry.value);
    }
    return map;
  }

  getTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): string {
    if (value == null) {
      return "";
    }

    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.question.type];
    const match = this.resolvedOptions.find((entry) =>
      entry.value == null
        ? false
        : areValuesEqual(dataType, value, entry.value),
    );
    return match?.token ?? "";
  }

  getValueForToken(
    token: string,
  ): DataTypeToType<AnswerTypeToDataType<T>> | null {
    const value = this.valueMap.get(token);
    return value == null ? null : structuredClone(value);
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
