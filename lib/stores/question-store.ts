import { action, comparer, computed, observable, reaction } from "mobx";
import {
  AnswerType,
  AnswerValueType,
  IAnswerInstance,
  IExpressionSlot,
  IFormStore,
  INodeStore,
  IQuestionStore,
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
  EXT,
  findExtension,
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

export class QuestionStore<T extends AnswerType = AnswerType>
  extends AbstractNodeStore
  implements IQuestionStore<T>
{
  @observable.shallow
  readonly answers = observable.array<IAnswerInstance<AnswerValueType<T>>>([], {
    deep: false,
    name: "QuestionStore.answers",
  });

  private initialApplied = false;

  @observable
  private userOverridden = false;

  private initialSlot: IExpressionSlot | undefined;
  private calculatedSlot: IExpressionSlot | undefined;
  private minValueSlot: IExpressionSlot | undefined;
  private maxValueSlot: IExpressionSlot | undefined;

  constructor(
    form: IFormStore,
    template: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentKey);

    const first = responseItems?.at(0);

    if (first?.answer) {
      first.answer.forEach((answer) => {
        this.pushAnswer(getValue(answer, this.type) ?? null, answer.item);
      });
    }

    this.ensureBaselineAnswers();
    this.initializeQuestionExpressions();
    this.detectInitialOverride();
    this.setupExpressionReactions();
  }

  override get type() {
    return super.type as T;
  }

  @computed
  get hasChildren() {
    return (this.template.item?.length ?? 0) > 0;
  }

  private maxAllowed(): number {
    return this.repeats ? (this.maxOccurs ?? Number.POSITIVE_INFINITY) : 1;
    // Note: minOccurs is enforced by canRemove / seeding, not here.
  }

  @computed
  get canAdd() {
    return !this.readOnly && this.answers.length < this.maxAllowed();
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
  private ensureBaselineAnswers() {
    if (this.repeats) {
      while (this.answers.length < this.minOccurs && this.canAdd) {
        this.pushAnswer(null);
      }
      return;
    }

    if (this.answers.length === 0 && this.canAdd) {
      this.pushAnswer(null);
    }
  }

  private initializeQuestionExpressions() {
    const initialExpression = findExtension(
      this.template,
      EXT.SDC_INITIAL_EXPR,
    )?.valueExpression;

    if (initialExpression) {
      this.initialSlot = this.createExpressionSlot(
        initialExpression,
        "initial",
      );
    }

    const calculatedExpression = findExtension(
      this.template,
      EXT.SDC_CALCULATED_EXPR,
    )?.valueExpression;

    if (calculatedExpression) {
      this.calculatedSlot = this.createExpressionSlot(
        calculatedExpression,
        "calculated",
      );
    }

    const minExpression = findExtension(
      this.template,
      EXT.SDC_MIN_VALUE_EXPR,
    )?.valueExpression;

    if (minExpression) {
      this.minValueSlot = this.createExpressionSlot(minExpression, "min-value");
    }

    const maxExpression = findExtension(
      this.template,
      EXT.SDC_MAX_VALUE_EXPR,
    )?.valueExpression;

    if (maxExpression) {
      this.maxValueSlot = this.createExpressionSlot(maxExpression, "max-value");
    }
  }

  @computed
  private get hasContent() {
    return this.answers.some(answerHasContent);
  }

  private detectInitialOverride() {
    if (!this.calculatedSlot || this.readOnly) {
      return;
    }

    if (!this.hasContent) {
      return;
    }

    const calculated = this.normalizeExpressionValues(
      this.calculatedSlot.value,
    );
    if (calculated.length === 0 || !this.answersMatch(calculated)) {
      this.markUserOverridden();
    }
  }

  private setupExpressionReactions() {
    const { initialSlot, calculatedSlot } = this;
    if (initialSlot) {
      reaction(
        () => [this.isEnabled, initialSlot.value, this.hasContent],
        this.applyInitialValue,
        {
          name: `${this.key}:apply-initial-value-reaction`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      );
    }

    if (calculatedSlot) {
      reaction(
        () => [this.isEnabled, this.userOverridden, calculatedSlot.value],
        this.applyCalculatedValue,
        {
          name: `${this.key}:apply-calculated-value-reaction`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      );
    }
  }

  @action.bound
  private applyInitialValue() {
    const { initialSlot } = this;
    if (!initialSlot) return;

    if (!this.isEnabled || this.initialApplied) {
      return;
    }

    if (this.hasContent) {
      this.initialApplied = true;
      return;
    }

    if (initialSlot.value === undefined) {
      return;
    }

    const values = this.normalizeExpressionValues(initialSlot.value);
    if (values.length === 0) {
      return;
    }

    if (this.repeats) {
      this.answers.clear();
      values.forEach((entry) => {
        this.pushAnswer(entry);
      });
    } else {
      const coerced = values[0] ?? null;
      this.ensureBaselineAnswers();
      const answer = this.answers[0];
      if (answer) {
        answer.value = coerced;
      }
    }
    this.initialApplied = true;
  }

  @action.bound
  private applyCalculatedValue() {
    const { calculatedSlot } = this;
    if (!calculatedSlot) return;

    if (!this.isEnabled || this.userOverridden) {
      return;
    }

    if (calculatedSlot.value === undefined) {
      return;
    }

    // trackWrite bumps the slot’s pass count and only resets it if we report stability.
    this.form.recalcCoordinator.trackWrite(calculatedSlot, () => {
      const values = this.normalizeExpressionValues(calculatedSlot.value);
      if (values.length === 0 || this.answersMatch(values)) return true;

      if (this.repeats) {
        this.syncRepeatingAnswers(values);
      } else {
        this.ensureBaselineAnswers();
        const answer = this.answers[0];
        if (answer) {
          answer.value = values[0];
        }
      }
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
    if (!this.userOverridden) {
      this.userOverridden = true;
    }
  }

  private resolveNumberBound(
    candidate: unknown,
    fallback: number | undefined,
  ): number | undefined {
    if (Array.isArray(candidate)) {
      for (let index = candidate.length - 1; index >= 0; index -= 1) {
        const parsed = this.parseNumber(candidate[index]);
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
      for (let index = candidate.length - 1; index >= 0; index -= 1) {
        const value = candidate[index];
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
      for (let index = candidate.length - 1; index >= 0; index -= 1) {
        const value = candidate[index];
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

    if (this.maxOccurs != null && populatedAnswers.length > this.maxOccurs) {
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
          this.minValueSlot?.value,
          bounds.min,
        );
        const max = this.resolveNumberBound(
          this.maxValueSlot?.value,
          bounds.max,
        );
        return this.validateNumericValue(answer.value, index, min, max);
      }
      case "decimal": {
        const bounds = getDecimalBounds(this.template);
        const min = this.resolveNumberBound(
          this.minValueSlot?.value,
          bounds.min,
        );
        const max = this.resolveNumberBound(
          this.maxValueSlot?.value,
          bounds.max,
        );
        return this.validateNumericValue(answer.value, index, min, max);
      }
      case "date": {
        const bounds = getDateBounds(this.template);
        const min = this.resolveStringBound(
          this.minValueSlot?.value,
          bounds.min,
        );
        const max = this.resolveStringBound(
          this.maxValueSlot?.value,
          bounds.max,
        );
        return this.validateComparableValue(answer.value, index, min, max);
      }
      case "dateTime": {
        const bounds = getDateTimeBounds(this.template);
        const min = this.resolveStringBound(
          this.minValueSlot?.value,
          bounds.min,
        );
        const max = this.resolveStringBound(
          this.maxValueSlot?.value,
          bounds.max,
        );
        return this.validateComparableValue(answer.value, index, min, max);
      }
      case "time": {
        const bounds = getTimeBounds(this.template);
        const min = this.resolveStringBound(
          this.minValueSlot?.value,
          bounds.min,
        );
        const max = this.resolveStringBound(
          this.maxValueSlot?.value,
          bounds.max,
        );
        return this.validateComparableValue(answer.value, index, min, max);
      }
      case "quantity": {
        const bounds = getQuantityBounds(this.template);
        const min = this.resolveQuantityBound(
          this.minValueSlot?.value,
          bounds.min,
        );
        const max = this.resolveQuantityBound(
          this.maxValueSlot?.value,
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
