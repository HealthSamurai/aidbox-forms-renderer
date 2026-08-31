import type { IReactionDisposer } from "mobx";
import {
  action,
  comparer,
  computed,
  makeObservable,
  observable,
  override,
  reaction,
} from "mobx";
import {
  AnswerLifecycle,
  AnswerType,
  type AnswerTypeToDataType,
  ChoiceOrientation,
  DataTypeToType,
  HasNodePath,
  IAnswer,
  IAnswerOptions,
  IForm,
  INode,
  IPresentableNode,
  IQuestionNode,
  IScope,
  IUnitOptions,
  QUESTION_ITEM_CONTROLS,
  type QuestionItemControl,
  QuestionRendererComponent,
  SnapshotKind,
} from "../../types.ts";
import type {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
  Signature,
} from "@formbox/fhir";

import { AbstractActualNodeStore } from "../base/abstract-actual-node-store.ts";
import { AnswerStore } from "../answer/answer-store.ts";
import { QuestionValidator } from "./question-validator.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasOwnValue,
  booleanify,
  buildId,
  EXT,
  extractExtensionsValues,
  extractExtensionValue,
  findExtension,
  getIssueMessage,
  getItemControlCode,
  getTranslated,
  getValue,
  normalizeExpressionValues,
  type PolyCarrierFor,
} from "../../utilities.ts";
import type { HTMLAttributes } from "react";
import { NodeExpressionRegistry } from "../expression/registry/node-expression-registry.ts";
import { AnswerOptionStore } from "../option/answer-option-store.ts";
import { UnitOptionStore } from "../option/unit-option-store.ts";

