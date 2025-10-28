import { action, computed, observable } from "mobx";
import {
  AnswerableQuestionType,
  AnswerValueFor,
  IAnswerInstance,
  IFormStore,
  INodeScope,
  INodeStore,
  IQuestionStore,
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
  makeIssue,
} from "../utils.ts";

export class QuestionStore<
    T extends AnswerableQuestionType = AnswerableQuestionType,
  >
  extends AbstractNodeStore
  implements IQuestionStore<T>
{
  @observable.shallow
  readonly answers = observable.array<IAnswerInstance<AnswerValueFor<T>>>([], {
    deep: false,
    name: "QuestionStore.answers",
  });

  constructor(
    form: IFormStore,
    template: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: INodeScope,
    parentPath: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentPath);

    const first = responseItems?.at(0);

    if (first?.answer) {
      first.answer.forEach((answer) => {
        this.pushAnswer(getValue(answer, this.type) ?? null, answer.item);
      });
    }

    this.ensureBaselineAnswers();
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
  addAnswer(initial: AnswerValueFor<T> | null = null) {
    if (this.canAdd) {
      this.pushAnswer(initial);
      this.markDirty();
    }
  }

  @action
  removeAnswer(index: number) {
    if (!this.canRemove) return;
    this.answers.splice(index, 1);
    this.ensureBaselineAnswers();
    this.markDirty();
  }

  @action
  setAnswer(index: number, value: AnswerValueFor<T> | null) {
    if (index === 0 && this.answers.length === 0) {
      this.ensureBaselineAnswers();
    }

    const answer = this.answers[index];
    if (answer) {
      answer.value = value;
      this.markDirty();
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

  @action
  private pushAnswer(
    initial: AnswerValueFor<T> | null,
    responseItems?: QuestionnaireResponseItem[],
  ) {
    const answer = new AnswerInstance(
      this,
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
    answer: IAnswerInstance<AnswerValueFor<T>>,
    index: number,
  ): OperationOutcomeIssue[] {
    // TODO: enforce terminology bindings (answerOption/answerValueSet, open-choice) and attachment/reference specifics.
    switch (this.type) {
      case "string":
      case "text":
        return this.validateStringValue(answer.value, index);
      case "integer": {
        const bounds = getIntegerBounds(this.template);
        return this.validateNumericValue(
          answer.value,
          index,
          bounds.min,
          bounds.max,
        );
      }
      case "decimal": {
        const bounds = getDecimalBounds(this.template);
        return this.validateNumericValue(
          answer.value,
          index,
          bounds.min,
          bounds.max,
        );
      }
      case "date": {
        const bounds = getDateBounds(this.template);
        return this.validateComparableValue(
          answer.value,
          index,
          bounds.min,
          bounds.max,
        );
      }
      case "dateTime": {
        const bounds = getDateTimeBounds(this.template);
        return this.validateComparableValue(
          answer.value,
          index,
          bounds.min,
          bounds.max,
        );
      }
      case "time": {
        const bounds = getTimeBounds(this.template);
        return this.validateComparableValue(
          answer.value,
          index,
          bounds.min,
          bounds.max,
        );
      }
      case "quantity": {
        const bounds = getQuantityBounds(this.template);
        return this.validateQuantityValue(
          answer.value,
          index,
          bounds.min,
          bounds.max,
        );
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
    value: AnswerValueFor<T> | null,
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
    value: AnswerValueFor<T> | null,
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
    value: AnswerValueFor<T> | null,
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
    value: AnswerValueFor<T> | null,
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
}
