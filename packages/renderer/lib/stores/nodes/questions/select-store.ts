import { action, computed, makeObservable, observable } from "mobx";
import {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
  ISelectStore,
  ResolvedAnswerOption,
  SelectCheckboxState,
  SelectChipItem,
  SelectDialogState,
  SelectPendingDialog,
  ValueControlProps,
} from "../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  areValuesEqual,
  cloneValue,
  getAnswerErrorId,
  getNodeDescribedBy,
  getNodeLabelId,
  sanitizeForId,
} from "../../../utils.ts";

const BOOLEAN_FALLBACK_OPTIONS: Array<ResolvedAnswerOption<"boolean">> = [
  {
    token: "yes",
    value: true,
    disabled: false,
  },
  {
    token: "no",
    value: false,
    disabled: false,
  },
];

export class SelectStore<
  T extends AnswerType = AnswerType,
> implements ISelectStore<T> {
  readonly node: IQuestionNode<T>;

  @observable
  private isCustomSelected = false;

  @observable.ref
  private pendingCustomAnswerTokens = new Set<string>();

  @observable
  pendingSelectToken = "";

  @observable
  private pendingCustomDialog: SelectPendingDialog<T> | null = null;

  constructor(node: IQuestionNode<T>) {
    this.node = node;
    makeObservable(this);
  }

  @computed
  get hasChildren(): boolean {
    return (
      Array.isArray(this.node.template.item) &&
      this.node.template.item.length > 0
    );
  }

  @computed
  get useCheckboxes(): boolean {
    return this.node.repeats && !this.hasChildren;
  }

  @computed
  get isBooleanFallback(): boolean {
    return (
      this.node.type === "boolean" &&
      this.node.options.resolvedOptions.length === 0
    );
  }

  @computed
  get resolvedOptions(): ReadonlyArray<ResolvedAnswerOption<T>> {
    return (
      this.isBooleanFallback
        ? BOOLEAN_FALLBACK_OPTIONS
        : this.node.options.resolvedOptions
    ) as ReadonlyArray<ResolvedAnswerOption<T>>;
  }

  @computed
  get isLoading(): boolean {
    return this.node.options.loading;
  }

  @computed
  get allowCustom(): boolean {
    return (
      this.node.options.constraint === "optionsOrString" ||
      this.node.options.constraint === "optionsOrType"
    );
  }

  @computed
  get isMultiSelect(): boolean {
    return this.node.repeats && !this.hasChildren;
  }

  @computed
  get checkboxState(): SelectCheckboxState<T> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const selectedTokens = new Set<string>();
    const answerByToken = new Map<string, IAnswerInstance<T>>();
    const matchedAnswerTokens = new Set<string>();

    this.resolvedOptions.forEach((option) => {
      const match = this.node.answers.find((answer) => {
        if (answer.value == null || option.value == null) {
          return answer.value == null && option.value == null;
        }
        return areValuesEqual(dataType, answer.value, option.value);
      });
      if (match) {
        selectedTokens.add(option.token);
        answerByToken.set(option.token, match);
        matchedAnswerTokens.add(match.token);
      }
    });

    const nonOptionAnswers = this.node.answers.filter(
      (answer) => !matchedAnswerTokens.has(answer.token),
    );
    const customAnswers = nonOptionAnswers.filter(answerHasContent);
    const availableAnswers = nonOptionAnswers.filter(
      (answer) => answer.value == null,
    );
    const canAddSelection =
      !this.node.readOnly && (this.node.canAdd || availableAnswers.length > 0);
    const hasCustomAnswers = this.allowCustom && customAnswers.length > 0;
    const isCustomActive =
      this.allowCustom && (this.isCustomSelected || hasCustomAnswers);
    const specifyOtherToken = this.specifyOtherToken;

    if (isCustomActive) {
      selectedTokens.add(specifyOtherToken);
    }

    return {
      options: this.resolvedOptions,
      selectedTokens,
      answerByToken,
      nonOptionAnswers,
      customAnswers,
      availableAnswers,
      canAddSelection,
      isCustomActive,
      specifyOtherToken,
    };
  }

  @action.bound
  handleCheckboxToggle(token: string): void {
    const state = this.checkboxState;

    if (this.allowCustom && token === state.specifyOtherToken) {
      if (state.isCustomActive) {
        if (!this.node.canRemove) return;
        state.nonOptionAnswers.forEach((answer) =>
          this.node.removeAnswer(answer),
        );
        this.isCustomSelected = false;
        return;
      }
      if (!state.canAddSelection) return;
      this.isCustomSelected = true;
      return;
    }

    const option = state.options.find((entry) => entry.token === token);
    if (!option) return;
    const existing = state.answerByToken.get(token);
    if (existing) {
      if (!this.node.canRemove) return;
      this.node.removeAnswer(existing);
      return;
    }
    if (!state.canAddSelection) return;
    const next =
      option.value == null
        ? null
        : (cloneValue(option.value) as DataTypeToType<AnswerTypeToDataType<T>>);
    const slot = state.availableAnswers[0];
    if (slot) {
      slot.setValueByUser(next);
      return;
    }
    this.node.addAnswer(next);
  }

  @computed
  get ariaLabelledBy(): string {
    return getNodeLabelId(this.node);
  }

  @computed
  get ariaDescribedBy(): string | undefined {
    return getNodeDescribedBy(this.node);
  }

  @computed
  get canAddSelection(): boolean {
    return (
      !this.node.readOnly &&
      (this.node.canAdd || this.availableAnswers.length > 0)
    );
  }

  @computed
  get canRemoveSelection(): boolean {
    return !this.node.readOnly && this.node.canRemove;
  }

  @computed
  get specifyOtherToken(): string {
    return `${this.node.token}::__specify_other__`;
  }

  resolveTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): string {
    if (value == null) {
      return "";
    }
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const match = this.resolvedOptions.find((entry) => {
      if (entry.value == null) return false;
      return areValuesEqual(dataType, value, entry.value);
    });
    return match?.token ?? "";
  }

  resolveValueForToken(
    token: string,
  ): DataTypeToType<AnswerTypeToDataType<T>> | null {
    if (!token) return null;
    const entry = this.resolvedOptions.find((option) => option.token === token);
    if (!entry || entry.value == null) return null;
    return cloneValue(entry.value);
  }

  @computed
  get hasCustomAction(): boolean {
    return this.allowCustom;
  }

  @computed
  get selectedOptionAnswers(): Map<string, IAnswerInstance<T>> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const selectedOptionAnswers = new Map<string, IAnswerInstance<T>>();
    const usedAnswerTokens = new Set<string>();

    this.resolvedOptions.forEach((option) => {
      const match = this.node.answers.find((answer) => {
        if (answer.value == null) return false;
        if (usedAnswerTokens.has(answer.token)) return false;
        if (option.value == null) return false;
        return areValuesEqual(
          dataType,
          answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
          option.value,
        );
      });
      if (match) {
        selectedOptionAnswers.set(option.token, match);
        usedAnswerTokens.add(match.token);
      }
    });

    return selectedOptionAnswers;
  }

  @computed
  private get usedAnswerTokens(): Set<string> {
    const used = new Set<string>();
    this.selectedOptionAnswers.forEach((answer) => used.add(answer.token));
    return used;
  }

  @computed
  get customAnswers(): IAnswerInstance<T>[] {
    const isTypeCustom = this.node.options.constraint === "optionsOrType";
    return this.node.answers.filter((answer) => {
      if (this.usedAnswerTokens.has(answer.token)) return false;
      if (isTypeCustom && this.pendingCustomAnswerTokens.has(answer.token))
        return false;
      if (this.pendingCustomAnswerTokens.has(answer.token)) return true;
      return answer.value != null;
    });
  }

  @computed
  get availableAnswers(): IAnswerInstance<T>[] {
    return this.node.answers.filter((answer) => {
      if (this.usedAnswerTokens.has(answer.token)) return false;
      if (this.pendingCustomAnswerTokens.has(answer.token)) return false;
      return answer.value == null;
    });
  }

  @computed
  get selectableOptions(): ReadonlyArray<ResolvedAnswerOption<T>> {
    return this.resolvedOptions.map((entry) => {
      const isSelected = this.selectedOptionAnswers.has(entry.token);
      return {
        ...entry,
        disabled: entry.disabled || isSelected || !this.canAddSelection,
      };
    });
  }

  @computed
  get optionsWithSpecifyOther(): ReadonlyArray<ResolvedAnswerOption<T>> {
    if (!this.hasCustomAction) {
      return this.selectableOptions;
    }

    const customOption: ResolvedAnswerOption<T> = {
      token: this.specifyOtherToken,
      value: null,
      disabled: !this.canAddSelection,
    };

    return [...this.selectableOptions, customOption];
  }

  @computed
  get selectedChipItems(): SelectChipItem<T>[] {
    return [...this.selectedOptionAnswers.values()].map((answer) => ({
      token: answer.token,
      answer,
      kind: "option",
      inlineString: false,
    }));
  }

  @computed
  get customChipItems(): SelectChipItem<T>[] {
    const inlineString = this.node.options.constraint === "optionsOrString";
    return this.customAnswers.map((answer) => ({
      token: answer.token,
      answer,
      kind: "custom",
      inlineString,
    }));
  }

  @computed
  get hasSelections(): boolean {
    const customCount = this.customAnswers.length;
    return this.selectedOptionAnswers.size + customCount > 0;
  }

  @computed
  get dialogState(): SelectDialogState<T> | null {
    if (
      !this.pendingCustomDialog ||
      this.node.options.constraint !== "optionsOrType"
    ) {
      return null;
    }
    return {
      answer: this.pendingCustomDialog.answer,
      isNew: this.pendingCustomDialog.isNew,
      canConfirm: answerHasContent(this.pendingCustomDialog.answer),
    };
  }

  @action.bound
  addPendingToken(token: string): void {
    if (this.pendingCustomAnswerTokens.has(token)) return;
    const next = new Set(this.pendingCustomAnswerTokens);
    next.add(token);
    this.pendingCustomAnswerTokens = next;
  }

  @action.bound
  removePendingToken(token: string): void {
    if (!this.pendingCustomAnswerTokens.has(token)) return;
    const next = new Set(this.pendingCustomAnswerTokens);
    next.delete(token);
    this.pendingCustomAnswerTokens = next;
  }

  @action.bound
  setCustomDialog(dialog: SelectPendingDialog<T> | null): void {
    this.pendingCustomDialog = dialog;
  }

  @action.bound
  handleRemoveAnswer(answer: IAnswerInstance<T>): void {
    if (!this.canRemoveSelection) return;
    this.removePendingToken(answer.token);
    this.node.removeAnswer(answer);
  }

  @action.bound
  handleClearAll(): void {
    if (!this.canRemoveSelection) return;
    [...this.node.answers].forEach((answer) => this.node.removeAnswer(answer));
  }

  @action.bound
  handleSelectOption(token: string): void {
    this.pendingSelectToken = "";
    this.handleSelectChange(token);
  }

  @action.bound
  handleSelectChange(token: string): void {
    if (!token) return;
    if (token === this.specifyOtherToken) {
      if (this.node.options.constraint === "optionsOrString") {
        this.addCustomStringAnswer();
      } else if (this.node.options.constraint === "optionsOrType") {
        this.addCustomTypeAnswer();
      }
      return;
    }
    const option = this.resolvedOptions.find((entry) => entry.token === token);
    if (option) {
      this.addOptionAnswer(option);
    }
  }

  @action.bound
  cancelCustomDialog(): void {
    const dialog = this.pendingCustomDialog;
    if (!dialog) return;
    this.removePendingToken(dialog.answer.token);
    if (dialog.isNew) {
      this.node.removeAnswer(dialog.answer);
    } else {
      dialog.answer.setValueByUser(null);
    }
    this.pendingCustomDialog = null;
  }

  @action.bound
  confirmCustomDialog(): void {
    const dialog = this.pendingCustomDialog;
    if (!dialog) return;
    this.removePendingToken(dialog.answer.token);
    this.pendingCustomDialog = null;
  }

  buildRowProps(
    answer: IAnswerInstance<T>,
    suffix: string,
  ): ValueControlProps<T> {
    const answerErrorId =
      answer.issues.length > 0 ? getAnswerErrorId(answer) : undefined;
    const describedByPieces = [
      getNodeDescribedBy(this.node),
      answerErrorId,
    ].filter((value): value is string => Boolean(value));
    const ariaDescribedBy =
      describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;

    return {
      id: sanitizeForId(`${answer.token}-${suffix}`),
      ariaLabelledBy: getNodeLabelId(this.node),
      ariaDescribedBy,
      answer,
    };
  }

  private takeAvailableAnswer(): IAnswerInstance<T> | undefined {
    return this.availableAnswers[0];
  }

  private addOptionAnswer(option: ResolvedAnswerOption<T>): void {
    if (!this.canAddSelection || this.isLoading) return;
    if (this.selectedOptionAnswers.has(option.token)) return;
    const nextValue =
      option.value == null
        ? null
        : (cloneValue(option.value) as DataTypeToType<AnswerTypeToDataType<T>>);
    const slot = this.takeAvailableAnswer();
    if (slot) {
      slot.setValueByUser(nextValue);
      return;
    }
    this.node.addAnswer(nextValue);
  }

  private addCustomStringAnswer(): void {
    if (!this.canAddSelection || this.isLoading) return;
    const slot = this.takeAvailableAnswer();
    if (slot) {
      slot.setValueByUser("" as never);
      this.addPendingToken(slot.token);
      return;
    }
    const created = this.node.addAnswer("" as never);
    if (created) {
      this.addPendingToken(created.token);
    }
  }

  private addCustomTypeAnswer(): void {
    if (!this.canAddSelection || this.isLoading) return;
    const slot = this.takeAvailableAnswer();
    if (slot) {
      this.addPendingToken(slot.token);
      this.pendingCustomDialog = { answer: slot, isNew: false };
      return;
    }
    const created = this.node.addAnswer(null);
    if (created) {
      this.addPendingToken(created.token);
      this.pendingCustomDialog = {
        answer: created as IAnswerInstance<T>,
        isNew: true,
      };
    }
  }
}