export class QuestionStore<T extends AnswerType = AnswerType>
  extends AbstractActualNodeStore
  implements IQuestionNode<T>
{
  readonly expressionRegistry: NodeExpressionRegistry;

  readonly answers = observable.array<IAnswer<T>>([], {
    deep: false,
    name: "QuestionStore.answers",
  });

  @observable
  private lifecycle: AnswerLifecycle = "pristine";

  @observable.ref
  private signatureState: Signature | undefined;

  private readonly disposers: IReactionDisposer[] = [];

  private lastIndex = 0;

  @computed
  get renderer(): QuestionRendererComponent<T> | undefined {
    return this.form.questionRendererRegistry.resolve(this)?.renderer;
  }

  @computed
  get minLength(): number | undefined {
    return extractExtensionValue("integer", this.template, EXT.MIN_LENGTH);
  }

  @computed
  get maxLength(): number | undefined {
    return this.template.maxLength;
  }

  @computed
  get maxDecimalPlaces(): number | undefined {
    return extractExtensionValue(
      "integer",
      this.template,
      EXT.MAX_DECIMAL_PLACES,
    );
  }

  @computed
  get mimeTypes(): readonly string[] {
    if (this.type !== "attachment") {
      return [];
    }

    return extractExtensionsValues("code", this.template, EXT.MIME_TYPE);
  }

  @computed
  get maxSize(): number | undefined {
    if (this.type !== "attachment") {
      return undefined;
    }

    return extractExtensionValue("decimal", this.template, EXT.MAX_SIZE);
  }

  @computed
  get signature(): Signature | undefined {
    return this.signatureState;
  }

  @action
  setSignature(signature: Signature | undefined): void {
    this.signatureState = signature;
  }

  @computed
  get signatureRequired(): boolean {
    return (
      findExtension(this.template, EXT.SIGNATURE_REQUIRED) != undefined &&
      this.isEnabled &&
      this.collectAnswers("response").length > 0
    );
  }

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | undefined,
    pathParent: HasNodePath | undefined,
    scope: IScope,
    token: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, pathParent, scope, token);
    this.signatureState = responseItem
      ? extractExtensionsValues(
          "Signature",
          responseItem,
          EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
        )[0]
      : undefined;
    makeObservable(this);

    this.expressionRegistry = new NodeExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      template,
      this.adapter.questionnaireItem.getType(template) as AnswerType,
    );

    this.validator = new QuestionValidator(this);

    if (!this.applyResponseValues(responseItem?.answer)) {
      this.applyTemplateInitialValues();
    }
    this.setupBaselineAnswerReaction();
    this.detectInitialOverride();
    this.setupExpressionReactions();
  }

  @override
  override get type() {
    return super.type as T;
  }

  @computed
  get dataType(): AnswerTypeToDataType<T> {
    return ANSWER_TYPE_TO_DATA_TYPE[this.type];
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
      "Coding",
      this.template,
      EXT.SDC_KEYBOARD,
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

  @computed
  get openLabel(): string | undefined {
    return getTranslated(
      findExtension(this.template, EXT.SDC_OPEN_LABEL),
      "valueString",
      this.form.language,
    );
  }

  @computed
  get columnWidth(): string | undefined {
    const quantity = extractExtensionValue(
      "Quantity",
      this.template,
      EXT.SDC_WIDTH,
    );
    const value = quantity?.value;
    const code = quantity?.code;

    if (typeof value !== "number") {
      return undefined;
    }

    if (code === "%") {
      return `${value}%`;
    }

    if (code === undefined) {
      return `${value}px`;
    }

    return undefined;
  }

  @computed
  get choiceOrientation(): ChoiceOrientation | undefined {
    const code = extractExtensionValue(
      "code",
      this.template,
      EXT.CHOICE_ORIENTATION,
    );
    return code as ChoiceOrientation | undefined;
  }

  @computed({ keepAlive: true })
  get answerOption(): IAnswerOptions<T> {
    return new AnswerOptionStore<T>(this);
  }

  @computed({ keepAlive: true })
  get unitOption(): T extends "quantity" ? IUnitOptions : undefined {
    return (
      this.type === "quantity"
        ? new UnitOptionStore(this as IQuestionNode<"quantity">)
        : undefined
    ) as T extends "quantity" ? IUnitOptions : undefined;
  }

  @computed
  get hasOptions(): boolean {
    return !!(
      this.template.answerOption?.length ||
      this.expressionRegistry.answer ||
      this.expressionRegistry.answerValueSet ||
      this.template.answerValueSet
    );
  }

  @override
  override get issues(): OperationOutcomeIssue[] {
    const issues: OperationOutcomeIssue[] = [
      ...super.issues,
      ...this.answerOption.issues,
      ...(this.unitOption?.issues ?? []),
    ];
    return issues.filter((issue) => getIssueMessage(issue) !== undefined);
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
    initial?: DataTypeToType<AnswerTypeToDataType<T>>,
  ): IAnswer | undefined {
    if (!this.canAdd) return;
    this.markDirty();
    this.markUserOverridden();
    return this.pushAnswer(initial);
  }

  @action
  removeAnswer(answer: IAnswer<T>) {
    if (!this.canRemove) return;
    const index = this.answers.indexOf(answer);
    if (index === -1) return;
    const [removed] = this.answers.splice(index, 1);
    removed?.dispose();
    this.ensureBaselineAnswers();
    this.reindexAnswerPaths();
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
        this.pushAnswer();
      }
      return;
    }

    if (this.answers.length === 0 && canSeed) {
      this.pushAnswer();
    }
  }

  @override
  override get hasResponseContent(): boolean {
    const answers = this.repeats ? this.answers : this.answers.slice(0, 1);
    return answers.some((answer) => this.hasAnswerContent(answer));
  }

  private hasAnswerContent(answer: IAnswer<T>): boolean {
    return (
      answerHasOwnValue(answer) ||
      answer.nodes.some((child) => child.hasResponseContent)
    );
  }

  private detectInitialOverride() {
    if (
      !this.expressionRegistry.calculated ||
      this.readOnly ||
      this.lifecycle !== "response"
    ) {
      return;
    }

    if (!this.hasResponseContent) {
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
    if (index !== -1) {
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
        () => [
          this.isEnabled,
          initial.value,
          this.hasResponseContent,
          this.lifecycle,
        ],
        (_argument: unknown, _previous: unknown, reaction) => {
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
    if (this.answers.length > 0) {
      return;
    }

    const entries: Array<PolyCarrierFor<"value", AnswerTypeToDataType<T>>> =
      this.template.answerOption && this.template.answerOption.length > 0
        ? this.template.answerOption.filter(
            (option) => option.initialSelected === true,
          )
        : (this.template.initial ?? []);

    const values = entries
      .map((entry) => {
        const value = getValue(ANSWER_TYPE_TO_DATA_TYPE[this.type], entry);
        if (
          value === undefined &&
          this.answerOption.constraint === "optionsOrString"
        ) {
          return getValue("string", entry);
        }
        return value;
      })
      .filter(
        (value): value is DataTypeToType<AnswerTypeToDataType<T>> | string =>
          value != undefined,
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
    if (this.hasResponseContent && !seededContent) return true;
    if (initial.value === undefined) return false;

    const values = normalizeExpressionValues(this.type, initial.value);
    if (values.length === 0) return false;

    if (this.repeats) {
      const cappedValues = Number.isFinite(this.maxOccurs)
        ? values.slice(0, this.maxOccurs)
        : values;

      const existing = [...this.answers];
      this.answers.clear();
      existing.forEach((answer) => answer.dispose());
      cappedValues.forEach((entry) => {
        this.pushAnswer(entry);
      });
    } else {
      const coerced = values[0] ?? undefined;
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
      const typedValue = getValue(ANSWER_TYPE_TO_DATA_TYPE[this.type], answer);
      const stringValue =
        this.answerOption.constraint === "optionsOrString"
          ? getValue("string", answer)
          : undefined;
      this.pushAnswer(
        (typedValue ?? stringValue ?? undefined) as DataTypeToType<
          AnswerTypeToDataType<T>
        >,
        answer.item,
        answer,
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
          answer.setValueBySystem(values[0] ?? undefined);
        }
      }
      this.lifecycle = "expression";
      return false;
    });
  }

  private syncRepeatingAnswers(
    values: Array<DataTypeToType<AnswerTypeToDataType<T>> | undefined>,
  ) {
    this.setAnswersBySystem(values);
  }

  @action
  setAnswersBySystem(
    values: ReadonlyArray<DataTypeToType<AnswerTypeToDataType<T>> | undefined>,
  ): void {
    const target = Math.min(values.length, this.maxOccurs);
    while (this.answers.length < target) {
      this.pushAnswer();
    }

    while (
      this.answers.length > target &&
      this.answers.length > this.minOccurs
    ) {
      const removed = this.answers.pop();
      removed?.dispose();
    }

    values.forEach((entry, index) => {
      const answer = this.answers[index];
      if (!answer) return;
      answer.setValueBySystem(entry);
    });
    this.reindexAnswerPaths();
  }

  private answersMatch(
    values: Array<DataTypeToType<AnswerTypeToDataType<T>> | undefined>,
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
    return (values[0] ?? undefined) === (first?.value ?? undefined);
  }

  @action
  public markUserOverridden() {
    this.lifecycle = "manual";
  }

  @action
  private pushAnswer(
    initial?: DataTypeToType<AnswerTypeToDataType<T>>,
    responseItems?: QuestionnaireResponseItem[],
    responseAnswer?: QuestionnaireResponseItemAnswer,
  ) {
    const answer = new AnswerStore(
      this,
      this.answers.length,
      this.scope,
      buildId(this.token, this.lastIndex++),
      initial,
      responseItems,
      responseAnswer,
    );
    this.answers.push(answer);
    return answer;
  }

  private reindexAnswerPaths(): void {
    this.answers.forEach((answer, index) => {
      (answer as AnswerStore<T>).setPathIndex(index);
    });
  }

  @action
  dispose(): void {
    const disposers = this.disposers.splice(0);
    disposers.forEach((dispose) => dispose());

    const existingAnswers = [...this.answers];
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

  override clearDirty(): void {
    super.clearDirty();
    this.answers.clear();
  }

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    const answers = this.collectAnswers(kind);

    if (kind === "response" && (!this.isEnabled || answers.length === 0)) {
      return [];
    }

    const item = this.adapter.withQuestionnaireResponseItemMeta({
      linkId: this.linkId,
      text: kind === "expression" ? this.template.text : this.text,
    });

    if (answers.length > 0) {
      item.answer = answers;
    }

    if (
      kind === "response" &&
      this.signatureRequired &&
      this.signature != undefined &&
      answers.length > 0
    ) {
      item.extension = [
        {
          url: EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
          valueSignature: this.signature,
        },
      ];
    }

    return [item];
  }

  private collectAnswers(
    kind: SnapshotKind,
  ): QuestionnaireResponseItemAnswer[] {
    const sourceAnswers =
      kind === "expression" || this.repeats
        ? this.answers
        : this.answers.slice(0, 1);

    return sourceAnswers
      .map((answer) =>
        kind === "response" ? answer.responseAnswer : answer.expressionAnswer,
      )
      .filter(
        (answer): answer is QuestionnaireResponseItemAnswer =>
          answer != undefined,
      );
  }
}

export function isQuestionNode<TType extends AnswerType = AnswerType>(
  it: IPresentableNode | undefined,
): it is IQuestionNode<TType> {
  return it instanceof QuestionStore;
}

export function assertQuestionNode<TType extends AnswerType = AnswerType>(
  it: IPresentableNode | undefined,
  message?: string,
): asserts it is IQuestionNode<TType> {
  if (!isQuestionNode(it)) {
    throw new TypeError(message ?? "Expected QuestionNode instance");
  }
}
