import {
  action,
  comparer,
  computed,
  observable,
  override,
  reaction,
} from "mobx";
import type { IReactionDisposer } from "mobx";
import {
  AnswerType,
  DataTypeToType,
  IAnswerInstance,
  IPresentableNode,
  IForm,
  INode,
  IQuestionNode,
  IScope,
  SnapshotKind,
  type AnswerTypeToDataType,
} from "./types.ts";
import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

import { AbstractActualNodeStore } from "./abstract-actual-node-store.ts";
import { AnswerInstance } from "./answer-instance.ts";
import { QuestionValidator } from "./question-validator.ts";

import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  getValue,
} from "../utils.ts";

type AnswerLifecycle =
  | "pristine"
  | "template"
  | "response"
  | "expression"
  | "manual";

export class QuestionStore<T extends AnswerType = AnswerType>
  extends AbstractActualNodeStore
  implements IQuestionNode<T>
{
  @observable.shallow
  readonly answers = observable.array<
    IAnswerInstance<DataTypeToType<AnswerTypeToDataType<T>>>
  >([], {
    deep: false,
    name: "QuestionStore.answers",
  });

  @observable
  private lifecycle: AnswerLifecycle = "pristine";

  private readonly disposers: IReactionDisposer[] = [];

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentKey);
    this.validator = new QuestionValidator(this);

    if (!this.applyResponseValues(responseItem?.answer)) {
      this.applyTemplateInitialValues();
    }
    this.ensureBaselineAnswers();
    this.detectInitialOverride();
    this.setupExpressionReactions();
  }

  @computed
  get type() {
    return this.template.type as T;
  }

  @computed
  get repeats() {
    return !!this.template.repeats;
  }

  @override
  override get maxOccurs(): number {
    return this.repeats ? super.maxOccurs : 1;
  }

  @computed
  get canAdd() {
    return !this.readOnly && this.answers.length < this.maxOccurs;
  }

  @computed
  get canRemove() {
    return !this.readOnly && this.answers.length > this.minOccurs;
  }

  @action
  addAnswer(initial: DataTypeToType<AnswerTypeToDataType<T>> | null = null) {
    if (this.canAdd) {
      this.pushAnswer(initial);
      this.markDirty();
      this.markUserOverridden();
    }
  }

  @action
  removeAnswer(index: number) {
    if (!this.canRemove) return;
    const [removed] = this.answers.splice(index, 1);
    removed?.dispose();
    this.ensureBaselineAnswers();
    this.markDirty();
    this.markUserOverridden();
  }

  @action
  setAnswer(
    index: number,
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ) {
    if (index === 0 && this.answers.length === 0) {
      this.ensureBaselineAnswers();
    }

    const answer = this.answers[index];
    if (answer) {
      answer.value = value === "" ? null : value;
      this.markDirty();
      this.markUserOverridden();
    }
  }

  @action
  private ensureBaselineAnswers(force = false) {
    if (this.repeats) {
      while (this.answers.length < this.minOccurs && (force || this.canAdd)) {
        this.pushAnswer(null);
      }
      return;
    }

    if (this.answers.length === 0 && (force || this.canAdd)) {
      this.pushAnswer(null);
    }
  }

  @computed
  private get hasContent() {
    return this.answers.some(answerHasContent);
  }

  private detectInitialOverride() {
    const registry = this.expressionRegistry;
    if (
      !registry?.calculated ||
      this.readOnly ||
      this.lifecycle !== "response"
    ) {
      return;
    }

    if (!this.hasContent) {
      return;
    }

    const calculated = this.normalizeExpressionValues(
      registry.calculated.value,
    );
    if (calculated.length === 0 || !this.answersMatch(calculated)) {
      this.markUserOverridden();
    }
  }

  private trackDisposer(disposer: IReactionDisposer) {
    this.disposers.push(disposer);
  }

  private unregisterDisposer(disposer: IReactionDisposer) {
    const index = this.disposers.indexOf(disposer);
    if (index >= 0) {
      this.disposers.splice(index, 1);
    }
  }

  private setupExpressionReactions() {
    const registry = this.expressionRegistry;
    if (!registry) {
      return;
    }

    const { initial, calculated } = registry;
    if (initial) {
      const disposer = reaction(
        () => [this.isEnabled, initial.value, this.hasContent, this.lifecycle],
        (_arg: unknown, _prev: unknown, reaction) => {
          if (this.applyInitialExpressionValue()) {
            this.unregisterDisposer(disposer);
            reaction.dispose();
          }
        },
        {
          name: `${this.key}:apply-initial-value-reaction`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      );
      this.trackDisposer(disposer);
    }

    if (calculated) {
      const disposer = reaction(
        () => [this.isEnabled, this.lifecycle, calculated.value],
        () => this.applyCalculatedExpressionValue(),
        {
          name: `${this.key}:apply-calculated-value-reaction`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      );
      this.trackDisposer(disposer);
    }
  }

  @action
  private applyTemplateInitialValues() {
    const entries = this.template.initial;
    if (!entries || entries.length === 0 || this.answers.length > 0) {
      return;
    }

    const values = entries
      .map((entry) => getValue(entry, ANSWER_TYPE_TO_DATA_TYPE[this.type]))
      .filter(
        (value): value is DataTypeToType<AnswerTypeToDataType<T>> =>
          value !== undefined && value !== null,
      );

    if (values.length === 0) {
      return;
    }

    let seeded = false;

    if (this.repeats) {
      const cappedLength = Math.min(values.length, this.maxOccurs);
      for (let index = 0; index < cappedLength; index += 1) {
        const value = values[index];
        this.pushAnswer(
          value && typeof value === "object" ? structuredClone(value) : value,
        );
        seeded = true;
      }
    } else {
      this.ensureBaselineAnswers(true);
      const answer = this.answers[0];
      if (!answer) {
        return;
      }
      const initialValue = values[0];
      answer.value =
        initialValue && typeof initialValue === "object"
          ? structuredClone(initialValue)
          : initialValue;
      seeded = true;
    }

    if (seeded) {
      this.lifecycle = "template";
    }
  }

  @action
  private applyInitialExpressionValue() {
    const initial = this.expressionRegistry?.initial;
    if (!initial || !this.isEnabled) return false;

    const seededContent = this.lifecycle === "template";
    if (this.hasContent && !seededContent) return true;
    if (initial.value === undefined) return false;

    const values = this.normalizeExpressionValues(initial.value);
    if (values.length === 0) return false;

    if (this.repeats) {
      const existing = this.answers.slice();
      this.answers.clear();
      existing.forEach((answer) => answer.dispose());
      values.forEach((entry) => {
        this.pushAnswer(entry);
      });
    } else {
      const coerced = values[0] ?? null;
      this.ensureBaselineAnswers(true);
      const answer = this.answers[0];
      if (answer) {
        answer.value = coerced;
      }
    }
    this.lifecycle = "expression";
    return true;
  }

  @action
  private applyResponseValues(
    answers: QuestionnaireResponseItemAnswer[] | undefined,
  ): boolean {
    if (!answers || answers.length === 0) {
      return false;
    }

    answers.forEach((answer) => {
      this.pushAnswer(
        getValue(answer, ANSWER_TYPE_TO_DATA_TYPE[this.type]) ?? null,
        answer.item,
      );
    });

    this.lifecycle = "response";
    return true;
  }

  @action
  private applyCalculatedExpressionValue() {
    const calculated = this.expressionRegistry?.calculated;
    if (!calculated) return;

    if (!this.isEnabled || this.lifecycle === "manual") {
      return;
    }

    if (calculated.value === undefined) {
      return;
    }

    // trackWrite bumps the expressions’s pass count and only resets it if we report stability.
    this.form.coordinator.trackWrite(calculated, () => {
      const values = this.normalizeExpressionValues(calculated.value);
      if (values.length === 0 || this.answersMatch(values)) return true;

      if (this.repeats) {
        this.syncRepeatingAnswers(values);
      } else {
        this.ensureBaselineAnswers(true);
        const answer = this.answers[0];
        if (answer) {
          answer.value = values[0] ?? null;
        }
      }
      this.lifecycle = "expression";
      return false;
    });
  }

  private syncRepeatingAnswers(
    values: Array<DataTypeToType<AnswerTypeToDataType<T>> | null>,
  ) {
    while (this.answers.length < values.length && this.canAdd) {
      this.pushAnswer(null);
    }

    while (this.answers.length > values.length && this.canRemove) {
      const removed = this.answers.pop();
      removed?.dispose();
    }

    values.forEach((entry, index) => {
      const answer = this.answers[index];
      if (!answer) return;
      answer.value = entry ?? null;
    });
  }

  private normalizeExpressionValues(value: unknown) {
    const collection = Array.isArray(value) ? value : [value];
    const result: Array<DataTypeToType<AnswerTypeToDataType<T>> | null> = [];
    collection.forEach((entry) => {
      const coerced = this.coerceExpressionValue(entry);
      if (coerced !== undefined) {
        result.push(coerced);
      }
    });
    return result;
  }

  private coerceExpressionValue(
    value: unknown,
  ): DataTypeToType<AnswerTypeToDataType<T>> | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    switch (this.type) {
      case "boolean":
        if (typeof value === "boolean")
          return value as DataTypeToType<AnswerTypeToDataType<T>>;
        if (typeof value === "string") {
          if (/^true$/i.test(value))
            return true as DataTypeToType<AnswerTypeToDataType<T>>;
          if (/^false$/i.test(value))
            return false as DataTypeToType<AnswerTypeToDataType<T>>;
        }
        return undefined;
      case "decimal":
      case "integer": {
        const numberValue = this.parseNumber(value);
        return numberValue as DataTypeToType<AnswerTypeToDataType<T>>;
      }
      case "date":
      case "dateTime":
      case "time":
      case "string":
      case "text":
      case "url":
        if (typeof value === "string") {
          return value as DataTypeToType<AnswerTypeToDataType<T>>;
        }
        return undefined;
      case "coding":
      case "attachment":
      case "reference":
      case "quantity":
        if (typeof value === "object") {
          return value as DataTypeToType<AnswerTypeToDataType<T>>;
        }
        return undefined;
      default:
        return undefined;
    }
  }

  private parseNumber(value: unknown) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  private answersMatch(
    values: Array<DataTypeToType<AnswerTypeToDataType<T>> | null>,
  ) {
    if (this.repeats) {
      if (values.length !== this.answers.length) {
        return false;
      }
      return values.every(
        (entry, index) => this.answers[index]?.value === entry,
      );
    }

    const first = this.answers[0];
    return (values[0] ?? null) === (first?.value ?? null);
  }

  @action
  private markUserOverridden() {
    if (this.lifecycle !== "manual") {
      this.lifecycle = "manual";
    }
  }

  @action
  private pushAnswer(
    initial: DataTypeToType<AnswerTypeToDataType<T>> | null,
    responseItems?: QuestionnaireResponseItem[],
  ) {
    const answer = new AnswerInstance(
      this,
      this.scope,
      this.answers.length,
      initial,
      responseItems,
    );
    this.answers.push(answer);
  }

  @action
  dispose(): void {
    const disposers = this.disposers.splice(0);
    disposers.forEach((dispose) => dispose());

    const existingAnswers = this.answers.slice();
    this.answers.clear();
    existingAnswers.forEach((answer) => answer.dispose());
  }

  @computed.struct
  override get responseItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("response");
  }

  @computed.struct
  override get expressionItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("expression");
  }

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    const answers = this.collectAnswers(kind);

    if (kind === "response") {
      if (!this.isEnabled || answers.length === 0) {
        return [];
      }
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    if (answers.length > 0) {
      item.answer = answers;
    }

    return [item];
  }

  private collectAnswers(
    kind: SnapshotKind,
  ): QuestionnaireResponseItemAnswer[] {
    return this.answers
      .map((answer) =>
        kind === "response" ? answer.responseAnswer : answer.expressionAnswer,
      )
      .filter(
        (answer): answer is QuestionnaireResponseItemAnswer => answer != null,
      );
  }
}

// todo: consider TType in runtime
export function isQuestionNode<TType extends AnswerType = AnswerType>(
  it: IPresentableNode | undefined,
): it is IQuestionNode<TType> {
  return it instanceof QuestionStore;
}
