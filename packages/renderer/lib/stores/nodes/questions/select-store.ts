import { action, computed, makeObservable, observable } from "mobx";
import {
  AnswerOptionEntry,
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
  ISelectStore,
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
    key: "yes",
    label: "Yes",
    value: true,
    option: EMPTY_ANSWER_OPTION,
    disabled: false,
  },
  {
    key: "no",
    label: "No",
    value: false,
    option: EMPTY_ANSWER_OPTION,
    disabled: false,
  },
  {
    key: "unanswered",
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
  key: string;
  answer: IAnswerInstance<T>;
  kind: "option" | "custom";
  inlineString: boolean;
};

export type MultiSelectDialogState<T extends AnswerType> = {
  answer: IAnswerInstance<T>;
  isNew: boolean;
  canConfirm: boolean;
};

export type ListSelectCheckboxOption<T extends AnswerType> = {
  key: string;
  label: string;
  value: AnswerOptionEntry<T>["value"];
  disabled: boolean;
};

export type ListSelectCheckboxState<T extends AnswerType> = {
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  uiOptions: Array<ListSelectCheckboxOption<T>>;
  selectedKeys: Set<string>;
  answerByKey: Map<string, IAnswerInstance<T>>;
  nonOptionAnswers: IAnswerInstance<T>[];
  customAnswers: IAnswerInstance<T>[];
  availableAnswers: IAnswerInstance<T>[];
  canAddSelection: boolean;
  isCustomActive: boolean;
  specifyOthersKey: string;
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
  private pendingCustomKeys = new Set<string>();

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
    const selectedKeys = new Set<string>();
    const answerByKey = new Map<string, IAnswerInstance<T>>();
    const matchedAnswerKeys = new Set<string>();

    this.options.forEach((option) => {
      const match = this.node.answers.find((answer) => {
        if (answer.value == null || option.value == null) {
          return answer.value == null && option.value == null;
        }
        return areValuesEqual(dataType, answer.value, option.value);
      });
      if (match) {
        selectedKeys.add(option.key);
        answerByKey.set(option.key, match);
        matchedAnswerKeys.add(match.key);
      }
    });

    const nonOptionAnswers = this.node.answers.filter(
      (answer) => !matchedAnswerKeys.has(answer.key),
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
    const specifyOthersKey = `${this.node.key}::__specify_others__`;

    if (isCustomActive) {
      selectedKeys.add(specifyOthersKey);
    }

    const uiOptions = this.options.map((option) => {
      const isSelected = selectedKeys.has(option.key);
      return {
        key: option.key,
        label: option.label,
        value: option.value,
        disabled:
          option.disabled ||
          (!isSelected && !canAddSelection) ||
          (isSelected && !this.node.canRemove),
      };
    });

    if (this.allowCustom) {
      uiOptions.push({
        key: specifyOthersKey,
        label: "Specify others",
        value: null,
        disabled:
          (!isCustomActive && !canAddSelection) ||
          (isCustomActive && !this.node.canRemove),
      });
    }

    return {
      options: this.options,
      uiOptions,
      selectedKeys,
      answerByKey,
      nonOptionAnswers,
      customAnswers,
      availableAnswers,
      canAddSelection,
      isCustomActive,
      specifyOthersKey,
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
  handleCheckboxToggle(key: string): void {
    const state = this.checkboxState;

    if (this.allowCustom && key === state.specifyOthersKey) {
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

    const option = state.options.find((entry) => entry.key === key);
    if (!option) return;
    const existing = state.answerByKey.get(key);
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
  get specifyOtherKey(): string {
    return `${this.node.key}::__specify_other__`;
  }

  @computed
  get hasCustomAction(): boolean {
    return this.allowCustom;
  }

  @computed
  get selectedOptionAnswers(): Map<string, IAnswerInstance<T>> {
    const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
    const selectedOptionAnswers = new Map<string, IAnswerInstance<T>>();
    const usedAnswerKeys = new Set<string>();

    this.node.options.entries.forEach((option) => {
      const match = this.node.answers.find((answer) => {
        if (answer.value == null) return false;
        if (usedAnswerKeys.has(answer.key)) return false;
        if (option.value == null) return false;
        return areValuesEqual(
          dataType,
          answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
          option.value,
        );
      });
      if (match) {
        selectedOptionAnswers.set(option.key, match);
        usedAnswerKeys.add(match.key);
      }
    });

    return selectedOptionAnswers;
  }

  @computed
  private get usedAnswerKeys(): Set<string> {
    const used = new Set<string>();
    this.selectedOptionAnswers.forEach((answer) => used.add(answer.key));
    return used;
  }

  @computed
  get customAnswers(): IAnswerInstance<T>[] {
    const isTypeCustom = this.node.options.constraint === "optionsOrType";
    return this.node.answers.filter((answer) => {
      if (this.usedAnswerKeys.has(answer.key)) return false;
      if (isTypeCustom && this.pendingCustomKeys.has(answer.key)) return false;
      if (this.pendingCustomKeys.has(answer.key)) return true;
      return answer.value != null;
    });
  }

  @computed
  get availableAnswers(): IAnswerInstance<T>[] {
    return this.node.answers.filter((answer) => {
      if (this.usedAnswerKeys.has(answer.key)) return false;
      if (this.pendingCustomKeys.has(answer.key)) return false;
      return answer.value == null;
    });
  }

  @computed
  get preparedOptions(): ReadonlyArray<AnswerOptionEntry<T>> {
    return this.node.options.entries.map((entry) => {
      const isSelected = this.selectedOptionAnswers.has(entry.key);
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
      key: this.specifyOtherKey,
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
      key: answer.key,
      answer,
      kind: "option",
      inlineString: false,
    }));
  }

  @computed
  get customChipItems(): MultiSelectChipItem<T>[] {
    const inlineString = this.node.options.constraint === "optionsOrString";
    return this.customAnswers.map((answer) => ({
      key: answer.key,
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
  addPendingKey(key: string): void {
    if (this.pendingCustomKeys.has(key)) return;
    const next = new Set(this.pendingCustomKeys);
    next.add(key);
    this.pendingCustomKeys = next;
  }

  @action.bound
  removePendingKey(key: string): void {
    if (!this.pendingCustomKeys.has(key)) return;
    const next = new Set(this.pendingCustomKeys);
    next.delete(key);
    this.pendingCustomKeys = next;
  }

  @action.bound
  setCustomDialog(dialog: PendingDialog<T> | null): void {
    this.customDialog = dialog;
  }

  @action.bound
  handleRemoveAnswer(answer: IAnswerInstance<T>): void {
    if (!this.canRemoveSelection) return;
    this.removePendingKey(answer.key);
    this.node.removeAnswer(answer);
  }

  @action.bound
  handleClearAll(): void {
    if (!this.canRemoveSelection) return;
    [...this.node.answers].forEach((answer) => this.node.removeAnswer(answer));
  }

  @action.bound
  handleSelectOption(key: string): void {
    this.selectValue = "";
    this.handleSelectChange(key);
  }

  @action.bound
  handleSelectChange(key: string): void {
    if (!key) return;
    if (key === this.specifyOtherKey) {
      if (this.node.options.constraint === "optionsOrString") {
        this.addCustomStringAnswer();
      } else if (this.node.options.constraint === "optionsOrType") {
        this.addCustomTypeAnswer();
      }
      return;
    }
    const option = this.node.options.entries.find((entry) => entry.key === key);
    if (option) {
      this.addOptionAnswer(option);
    }
  }

  @action.bound
  cancelCustomDialog(): void {
    const dialog = this.customDialog;
    if (!dialog) return;
    this.removePendingKey(dialog.answer.key);
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
    this.removePendingKey(dialog.answer.key);
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
      inputId: sanitizeForId(`${answer.key}-${suffix}`),
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
    if (this.selectedOptionAnswers.has(option.key)) return;
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
      this.addPendingKey(slot.key);
      return;
    }
    const created = this.node.addAnswer("" as never);
    if (created) {
      this.addPendingKey(created.key);
    }
  }

  private addCustomTypeAnswer(): void {
    if (!this.canAddSelection || this.isLoading) return;
    const slot = this.takeAvailableAnswer();
    if (slot) {
      this.addPendingKey(slot.key);
      this.customDialog = { answer: slot, isNew: false };
      return;
    }
    const created = this.node.addAnswer(null);
    if (created) {
      this.addPendingKey(created.key);
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
  get selectKey(): string {
    if (this.parent.isBooleanFallback) {
      const dataType = ANSWER_TYPE_TO_DATA_TYPE[this.parent.node.type];
      if (this.answer.value == null) {
        const unanswered = this.parent.options.find(
          (entry) => entry.key === "unanswered",
        );
        return unanswered?.key ?? "";
      }
      const match = this.parent.options.find(
        (entry) =>
          entry.value != null &&
          areValuesEqual(dataType, entry.value, this.answer.value as never),
      );
      return match?.key ?? "";
    }
    return this.parent.node.options.getKeyForValue(
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get legacyOption(): { key: string; label: string } | null {
    if (this.parent.allowCustom) return null;
    if (this.parent.isBooleanFallback) return null;
    if (this.selectKey || this.answer.value == null) return null;
    return this.parent.node.options.getLegacyEntryForValue(
      this.answer.key,
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get specifyOtherKey(): string {
    return `${this.parent.node.key}::__specify_other__`;
  }

  @computed
  get isCustomValue(): boolean {
    return (
      this.parent.allowCustom &&
      this.selectKey === "" &&
      this.answer.value != null
    );
  }

  @computed
  get isCustomActive(): boolean {
    if (!this.parent.allowCustom) return false;
    if (this.selectKey) return false;
    return this.isCustomValue || this.forceCustom;
  }

  @computed
  get selectValue(): string {
    if (this.isCustomActive) {
      return this.specifyOtherKey;
    }
    return this.selectKey || this.legacyOption?.key || "";
  }

  @computed
  get radioOptions(): Array<{
    key: string;
    label: string;
    disabled?: boolean;
  }> {
    const baseOptions = this.parent.options.map((option) => ({
      key: option.key,
      label: option.label,
      disabled: option.disabled,
    }));
    if (!this.parent.allowCustom) {
      return baseOptions;
    }
    return [
      ...baseOptions,
      { key: this.specifyOtherKey, label: "Specify other" },
    ];
  }

  @action.bound
  handleChange(key: string): void {
    if (this.parent.allowCustom && key === this.specifyOtherKey) {
      this.forceCustom = true;
      if (!this.isCustomValue) {
        this.answer.setValueByUser(null);
      }
      return;
    }

    this.forceCustom = false;
    if (this.parent.isBooleanFallback) {
      const nextValue = (() => {
        if (!key) return null;
        const match = this.parent.options.find((entry) => entry.key === key);
        if (!match) return null;
        return match.value === undefined ? null : cloneValue(match.value);
      })();
      this.answer.setValueByUser(
        nextValue as DataTypeToType<AnswerTypeToDataType<T>> | null,
      );
      return;
    }
    const nextValue = key ? this.parent.node.options.getValueForKey(key) : null;
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
  get optionKey(): string {
    return this.parent.node.options.getKeyForValue(
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get legacyOption(): { key: string; label: string } | null {
    if (this.parent.allowCustom) return null;
    if (this.optionKey || this.answer.value == null) return null;
    return this.parent.node.options.getLegacyEntryForValue(
      this.answer.key,
      this.answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }

  @computed
  get selectValue(): string {
    return this.optionKey || this.legacyOption?.key || "";
  }

  @computed
  get customKey(): string {
    return `${this.parent.node.key}::__specify_other__`;
  }

  @computed
  get isCustomValue(): boolean {
    return (
      this.parent.allowCustom &&
      this.optionKey === "" &&
      this.answer.value != null
    );
  }

  @computed
  get isCustomActive(): boolean {
    if (!this.parent.allowCustom) return false;
    if (this.optionKey) return false;
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
        key: this.customKey,
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
  handleSelect(key: string): void {
    if (this.parent.allowCustom && key === this.customKey) {
      this.forceCustom = true;
      this.answer.setValueByUser(null);
      return;
    }
    this.forceCustom = false;
    const nextValue = key ? this.parent.node.options.getValueForKey(key) : null;
    this.answer.setValueByUser(
      nextValue as DataTypeToType<AnswerTypeToDataType<T>> | null,
    );
  }
}
