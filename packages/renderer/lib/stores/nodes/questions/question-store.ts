import type { IReactionDisposer } from "mobx";
import {
  action,
  comparer,
  computed,
  observable,
  override,
  reaction,
} from "mobx";
import {
  AnswerLifecycle,
  AnswerType,
  type AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  IAnswerOptions,
  IForm,
  INode,
  IPresentableNode,
  IQuestionNode,
  IScope,
  QUESTION_ITEM_CONTROLS,
  type QuestionControlDefinition,
  type QuestionItemControl,
  SnapshotKind,
} from "../../../types.ts";
import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

import { AbstractActualNodeStore } from "../base/abstract-actual-node-store.ts";
import { AnswerInstance } from "./answer-instance.ts";
import { QuestionValidator } from "../../validation/question-validator.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  booleanify,
  EXT,
  extractExtensionsValues,
  extractExtensionValue,
  getItemControlCode,
  getValue,
  normalizeExpressionValues,
  withQuestionnaireResponseItemMeta,
} from "../../../utils.ts";
import type { HTMLAttributes } from "react";
import { NodeExpressionRegistry } from "../../expressions/node-expression-registry.ts";
import { AnswerOptionStore } from "./answer-option-store.ts";

export class QuestionStore<T extends AnswerType = AnswerType>
  extends AbstractActualNodeStore
  implements IQuestionNode<T>
{
  readonly expressionRegistry: NodeExpressionRegistry;

  readonly answers = observable.array<IAnswerInstance<T>>([], {
    deep: false,
    name: "QuestionStore.answers",
  });

  @observable
  private lifecycle: AnswerLifecycle = "pristine";

  private readonly disposers: IReactionDisposer[] = [];

  private lastIndex = 0;

  @computed
  get renderer(): QuestionControlDefinition["renderer"] | undefined {
    return this.form.questionControlRegistry.resolve(this)?.renderer;
  }

  @computed
  get minLength(): number | undefined {
    return extractExtensionValue(this.template, EXT.MIN_LENGTH, "integer");
  }

  @computed
  get maxLength(): number | undefined {
    return this.template.maxLength;
  }

  @computed
  get maxDecimalPlaces(): number | undefined {
    return extractExtensionValue(
      this.template,
      EXT.MAX_DECIMAL_PLACES,
      "integer",
    );
  }

  @computed
  get mimeTypes(): readonly string[] {
    if (this.type !== "attachment") {
      return [];
    }

    return extractExtensionsValues(this.template, EXT.MIME_TYPE, "code");
  }

  @computed
  get maxSize(): number | undefined {
    if (this.type !== "attachment") {
      return undefined;
    }

    return extractExtensionValue(this.template, EXT.MAX_SIZE, "decimal");
  }

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    scope: IScope,
    token: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, scope, token);

    this.expressionRegistry = new NodeExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      template,
      this.template.type as AnswerType,
    );

    this.validator = new QuestionValidator(this);

    if (!this.applyResponseValues(responseItem?.answer)) {
      this.applyTemplateInitialValues();
    }
    this.setupBaselineAnswerReaction();
    this.detectInitialOverride();
    this.setupExpressionReactions();
  }

  @computed
  get type() {
    return this.template.type as T;
  }

  @computed
  get control(): QuestionItemControl | undefined {
    const control = getItemControlCode(this.template);
    return control &&
      QUESTION_ITEM_CONTROLS.includes(control as QuestionItemControl)
      ? (control as QuestionItemControl)
      : undefined;
  }

  @computed
  get repeats() {
    const slot = this.expressionRegistry.repeats;
    if (slot) {
      return booleanify(slot.value);
    }

    return !!this.template.repeats;
  }

  @computed
  get isRepeatingWithoutChildren(): boolean {
    const hasChildren =
      Array.isArray(this.template.item) && this.template.item.length > 0;
    return this.repeats && !hasChildren;
  }

  @computed
  get keyboardType(): HTMLAttributes<Element>["inputMode"] | undefined {
    if (this.type !== "string" && this.type !== "text") {
      return undefined;
    }

    const coding = extractExtensionValue(
      this.template,
      EXT.SDC_KEYBOARD,
      "Coding",
    );

    const keyboardMap: Record<string, HTMLAttributes<Element>["inputMode"]> = {
      phone: "tel",
      email: "email",
      number: "numeric",
      url: "url",
      chat: "text",
    };

    return coding?.code ? keyboardMap[coding.code] : undefined;
  }

  @computed({ keepAlive: true })
  get answerOption(): IAnswerOptions<T> {
    return new AnswerOptionStore<T>(this);
  }

  @override
  override get issues() {
    return this.answerOption.error
      ? [...super.issues, this.answerOption.error]
      : super.issues;
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
  addAnswer(
    initial: DataTypeToType<AnswerTypeToDataType<T>> | null = null,
  ): IAnswerInstance | undefined {
    if (!this.canAdd) return undefined;
    this.markDirty();
    this.markUserOverridden();
    return this.pushAnswer(initial);
  }

  @action
  removeAnswer(answer: IAnswerInstance<T>) {
    if (!this.canRemove) return;
    const index = this.answers.indexOf(answer);
    if (index < 0) return;
    const [removed] = this.answers.splice(index, 1);
    removed?.dispose();
    this.ensureBaselineAnswers();
    this.markDirty();
    this.markUserOverridden();
  }

  @action
  private ensureBaselineAnswers(force = false) {
    const canSeed =
      force ||
      this.canAdd ||
      (this.readOnly && this.answers.length < this.maxOccurs);

    if (this.repeats) {
      const target = Math.min(this.minOccurs, this.maxOccurs);
      while (this.answers.length < target && canSeed) {
        this.pushAnswer(null);
      }
      return;
    }

    if (this.answers.length === 0 && canSeed) {
      this.pushAnswer(null);
    }
  }

  @computed
  private get hasContent() {
    const answers = this.repeats ? this.answers : this.answers.slice(0, 1);
    return answers.some(answerHasContent);
  }

  private detectInitialOverride() {
    if (
      !this.expressionRegistry.calculated ||
      this.readOnly ||
      this.lifecycle !== "response"
    ) {
      return;
    }

    if (!this.hasContent) {
      return;
    }

    const calculated = normalizeExpressionValues(
      this.type,
      this.expressionRegistry.calculated.value,
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

  private setupBaselineAnswerReaction() {
    this.trackDisposer(
      reaction(
        () => [this.canAdd, this.minOccurs, this.repeats, this.answers.length],
        () => this.ensureBaselineAnswers(),
        {
          name: `${this.token}:ensure-baseline-answers`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      ),
    );
  }

  private setupExpressionReactions() {
    const { initial, calculated } = this.expressionRegistry;
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
          name: `${this.token}:apply-initial-value-reaction`,
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
          name: `${this.token}:apply-calculated-value-reaction`,
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
      .map((entry) => {
        const value = getValue(entry, ANSWER_TYPE_TO_DATA_TYPE[this.type]);
        if (
          value === undefined &&
          this.answerOption.constraint === "optionsOrString"
        ) {
          return getValue(entry, "string");
        }
        return value;
      })
      .filter(
        (value): value is DataTypeToType<AnswerTypeToDataType<T>> | string => {
          return value != null;
        },
      );

    if (values.length === 0) {
      return;
    }

    let seeded = false;

    if (this.repeats) {
      const cappedLength = Math.min(values.length, this.maxOccurs);
      for (let index = 0; index < cappedLength; index += 1) {
        this.pushAnswer(
          structuredClone(values[index]) as DataTypeToType<
            AnswerTypeToDataType<T>
          >,
        );
        seeded = true;
      }
    } else {
      this.ensureBaselineAnswers(true);
      const answer = this.answers[0];
      if (!answer) {
        return;
      }

      answer.setValueBySystem(
        structuredClone(values[0]) as DataTypeToType<AnswerTypeToDataType<T>>,
      );
      seeded = true;
    }

    if (seeded) {
      this.lifecycle = "template";
    }
  }

  @action
  private applyInitialExpressionValue() {
    const initial = this.expressionRegistry.initial;
    if (!initial || !this.isEnabled) return false;

    const seededContent = this.lifecycle === "template";
    if (this.hasContent && !seededContent) return true;
    if (initial.value === undefined) return false;

    const values = normalizeExpressionValues(this.type, initial.value);
    if (values.length === 0) return false;

    if (this.repeats) {
      const cappedValues = Number.isFinite(this.maxOccurs)
        ? values.slice(0, this.maxOccurs)
        : values;

      const existing = this.answers.slice();
      this.answers.clear();
      existing.forEach((answer) => answer.dispose());
      cappedValues.forEach((entry) => {
        this.pushAnswer(entry);
      });
    } else {
      const coerced = values[0] ?? null;
      this.ensureBaselineAnswers(true);
      const answer = this.answers[0];
      if (answer) {
        answer.setValueBySystem(coerced);
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
      const typedValue = getValue(answer, ANSWER_TYPE_TO_DATA_TYPE[this.type]);
      const stringValue =
        this.answerOption.constraint === "optionsOrString"
          ? getValue(answer, "string")
          : undefined;
      this.pushAnswer(
        (typedValue ?? stringValue ?? null) as DataTypeToType<
          AnswerTypeToDataType<T>
        >,
        answer.item,
      );
    });

    this.lifecycle = "response";
    return true;
  }

  @action
  private applyCalculatedExpressionValue() {
    const calculated = this.expressionRegistry.calculated;
    if (!calculated) return;

    if (!this.isEnabled || this.lifecycle === "manual") {
      return;
    }

    if (calculated.value === undefined) {
      return;
    }

    // trackWrite bumps the expressions’s pass count and only resets it if we report stability.
    this.form.coordinator.trackWrite(calculated, () => {
      const values = normalizeExpressionValues(this.type, calculated.value);
      if (values.length === 0 || this.answersMatch(values)) return true;

      if (this.repeats) {
        this.syncRepeatingAnswers(values);
      } else {
        this.ensureBaselineAnswers(true);
        const answer = this.answers[0];
        if (answer) {
          answer.setValueBySystem(values[0] ?? null);
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
      answer.setValueBySystem(entry ?? null);
    });
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
  public markUserOverridden() {
    this.lifecycle = "manual";
  }

  @action
  private pushAnswer(
    initial: DataTypeToType<AnswerTypeToDataType<T>> | null,
    responseItems?: QuestionnaireResponseItem[],
  ) {
    const answer = new AnswerInstance(
      this,
      this.scope,
      `${this.token}_/_${this.lastIndex++}`,
      initial,
      responseItems,
    );
    this.answers.push(answer);
    return answer;
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

    const item = withQuestionnaireResponseItemMeta({
      linkId: this.linkId,
      text: kind === "expression" ? this.template.text : this.text,
    });

    if (answers.length > 0) {
      item.answer = answers;
    }

    return [item];
  }

  private collectAnswers(
    kind: SnapshotKind,
  ): QuestionnaireResponseItemAnswer[] {
    const answers =
      kind === "expression"
        ? this.answers
        : this.repeats
          ? this.answers
          : this.answers.slice(0, 1);
    return answers
      .map((answer) =>
        kind === "response" ? answer.responseAnswer : answer.expressionAnswer,
      )
      .filter(
        (answer): answer is QuestionnaireResponseItemAnswer => answer != null,
      );
  }
}

export function isQuestionNode<TType extends AnswerType = AnswerType>(
  it: IPresentableNode | undefined | null,
): it is IQuestionNode<TType> {
  return it instanceof QuestionStore;
}

export function assertQuestionNode<TType extends AnswerType = AnswerType>(
  it: IPresentableNode | undefined | null,
  message?: string,
): asserts it is IQuestionNode<TType> {
  if (!isQuestionNode(it)) {
    throw new TypeError(message ?? "Expected QuestionNode instance");
  }
}
