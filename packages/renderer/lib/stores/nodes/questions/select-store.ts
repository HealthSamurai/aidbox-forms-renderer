import { action, computed, makeObservable, observable } from "mobx";
import {
  AnswerOptionEntry,
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
  ISelectStore,
  OptionItem,
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

const EMPTY_ANSWER_OPTION: AnswerOptionEntry<AnswerType>["option"] = {};

const BOOLEAN_FALLBACK_OPTIONS: Array<AnswerOptionEntry<"boolean">> = [
  {
    token: "yes",
    label: "Yes",
    value: true,
    option: EMPTY_ANSWER_OPTION,
    disabled: false,
  },
  {
    token: "no",
    label: "No",
    value: false,
    option: EMPTY_ANSWER_OPTION,
    disabled: false,
  },
  {
    token: "unanswered",
    label: "Unanswered",
    value: null,
    option: EMPTY_ANSWER_OPTION,
    disabled: false,
  },
];

type PendingDialog<T extends AnswerType> = {
  answer: IAnswerInstance<T>;
  isNew: boolean;
};

export type MultiSelectChipItem<T extends AnswerType> = {
  token: string;
  answer: IAnswerInstance<T>;
  kind: "option" | "custom";
  inlineString: boolean;
};

export type MultiSelectDialogState<T extends AnswerType> = {
  answer: IAnswerInstance<T>;
  isNew: boolean;
  canConfirm: boolean;
};

export type ListSelectCheckboxState<T extends AnswerType> = {
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  uiOptions: Array<OptionItem>;
  selectedTokens: Set<string>;
  answerByToken: Map<string, IAnswerInstance<T>>;
  nonOptionAnswers: IAnswerInstance<T>[];
  customAnswers: IAnswerInstance<T>[];
  availableAnswers: IAnswerInstance<T>[];
  canAddSelection: boolean;
  isCustomActive: boolean;
  specifyOtherToken: string;
};

export class SelectStore<
  T extends AnswerType = AnswerType,
> implements ISelectStore<T> {
  readonly node: IQuestionNode<T>;

  @observable
  private customActive = false;

  private readonly listRowStoreCache = new WeakMap<
    IAnswerInstance<T>,
    ListSelectRowState<T>
  >();

  private readonly dropdownRowStoreCache = new WeakMap<
    IAnswerInstance<T>,
    DropdownRowState<T>
  >();

  @observable.ref
  private pendingCustomTokens = new Set<string>();

  @observable
  selectValue = "";

  @observable
  private customDialog: PendingDialog<T> | null = null;

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
      this.node.type === "boolean" && this.node.options.entries.length === 0
    );
  }

  @computed
  get options(): ReadonlyArray<AnswerOptionEntry<T>> {
    return (
      this.isBooleanFallback
        ? BOOLEAN_FALLBACK_OPTIONS
        : this.node.options.entries
    ) as ReadonlyArray<AnswerOptionEntry<T>>;
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
  get checkboxState(): ListSelectCheckboxState<T> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const selectedTokens = new Set<string>();
    const answerByToken = new Map<string, IAnswerInstance<T>>();
    const matchedAnswerTokens = new Set<string>();

    this.options.forEach((option) => {
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
      this.allowCustom && (this.customActive || hasCustomAnswers);
    const specifyOtherToken = this.specifyOtherToken;

    if (isCustomActive) {
      selectedTokens.add(specifyOtherToken);
    }

    const uiOptions = this.options.map((option) => {
      const isSelected = selectedTokens.has(option.token);
      return {
        token: option.token,
        label: option.label,
        disabled:
          option.disabled ||
          (!isSelected && !canAddSelection) ||
          (isSelected && !this.node.canRemove),
      };
    });

    if (this.allowCustom) {
      uiOptions.push({
        token: specifyOtherToken,
        label: "Specify other",
        disabled:
          (!isCustomActive && !canAddSelection) ||
          (isCustomActive && !this.node.canRemove),
      });
    }

    return {
      options: this.options,
      uiOptions,
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

  getListRowState(answer: IAnswerInstance<T>): ListSelectRowState<T> {
    const existing = this.listRowStoreCache.get(answer);
    if (existing) {
      return existing;
    }
    const store = new ListSelectRowState(this, answer);
    this.listRowStoreCache.set(answer, store);
    return store;
  }

  getDropdownRowState(answer: IAnswerInstance<T>): DropdownRowState<T> {
    const existing = this.dropdownRowStoreCache.get(answer);
    if (existing) {
      return existing;
    }
    const store = new DropdownRowState(this, answer);
    this.dropdownRowStoreCache.set(answer, store);
    return store;
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
        this.customActive = false;
        return;
      }
      if (!state.canAddSelection) return;
      this.customActive = true;
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
      option.value === undefined
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

  @computed
  get hasCustomAction(): boolean {
    return this.allowCustom;
  }

  @computed
  get selectedOptionAnswers(): Map<string, IAnswerInstance<T>> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const selectedOptionAnswers = new Map<string, IAnswerInstance<T>>();
    const usedAnswerTokens = new Set<string>();

    this.node.options.entries.forEach((option) => {
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
      if (isTypeCustom && this.pendingCustomTokens.has(answer.token))
        return false;
      if (this.pendingCustomTokens.has(answer.token)) return true;
      return answer.value != null;
    });
  }

  @computed
  get availableAnswers(): IAnswerInstance<T>[] {
    return this.node.answers.filter((answer) => {
      if (this.usedAnswerTokens.has(answer.token)) return false;
      if (this.pendingCustomTokens.has(answer.token)) return false;
      return answer.value == null;
    });
  }

  @computed
  get preparedOptions(): ReadonlyArray<AnswerOptionEntry<T>> {
    return this.node.options.entries.map((entry) => {
      const isSelected = this.selectedOptionAnswers.has(entry.token);
      return {
        ...entry,
        disabled: entry.disabled || isSelected || !this.canAddSelection,
      };
    });
  }

  @computed
  get extendedOptions(): ReadonlyArray<AnswerOptionEntry<T>> {
    if (!this.hasCustomAction) {
      return this.preparedOptions;
    }

    const customOption: AnswerOptionEntry<T> = {
      token: this.specifyOtherToken,
      label: "Specify other",
      value: null,
      option: EMPTY_ANSWER_OPTION,
      disabled: !this.canAddSelection,
    };

    return [...this.preparedOptions, customOption];
  }

  @computed
  get selectedChipItems(): MultiSelectChipItem<T>[] {
    return [...this.selectedOptionAnswers.values()].map((answer) => ({
      token: answer.token,
      answer,
      kind: "option",
      inlineString: false,
    }));
  }

  @computed
  get customChipItems(): MultiSelectChipItem<T>[] {
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
  get dialogState(): MultiSelectDialogState<T> | null {
    if (
      !this.customDialog ||
      this.node.options.constraint !== "optionsOrType"
    ) {
      return null;
    }
    return {
      answer: this.customDialog.answer,
      isNew: this.customDialog.isNew,
      canConfirm: answerHasContent(this.customDialog.answer),
    };
  }

  @action.bound
  addPendingToken(token: string): void {
    if (this.pendingCustomTokens.has(token)) return;
    const next = new Set(this.pendingCustomTokens);
    next.add(token);
    this.pendingCustomTokens = next;
  }

  @action.bound
  removePendingToken(token: string): void {
    if (!this.pendingCustomTokens.has(token)) return;
    const next = new Set(this.pendingCustomTokens);
    next.delete(token);
    this.pendingCustomTokens = next;
  }

  @action.bound
  setCustomDialog(dialog: PendingDialog<T> | null): void {
    this.customDialog = dialog;
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
    this.selectValue = "";
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
    const option = this.node.options.entries.find(
      (entry) => entry.token === token,
    );
    if (option) {
      this.addOptionAnswer(option);
    }
  }

  @action.bound
  cancelCustomDialog(): void {
    const dialog = this.customDialog;
    if (!dialog) return;
    this.removePendingToken(dialog.answer.token);
    if (dialog.isNew) {
      this.node.removeAnswer(dialog.answer);
    } else {
      dialog.answer.setValueByUser(null);
    }
    this.customDialog = null;
  }

  @action.bound
  confirmCustomDialog(): void {
    const dialog = this.customDialog;
    if (!dialog) return;
    this.removePendingToken(dialog.answer.token);
    this.customDialog = null;
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

  private addOptionAnswer(option: AnswerOptionEntry<T>): void {
    if (!this.canAddSelection || this.isLoading) return;
    if (this.selectedOptionAnswers.has(option.token)) return;
    const nextValue =
      option.value === undefined
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
      this.customDialog = { answer: slot, isNew: false };
      return;
    }
    const created = this.node.addAnswer(null);
    if (created) {
      this.addPendingToken(created.token);
      this.customDialog = {
        answer: created as IAnswerInstance<T>,
        isNew: true,
      };
    }
  }
}

class ListSelectRowState<T extends AnswerType> {
  private readonly parent: SelectStore<T>;
  private readonly answer: IAnswerInstance<T>;

  @observable
  private forceCustom = false;

  constructor(parent: SelectStore<T>, answer: IAnswerInstance<T>) {
    this.parent = parent;
    this.answer = answer;
    makeObservable(this);
  }

  @computed
  get selectToken(): string {
    if (this.parent.isBooleanFallback) {
      const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.parent.node.type];
      if (this.answer.value == null) {
        const unanswered = this.parent.options.find(
          (entry) => entry.token === "unanswered",
        );
        return unanswered?.token ?? "";
      }
      const match = this.parent.options.find(
        (entry) =>
          entry.value != null &&
          areValuesEqual(dataType, entry.value, this.answer.value as never),
      );
      return match?.token ?? "";
    }
    return this.parent.node.options.getTokenForValue(
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get legacyOption(): OptionItem | null {
    if (this.parent.allowCustom) return null;
    if (this.parent.isBooleanFallback) return null;
    if (this.selectToken || this.answer.value == null) return null;
    return this.parent.node.options.getLegacyEntryForValue(
      this.answer.token,
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get specifyOtherToken(): string {
    return `${this.parent.node.token}::__specify_other__`;
  }

  @computed
  get isCustomValue(): boolean {
    return (
      this.parent.allowCustom &&
      this.selectToken === "" &&
      this.answer.value != null
    );
  }

  @computed
  get isCustomActive(): boolean {
    if (!this.parent.allowCustom) return false;
    if (this.selectToken) return false;
    return this.isCustomValue || this.forceCustom;
  }

  @computed
  get selectValue(): string {
    if (this.isCustomActive) {
      return this.specifyOtherToken;
    }
    return this.selectToken || this.legacyOption?.token || "";
  }

  @computed
  get radioOptions(): OptionItem[] {
    const baseOptions = this.parent.options.map((option) => ({
      token: option.token,
      label: option.label,
      disabled: option.disabled,
    }));
    if (!this.parent.allowCustom) {
      return baseOptions;
    }
    return [
      ...baseOptions,
      { token: this.specifyOtherToken, label: "Specify other" },
    ];
  }

  @action.bound
  handleChange(token: string): void {
    if (this.parent.allowCustom && token === this.specifyOtherToken) {
      this.forceCustom = true;
      if (!this.isCustomValue) {
        this.answer.setValueByUser(null);
      }
      return;
    }

    this.forceCustom = false;
    if (this.parent.isBooleanFallback) {
      const nextValue = (() => {
        if (!token) return null;
        const match = this.parent.options.find(
          (entry) => entry.token === token,
        );
        if (!match) return null;
        return match.value === undefined ? null : cloneValue(match.value);
      })();
      this.answer.setValueByUser(
        nextValue as DataTypeToType<AnswerTypeToDataType<T>> | null,
      );
      return;
    }
    const nextValue = token
      ? this.parent.node.options.getValueForToken(token)
      : null;
    this.answer.setValueByUser(
      nextValue as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }
}

class DropdownRowState<T extends AnswerType> {
  private readonly parent: SelectStore<T>;
  private readonly answer: IAnswerInstance<T>;

  @observable
  private forceCustom = false;

  constructor(parent: SelectStore<T>, answer: IAnswerInstance<T>) {
    this.parent = parent;
    this.answer = answer;
    makeObservable(this);
  }

  @computed
  get optionToken(): string {
    return this.parent.node.options.getTokenForValue(
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get legacyOption(): OptionItem | null {
    if (this.parent.allowCustom) return null;
    if (this.optionToken || this.answer.value == null) return null;
    return this.parent.node.options.getLegacyEntryForValue(
      this.answer.token,
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get selectValue(): string {
    return this.optionToken || this.legacyOption?.token || "";
  }

  @computed
  get customToken(): string {
    return `${this.parent.node.token}::__specify_other__`;
  }

  @computed
  get isCustomValue(): boolean {
    return (
      this.parent.allowCustom &&
      this.optionToken === "" &&
      this.answer.value != null
    );
  }

  @computed
  get isCustomActive(): boolean {
    if (!this.parent.allowCustom) return false;
    if (this.optionToken) return false;
    return this.isCustomValue || this.forceCustom;
  }

  @computed
  get extendedOptions() {
    if (!this.parent.allowCustom) {
      return this.parent.node.options.entries;
    }
    return [
      ...this.parent.node.options.entries,
      {
        token: this.customToken,
        label: "Specify other",
        value: null,
        option: EMPTY_ANSWER_OPTION,
        disabled: !this.parent.canAddSelection,
      },
    ];
  }

  @computed
  get canClear(): boolean {
    return this.answer.value != null && !this.parent.node.readOnly;
  }

  @action.bound
  clearValue(): void {
    this.answer.setValueByUser(null);
  }

  @action.bound
  exitCustom(): void {
    this.forceCustom = false;
    this.answer.setValueByUser(null);
  }

  @action.bound
  handleSelect(token: string): void {
    if (this.parent.allowCustom && token === this.customToken) {
      this.forceCustom = true;
      this.answer.setValueByUser(null);
      return;
    }
    this.forceCustom = false;
    const nextValue = token
      ? this.parent.node.options.getValueForToken(token)
      : null;
    this.answer.setValueByUser(
      nextValue as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }
}
