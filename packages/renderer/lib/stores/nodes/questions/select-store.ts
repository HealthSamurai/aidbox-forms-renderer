import { action, computed, makeObservable, observable } from "mobx";
import FuzzySearch from "fuzzy-search";
import {
  AnswerType,
  AnswerTypeToDataType,
  DataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
  ISelectStore,
  ResolvedAnswerOption,
  SelectCheckboxState,
  SelectChipItem,
  SelectCustomInputState,
  SelectPendingCustomInput,
  ValueControlProps,
} from "../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  areValuesEqual,
  getAnswerErrorId,
  getNodeDescribedBy,
  getNodeLabelId,
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

const DEFAULT_SEARCH_KEYS: readonly string[] = ["value"];
const SEARCH_KEYS_BY_TYPE: Partial<Record<DataType, readonly string[]>> = {
  Coding: ["value.display", "value.code", "value.system", "value.version"],
  Reference: ["value.display", "value.reference", "value.identifier.value"],
  Quantity: ["value.unit", "value.code", "value.system", "value.value"],
  Attachment: ["value.title", "value.url", "value.contentType"],
};

export class SelectStore<
  T extends AnswerType = AnswerType,
> implements ISelectStore<T> {
  readonly node: IQuestionNode<T>;

  @observable
  private isCustomSelected = false;

  @observable.ref
  private pendingCustomAnswerTokens = new Set<string>();

  @observable
  private pendingCustomInput: SelectPendingCustomInput<T> | null = null;

  @observable
  private searchQuery = "";

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
  private get searchIndex(): FuzzySearch<ResolvedAnswerOption<T>> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const searchKeys = SEARCH_KEYS_BY_TYPE[dataType] ?? DEFAULT_SEARCH_KEYS;
    return new FuzzySearch(this.resolvedOptions, searchKeys, {
      caseSensitive: false,
      sort: true,
    });
  }

  @computed
  get filteredOptions(): ReadonlyArray<ResolvedAnswerOption<T>> {
    const query = this.searchQuery.trim();
    if (!query) {
      return this.resolvedOptions;
    }
    return this.searchIndex.search(query);
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
    const customAnswerTokens = this.pendingCustomAnswerTokens;

    this.resolvedOptions.forEach((option) => {
      const match = this.node.answers.find((answer) => {
        if (customAnswerTokens.has(answer.token)) {
          return false;
        }
        if (answer.value == null) {
          return false;
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
    const hasCustomSlots = this.allowCustom && nonOptionAnswers.length > 0;
    const isCustomActive =
      hasCustomAnswers || (this.isCustomSelected && hasCustomSlots);
    const specifyOtherToken = this.specifyOtherToken;

    if (isCustomActive) {
      selectedTokens.add(specifyOtherToken);
    }

    const canRemoveSelection = this.canRemoveSelection;
    const options = this.resolvedOptions.map((option) => {
      const isSelected = selectedTokens.has(option.token);
      return {
        ...option,
        disabled:
          option.disabled ||
          (!isSelected && !canAddSelection) ||
          (isSelected && !canRemoveSelection),
      };
    });

    return {
      options,
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
        state.nonOptionAnswers.forEach((answer) => {
          this.removePendingToken(answer.token);
          this.node.removeAnswer(answer);
        });
        this.isCustomSelected = false;
        return;
      }
      if (!state.canAddSelection) return;
      this.isCustomSelected = true;
      const availableAnswer = state.availableAnswers[0];
      if (availableAnswer) {
        this.addPendingToken(availableAnswer.token);
        return;
      }
      if (this.node.canAdd) {
        const created = this.node.addAnswer();
        if (created) {
          this.addPendingToken(created.token);
        }
      }
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
    const next = structuredClone(option.value) as DataTypeToType<
      AnswerTypeToDataType<T>
    >;
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

  @action.bound
  setSearchQuery(query: string): void {
    this.searchQuery = query;
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
    return `${this.node.token}_/_specify_other`;
  }

  resolveTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): string {
    if (value == null) {
      return "";
    }
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const match = this.resolvedOptions.find((entry) => {
      return areValuesEqual(dataType, value, entry.value);
    });
    return match?.token ?? "";
  }

  resolveValueForToken(
    token: string,
  ): DataTypeToType<AnswerTypeToDataType<T>> | null {
    if (!token) return null;
    const entry = this.resolvedOptions.find((option) => option.token === token);
    if (!entry) return null;
    return structuredClone(entry.value);
  }

  @computed
  get selectedOptionAnswers(): Map<string, IAnswerInstance<T>> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const selectedOptionAnswers = new Map<string, IAnswerInstance<T>>();
    const usedAnswerTokens = new Set<string>();
    const pendingCustomAnswerTokens = this.pendingCustomAnswerTokens;

    this.resolvedOptions.forEach((option) => {
      const match = this.node.answers.find((answer) => {
        if (answer.value == null) return false;
        if (pendingCustomAnswerTokens.has(answer.token)) return false;
        if (usedAnswerTokens.has(answer.token)) return false;
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
  get selectedOptionTokens(): ReadonlySet<string> {
    return new Set(this.selectedOptionAnswers.keys());
  }

  @computed
  private get usedAnswerTokens(): Set<string> {
    const used = new Set<string>();
    this.selectedOptionAnswers.forEach((answer) => used.add(answer.token));
    return used;
  }

  @computed
  get customAnswers(): IAnswerInstance<T>[] {
    const pendingInputToken = this.pendingCustomInput?.answer.token;
    return this.node.answers.filter((answer) => {
      if (this.usedAnswerTokens.has(answer.token)) return false;
      if (this.pendingCustomAnswerTokens.has(answer.token)) {
        return answer.token !== pendingInputToken;
      }
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
  get selectedChipItems(): SelectChipItem<T>[] {
    return [...this.selectedOptionAnswers.values()].map((answer) => ({
      token: answer.token,
      answer,
      kind: "option",
    }));
  }

  @computed
  get customChipItems(): SelectChipItem<T>[] {
    return this.customAnswers.map((answer) => ({
      token: answer.token,
      answer,
      kind: "custom",
    }));
  }

  @computed
  get hasSelections(): boolean {
    const customCount = this.customAnswers.length;
    return this.selectedOptionAnswers.size + customCount > 0;
  }

  @computed
  get customInputState(): SelectCustomInputState<T> | null {
    if (!this.pendingCustomInput || !this.allowCustom) {
      return null;
    }
    return {
      answer: this.pendingCustomInput.answer,
      isNew: this.pendingCustomInput.isNew,
      canSubmit: answerHasContent(this.pendingCustomInput.answer),
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
  handleRemoveAnswer(answer: IAnswerInstance<T>): void {
    if (!this.canRemoveSelection) return;
    this.removePendingToken(answer.token);
    this.node.removeAnswer(answer);
  }

  @action.bound
  handleSelectOption(token: string): void {
    this.handleSelectChange(token);
  }

  @action.bound
  handleSelectChange(token: string): void {
    if (!token) return;
    if (token === this.specifyOtherToken) {
      this.openCustomInput();
      return;
    }
    const option = this.resolvedOptions.find((entry) => entry.token === token);
    if (option) {
      this.addOptionAnswer(option);
    }
  }

  @action.bound
  openCustomInput(answer?: IAnswerInstance<T>): void {
    if (!this.allowCustom) return;
    if (this.pendingCustomInput) return;
    const hasValue = answer?.value != null;
    if (!hasValue && (this.isLoading || !this.canAddSelection)) return;

    if (answer) {
      this.addPendingToken(answer.token);
      this.pendingCustomInput = { answer, isNew: false };
      return;
    }

    const slot = this.takeAvailableAnswer();
    if (slot) {
      this.addPendingToken(slot.token);
      this.pendingCustomInput = { answer: slot, isNew: false };
      return;
    }
    if (this.node.canAdd) {
      const created = this.node.addAnswer(null);
      if (created) {
        this.addPendingToken(created.token);
        this.pendingCustomInput = {
          answer: created as IAnswerInstance<T>,
          isNew: true,
        };
      }
    }
  }

  @action.bound
  cancelCustomInput(): void {
    const customInput = this.pendingCustomInput;
    if (!customInput) return;
    this.removePendingToken(customInput.answer.token);
    if (customInput.isNew) {
      this.node.removeAnswer(customInput.answer);
    } else {
      customInput.answer.setValueByUser(null);
    }
    this.pendingCustomInput = null;
  }

  @action.bound
  submitCustomInput(): void {
    const customInput = this.pendingCustomInput;
    if (!customInput) return;
    this.pendingCustomInput = null;
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
      id: `${answer.token}_/_${suffix}`,
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
    const nextValue = structuredClone(option.value) as DataTypeToType<
      AnswerTypeToDataType<T>
    >;
    const slot = this.takeAvailableAnswer();
    if (slot) {
      slot.setValueByUser(nextValue);
      return;
    }
    this.node.addAnswer(nextValue);
  }
}
