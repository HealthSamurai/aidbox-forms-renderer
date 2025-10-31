import {
  action,
  comparer,
  computed,
  observable,
  override,
  reaction,
} from "mobx";
import {
  AnswerType,
  AnswerValueType,
  IAnswerInstance,
  ICoreNode,
  IForm,
  INode,
  IQuestionNode,
  IScope,
} from "./types.ts";
import {
  OperationOutcomeIssue,
  Quantity,
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

import { AbstractNodeStore } from "./abstract-node-store.ts";
import { AnswerInstance } from "./answer-instance.ts";

import {
  answerHasContent,
  getDateBounds,
  getDateTimeBounds,
  getDecimalBounds,
  getIntegerBounds,
  getQuantityBounds,
  getTimeBounds,
  getValue,
  isQuantity,
  makeIssue,
} from "../utils.ts";

type AnswerLifecycle =
  | "pristine"
  | "template"
  | "response"
  | "expression"
  | "manual";

export class QuestionStore<T extends AnswerType = AnswerType>
  extends AbstractNodeStore
  implements IQuestionNode<T>
{
  @observable.shallow
  readonly answers = observable.array<IAnswerInstance<AnswerValueType<T>>>([], {
    deep: false,
    name: "QuestionStore.answers",
  });

  @observable
  private lifecycle: AnswerLifecycle = "pristine";

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentKey);

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
    return this.repeats ? (super.maxOccurs ?? Number.POSITIVE_INFINITY) : 1;
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
  addAnswer(initial: AnswerValueType<T> | null = null) {
    if (this.canAdd) {
      this.pushAnswer(initial);
      this.markDirty();
      this.markUserOverridden();
    }
  }

  @action
  removeAnswer(index: number) {
    if (!this.canRemove) return;
    this.answers.splice(index, 1);
    this.ensureBaselineAnswers();
    this.markDirty();
    this.markUserOverridden();
  }

  @action
  setAnswer(index: number, value: AnswerValueType<T> | null) {
    if (index === 0 && this.answers.length === 0) {
      this.ensureBaselineAnswers();
    }

    const answer = this.answers[index];
    if (answer) {
      answer.value = value;
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

  private setupExpressionReactions() {
    const registry = this.expressionRegistry;
    if (!registry) {
      return;
    }

    const { initial, calculated } = registry;
    if (initial) {
      reaction(
        () => [this.isEnabled, initial.value, this.hasContent, this.lifecycle],
        (_arg: unknown, _prev: unknown, reaction) => {
          if (this.applyInitialExpressionValue()) reaction.dispose();
        },
        {
          name: `${this.key}:apply-initial-value-reaction`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      );
    }

    if (calculated) {
      reaction(
        () => [this.isEnabled, this.lifecycle, calculated.value],
        () => this.applyCalculatedExpressionValue(),
        {
          name: `${this.key}:apply-calculated-value-reaction`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      );
    }
  }

  @action
  private applyTemplateInitialValues() {
    const entries = this.template.initial;
    if (!entries || entries.length === 0 || this.answers.length > 0) {
      return;
    }

    const values = entries
      .map((entry) => getValue(entry, this.type))
      .filter(
        (value): value is AnswerValueType<T> =>
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
      this.answers.clear();
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
      this.pushAnswer(getValue(answer, this.type) ?? null, answer.item);
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

  private syncRepeatingAnswers(values: Array<AnswerValueType<T> | null>) {
    while (this.answers.length < values.length && this.canAdd) {
      this.pushAnswer(null);
    }

    while (this.answers.length > values.length && this.canRemove) {
      this.answers.pop();
    }

    values.forEach((entry, index) => {
      const answer = this.answers[index];
      if (!answer) return;
      answer.value = entry ?? null;
    });
  }

  private normalizeExpressionValues(value: unknown) {
    const collection = Array.isArray(value) ? value : [value];
    const result: Array<AnswerValueType<T> | null> = [];
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
  ): AnswerValueType<T> | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    switch (this.type) {
      case "boolean":
        if (typeof value === "boolean") return value as AnswerValueType<T>;
        if (typeof value === "string") {
          if (/^true$/i.test(value)) return true as AnswerValueType<T>;
          if (/^false$/i.test(value)) return false as AnswerValueType<T>;
        }
        return undefined;
      case "decimal":
      case "integer": {
        const numberValue = this.parseNumber(value);
        return numberValue as AnswerValueType<T>;
      }
      case "date":
      case "dateTime":
      case "time":
      case "string":
      case "text":
      case "url":
        if (typeof value === "string") {
          return value as AnswerValueType<T>;
        }
        return undefined;
      case "coding":
      case "attachment":
      case "reference":
      case "quantity":
        if (typeof value === "object") {
          return value as AnswerValueType<T>;
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

  private answersMatch(values: Array<AnswerValueType<T> | null>) {
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

  private resolveNumberBound(
    candidate: unknown,
    fallback: number | undefined,
  ): number | undefined {
    if (Array.isArray(candidate)) {
      const entries: unknown[] = candidate;
      for (let index = entries.length - 1; index >= 0; index -= 1) {
        const parsed = this.parseNumber(entries[index]);
        if (parsed != null) {
          return parsed;
        }
      }
      return fallback;
    }

    const parsed = this.parseNumber(candidate);
    return parsed ?? fallback;
  }

  private resolveStringBound(
    candidate: unknown,
    fallback: string | undefined,
  ): string | undefined {
    if (Array.isArray(candidate)) {
      const entries: unknown[] = candidate;
      for (let index = entries.length - 1; index >= 0; index -= 1) {
        const value = entries[index];
        if (typeof value === "string") {
          return value;
        }
      }
      return fallback;
    }

    if (typeof candidate === "string") {
      return candidate;
    }
    return fallback;
  }

  private resolveQuantityBound(
    candidate: unknown,
    fallback: Quantity | undefined,
  ): Quantity | undefined {
    if (Array.isArray(candidate)) {
      const entries: unknown[] = candidate;
      for (let index = entries.length - 1; index >= 0; index -= 1) {
        const value = entries[index];
        if (value && typeof value === "object" && isQuantity(value)) {
          return value;
        }
      }
      return fallback;
    }

    if (candidate && typeof candidate === "object" && isQuantity(candidate)) {
      return candidate;
    }
    return fallback;
  }

  @action
  private pushAnswer(
    initial: AnswerValueType<T> | null,
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

  protected override computeIssues(): OperationOutcomeIssue[] {
    if (this.readOnly) {
      return [];
    }

    const populatedAnswers = this.answers.filter(answerHasContent);
    const issues: OperationOutcomeIssue[] = [];

    if (this.minOccurs > 0 && populatedAnswers.length < this.minOccurs) {
      issues.push(
        makeIssue(
          "required",
          this.minOccurs === 1
            ? "Answer is required."
            : `At least ${this.minOccurs} answers are required.`,
        ),
      );
    }

    if (populatedAnswers.length > this.maxOccurs) {
      issues.push(
        makeIssue(
          "structure",
          `No more than ${this.maxOccurs} answers are permitted.`,
        ),
      );
    }

    populatedAnswers.forEach((answer, index) => {
      issues.push(...this.validateAnswerValue(answer, index));
    });

    return issues;
  }

  private validateAnswerValue(
    answer: IAnswerInstance<AnswerValueType<T>>,
    index: number,
  ): OperationOutcomeIssue[] {
    // TODO: enforce terminology bindings (answerOption/answerValueSet, open-choice) and attachment/reference specifics.
    switch (this.type) {
      case "string":
      case "text":
        return this.validateStringValue(answer.value, index);
      case "integer": {
        const bounds = getIntegerBounds(this.template);
        const min = this.resolveNumberBound(
          this.expressionRegistry?.minValue?.value,
          bounds.min,
        );
        const max = this.resolveNumberBound(
          this.expressionRegistry?.maxValue?.value,
          bounds.max,
        );
        return this.validateNumericValue(answer.value, index, min, max);
      }
      case "decimal": {
        const bounds = getDecimalBounds(this.template);
        const min = this.resolveNumberBound(
          this.expressionRegistry?.minValue?.value,
          bounds.min,
        );
        const max = this.resolveNumberBound(
          this.expressionRegistry?.maxValue?.value,
          bounds.max,
        );
        return this.validateNumericValue(answer.value, index, min, max);
      }
      case "date": {
        const bounds = getDateBounds(this.template);
        const min = this.resolveStringBound(
          this.expressionRegistry?.minValue?.value,
          bounds.min,
        );
        const max = this.resolveStringBound(
          this.expressionRegistry?.maxValue?.value,
          bounds.max,
        );
        return this.validateComparableValue(answer.value, index, min, max);
      }
      case "dateTime": {
        const bounds = getDateTimeBounds(this.template);
        const min = this.resolveStringBound(
          this.expressionRegistry?.minValue?.value,
          bounds.min,
        );
        const max = this.resolveStringBound(
          this.expressionRegistry?.maxValue?.value,
          bounds.max,
        );
        return this.validateComparableValue(answer.value, index, min, max);
      }
      case "time": {
        const bounds = getTimeBounds(this.template);
        const min = this.resolveStringBound(
          this.expressionRegistry?.minValue?.value,
          bounds.min,
        );
        const max = this.resolveStringBound(
          this.expressionRegistry?.maxValue?.value,
          bounds.max,
        );
        return this.validateComparableValue(answer.value, index, min, max);
      }
      case "quantity": {
        const bounds = getQuantityBounds(this.template);
        const min = this.resolveQuantityBound(
          this.expressionRegistry?.minValue?.value,
          bounds.min,
        );
        const max = this.resolveQuantityBound(
          this.expressionRegistry?.maxValue?.value,
          bounds.max,
        );
        return this.validateQuantityValue(answer.value, index, min, max);
      }
      case "boolean":
        return [];
      case "url":
        // TODO: enforce canonical/regex constraints for URLs when provided.
        return [];
      case "coding":
        return [];
      case "attachment":
        // TODO: enforce attachment size/content-type constraints.
        return [];
      case "reference":
        // TODO: enforce target profile validation for references.
        return [];
      default:
        return [];
    }
  }

  private validateStringValue(
    value: AnswerValueType<T> | null,
    index: number,
  ): OperationOutcomeIssue[] {
    if (typeof value !== "string") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    if (value.trim().length === 0) {
      issues.push(makeIssue("required", "Text answers may not be blank."));
    }

    if (
      this.template.maxLength != null &&
      value.length > this.template.maxLength
    ) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} exceeds the maximum length of ${this.template.maxLength}.`,
        ),
      );
    }

    return issues;
  }

  private validateNumericValue(
    value: AnswerValueType<T> | null,
    index: number,
    min?: number,
    max?: number,
  ): OperationOutcomeIssue[] {
    if (typeof value !== "number") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    if (min != null && value < min) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} must be greater than or equal to ${min}.`,
        ),
      );
    }

    if (max != null && value > max) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} must be less than or equal to ${max}.`,
        ),
      );
    }

    return issues;
  }

  private validateComparableValue(
    value: AnswerValueType<T> | null,
    index: number,
    min?: string,
    max?: string,
  ): OperationOutcomeIssue[] {
    if (typeof value !== "string") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    if (min != null && value < min) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} must not be earlier than ${min}.`,
        ),
      );
    }

    if (max != null && value > max) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} must not be later than ${max}.`,
        ),
      );
    }

    return issues;
  }

  private validateQuantityValue(
    value: AnswerValueType<T> | null,
    index: number,
    min: Quantity | undefined,
    max: Quantity | undefined,
  ): OperationOutcomeIssue[] {
    const quantity = value as Quantity | null;
    if (!quantity || typeof quantity.value !== "number") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];
    if (min?.value != null && quantity.value < min.value) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} must be greater than or equal to ${min.value}.`,
        ),
      );
    }

    if (max?.value != null && quantity.value > max.value) {
      issues.push(
        makeIssue(
          "invalid",
          `Answer #${index + 1} must be less than or equal to ${max.value}.`,
        ),
      );
    }

    return issues;
  }

  @computed
  override get responseItems(): QuestionnaireResponseItem[] {
    if (!this.isEnabled) {
      return [];
    }

    const answers = this.answers
      .map((answer) => answer.responseAnswer)
      .filter(
        (answer): answer is QuestionnaireResponseItemAnswer => answer !== null,
      );

    if (answers.length === 0) {
      return [];
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
      answer: answers,
    };

    return [item];
  }

  @computed
  override get expressionItems(): QuestionnaireResponseItem[] {
    const answers = this.answers
      .map((answer) => answer.expressionAnswer)
      .filter(
        (answer): answer is QuestionnaireResponseItemAnswer =>
          answer !== undefined,
      );

    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    if (answers.length > 0) {
      item.answer = answers;
    }

    return [item];
  }
}

// todo: consider TType in runtime
export function isQuestionNode<TType extends AnswerType = AnswerType>(
  it: ICoreNode | undefined,
): it is IQuestionNode<TType> {
  return it instanceof QuestionStore;
}
