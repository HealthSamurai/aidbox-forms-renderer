import { action, computed, makeObservable, observable } from "mobx";
import FuzzySearch from "fuzzy-search";
import {
  AnswerType,
  AnswerTypeToDataType,
  AnswerToken,
  CustomOptionFormState,
  DataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
  ISelectStore,
  OptionToken,
  AnswerOption,
  SelectedAnswerOption,
} from "../../../types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  areValuesEqual,
  tokenify,
} from "../../../utils.ts";

const BOOLEAN_FALLBACK_OPTIONS: Array<AnswerOption<"boolean">> = [
  {
    token: "yes",
    value: true,
    disabled: false,
    answerType: "boolean",
  },
  {
    token: "no",
    value: false,
    disabled: false,
    answerType: "boolean",
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

  private readonly customAnswerTokens = observable.set<AnswerToken>();

  @observable
  private pendingCustomOptionForm: CustomOptionFormState<T> | undefined =
    undefined;

  private readonly extraOptionsByToken = observable.map<
    OptionToken,
    AnswerOption<T> | AnswerOption<"string">
  >({}, { deep: false, name: "SelectStore.extraOptionsByToken" });

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
      this.node.answerOptions.options.length === 0
    );
  }

  @computed
  get inherentOptions(): ReadonlyArray<AnswerOption<T>> {
    return (
      this.isBooleanFallback
        ? BOOLEAN_FALLBACK_OPTIONS
        : this.node.answerOptions.options
    ) as ReadonlyArray<AnswerOption<T>>;
  }

  @computed
  private get searchIndex() {
    return new FuzzySearch(
      this.inherentOptions,
      SEARCH_KEYS_BY_TYPE[this.dataType] ?? DEFAULT_SEARCH_KEYS,
      {
        caseSensitive: false,
        sort: true,
      },
    );
  }

  @computed
  get filteredInherentOptions(): ReadonlyArray<AnswerOption<T>> {
    const query = this.searchQuery.trim();
    if (!query) {
      return this.inherentOptions;
    }
    return this.searchIndex.search(query);
  }

  @computed
  get isLoading(): boolean {
    return this.node.answerOptions.loading;
  }

  @computed
  get allowCustom(): boolean {
    return (
      this.node.answerOptions.constraint === "optionsOrString" ||
      this.node.answerOptions.constraint === "optionsOrType"
    );
  }

  @computed
  get isMultiSelect(): boolean {
    return this.node.repeats && !this.hasChildren;
  }

  @computed
  get options(): ReadonlyArray<AnswerOption<T> | AnswerOption<"string">> {
    return this.buildOptions(this.inherentOptions);
  }

  @computed
  get filteredOptions(): ReadonlyArray<
    AnswerOption<T> | AnswerOption<"string">
  > {
    return this.buildOptions(this.filteredInherentOptions);
  }

  @computed
  private get matchedOptionsByAnswerToken() {
    return this.inherentOptions.reduce((matches, option) => {
      const match = this.node.answers.find((answer) => {
        if (
          answer.value == null ||
          answer.token === this.pendingCustomOptionForm?.answer.token ||
          this.customAnswerTokens.has(answer.token)
        )
          return false;
        return areValuesEqual(
          this.dataType,
          answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
          option.value,
        );
      });
      return !match
        ? matches
        : matches.set(match.token, {
            token: option.token,
            disabled: option.disabled,
          });
    }, new Map<AnswerToken, { token: OptionToken; disabled: boolean }>());
  }

  @computed
  get selectedOptions(): ReadonlyArray<SelectedAnswerOption<T>> {
    const selectedOptions: SelectedAnswerOption<T>[] = [];

    this.node.answers.forEach((answer) => {
      if (
        answer.token === this.pendingCustomOptionForm?.answer.token ||
        answer.value == null
      )
        return;

      const matchedOption = this.matchedOptionsByAnswerToken.get(answer.token);
      if (matchedOption) {
        selectedOptions.push({
          token: matchedOption.token,
          answer,
          value: answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
          answerType: this.node.type,
          disabled:
            (this.isMultiSelect ? false : matchedOption.disabled) ||
            (this.isMultiSelect && !this.canRemoveSelection),
        });
        return;
      }

      const token = this.allowCustom
        ? this.getCustomTokenForValue(answer.value)
        : this.getLegacyTokenForValue(answer.value);
      if (!token) return;
      selectedOptions.push({
        token,
        answer,
        value: answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
        answerType: this.allowCustom ? this.customAnswerType : this.node.type,
        disabled:
          !this.allowCustom || (this.isMultiSelect && !this.canRemoveSelection),
      });
    });

    return selectedOptions;
  }

  @computed
  get selectedOptionTokens(): ReadonlySet<OptionToken> {
    return new Set(this.selectedOptions.map((entry) => entry.token));
  }

  @computed
  get answersByOptionToken(): ReadonlyMap<OptionToken, IAnswerInstance<T>> {
    return this.selectedOptions.reduce(
      (map, entry) => map.set(entry.token, entry.answer),
      new Map<OptionToken, IAnswerInstance<T>>(),
    );
  }

  @computed
  get availableAnswers(): ReadonlyArray<IAnswerInstance<T>> {
    return this.node.answers.filter(
      (answer) =>
        answer.value == null &&
        answer.token !== this.pendingCustomOptionForm?.answer.token &&
        !this.customAnswerTokens.has(answer.token),
    );
  }

  getOption(
    token: OptionToken,
  ): AnswerOption<T> | AnswerOption<"string"> | undefined {
    return this.options.find((entry) => entry.token === token);
  }

  private isInherentToken(token: OptionToken) {
    return this.inherentOptions.some((option) => option.token === token);
  }

  getSelectedOption(
    answer: IAnswerInstance<T>,
  ): SelectedAnswerOption<T> | null {
    return (
      this.selectedOptions.find(
        (entry) => entry.answer.token === answer.token,
      ) ?? null
    );
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
    return this.node.canRemove;
  }

  @computed
  get specifyOtherToken(): OptionToken {
    return `${this.node.token}_/_specify_other`;
  }

  private getCustomTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | null,
  ): OptionToken {
    if (value == null) return "";
    const baseToken = tokenify(this.customDataType, value);
    return baseToken ? `${this.node.token}_/_custom_${baseToken}` : "";
  }

  private getLegacyTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): OptionToken {
    if (value == null) return "";
    const baseToken = tokenify(this.dataType, value);
    return baseToken ? `${this.node.token}_/_legacy_${baseToken}` : "";
  }

  @action.bound
  private rememberCustomValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | null,
  ) {
    if (!this.allowCustom) return;
    if (
      value == null ||
      (typeof value === "string" && value.trim().length === 0)
    )
      return;
    const token = this.getCustomTokenForValue(value);
    if (!token || this.extraOptionsByToken.has(token)) return;
    const cloned = structuredClone(value) as
      | DataTypeToType<AnswerTypeToDataType<T>>
      | string;
    this.extraOptionsByToken.set(token, {
      token,
      value: cloned,
      answerType: this.customAnswerType,
      disabled: false,
    } as AnswerOption<T> | AnswerOption<"string">);
  }

  @action.bound
  private rememberLegacyValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ) {
    if (this.allowCustom) return;
    if (
      value == null ||
      (typeof value === "string" && value.trim().length === 0)
    )
      return;
    const token = this.getLegacyTokenForValue(value);
    if (!token || this.extraOptionsByToken.has(token)) return;
    this.extraOptionsByToken.set(token, {
      token,
      value: structuredClone(value) as DataTypeToType<AnswerTypeToDataType<T>>,
      answerType: this.node.type,
      disabled: true,
    });
  }

  @action.bound
  private addCustomValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | null,
  ) {
    if (!this.allowCustom) return;
    if (this.isLoading || !this.canAddSelection) return;
    if (
      value == null ||
      (typeof value === "string" && value.trim().length === 0)
    )
      return;
    this.rememberCustomValue(value);
    const nextValue = structuredClone(value) as DataTypeToType<
      AnswerTypeToDataType<T>
    >;
    const slot = this.takeAvailableAnswer();
    if (slot) {
      this.customAnswerTokens.add(slot.token);
      slot.setValueByUser(nextValue);
      return;
    }
    if (this.node.canAdd) {
      const created = this.node.addAnswer(nextValue);
      if (created) {
        this.customAnswerTokens.add(created.token);
      }
    }
  }

  get customOptionFormState(): CustomOptionFormState<T> | undefined {
    return this.pendingCustomOptionForm && this.allowCustom
      ? {
          answer: this.pendingCustomOptionForm.answer,
          isNew: this.pendingCustomOptionForm.isNew,
          canSubmit: answerHasContent(this.pendingCustomOptionForm.answer),
        }
      : undefined;
  }

  @action.bound
  selectOption(token: OptionToken): void {
    if (!token) return;
    if (token === this.specifyOtherToken) {
      this.openCustomOptionForm();
      return;
    }
    const entry = this.getOption(token);
    if (!entry || entry.disabled) return;
    if (!this.isInherentToken(entry.token)) {
      if (this.allowCustom) {
        this.addCustomValue(entry.value);
      }
      return;
    }
    this.addOptionValue(
      entry.token,
      entry.value as DataTypeToType<AnswerTypeToDataType<T>>,
    );
  }

  @action.bound
  selectOptionForAnswer(
    answer: IAnswerInstance<T>,
    token: OptionToken | null,
  ): void {
    const isCustomActive =
      this.customOptionFormState?.answer.token === answer.token;
    if (token == null) {
      if (isCustomActive) {
        this.cancelCustomOptionForm();
        return;
      }
      this.rememberAnswerValue(answer);
      this.customAnswerTokens.delete(answer.token);
      answer.setValueByUser(null);
      return;
    }

    if (token === this.specifyOtherToken) {
      this.rememberAnswerValue(answer);
      this.openCustomOptionForm(answer);
      return;
    }

    if (isCustomActive) {
      this.cancelCustomOptionForm();
    } else {
      this.rememberAnswerValue(answer);
    }

    const entry = this.getOption(token);
    if (!entry || entry.disabled) return;
    if (!this.isInherentToken(entry.token) && this.allowCustom) {
      this.customAnswerTokens.add(answer.token);
    } else {
      this.customAnswerTokens.delete(answer.token);
    }
    const nextValue = structuredClone(entry.value) as DataTypeToType<
      AnswerTypeToDataType<T>
    >;
    answer.setValueByUser(nextValue);
  }

  @action.bound
  removeAnswer(answer: IAnswerInstance<T>): void {
    if (!this.canRemoveSelection) return;
    this.rememberAnswerValue(answer);
    this.customAnswerTokens.delete(answer.token);
    this.node.removeAnswer(answer);
  }

  private rememberAnswerValue(answer: IAnswerInstance<T>) {
    if (answer.value == null) return;
    const selection = this.getSelectedOption(answer);
    if (!selection) return;
    if (this.isInherentToken(selection.token)) return;
    if (this.allowCustom) {
      this.rememberCustomValue(
        answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
      );
      return;
    }
    this.rememberLegacyValue(
      answer.value as DataTypeToType<AnswerTypeToDataType<T>>,
    );
  }

  @action.bound
  openCustomOptionForm(answer?: IAnswerInstance<T>) {
    if (!this.allowCustom) return;
    if (this.pendingCustomOptionForm) return;
    if (answer?.value == null && (this.isLoading || !this.canAddSelection)) {
      return;
    }

    if (answer) {
      this.customAnswerTokens.add(answer.token);
      answer.setValueByUser(null);
      this.pendingCustomOptionForm = {
        answer,
        isNew: false,
        canSubmit: false,
      };
      return;
    }

    const slot = this.takeAvailableAnswer();
    if (slot) {
      this.customAnswerTokens.add(slot.token);
      this.pendingCustomOptionForm = {
        answer: slot,
        isNew: false,
        canSubmit: false,
      };
      return;
    }
    if (this.node.canAdd) {
      const created = this.node.addAnswer(null);
      if (created) {
        this.customAnswerTokens.add(created.token);
        this.pendingCustomOptionForm = {
          answer: created as IAnswerInstance<T>,
          isNew: true,
          canSubmit: false,
        };
      }
    }
  }

  @action.bound
  cancelCustomOptionForm() {
    if (!this.pendingCustomOptionForm) return;
    this.customAnswerTokens.delete(this.pendingCustomOptionForm.answer.token);
    if (this.pendingCustomOptionForm.isNew) {
      this.node.removeAnswer(this.pendingCustomOptionForm.answer);
    } else {
      this.pendingCustomOptionForm.answer.setValueByUser(null);
    }
    this.pendingCustomOptionForm = undefined;
  }

  @action.bound
  submitCustomOptionForm() {
    if (!this.pendingCustomOptionForm) return;
    this.rememberCustomValue(
      this.pendingCustomOptionForm.answer.value as DataTypeToType<
        AnswerTypeToDataType<T>
      >,
    );
    this.pendingCustomOptionForm = undefined;
  }

  private buildOptions(
    options: ReadonlyArray<AnswerOption<T>>,
  ): ReadonlyArray<AnswerOption<T> | AnswerOption<"string">> {
    const extraEntries = [...this.extraOptionsByToken.values()];
    const knownTokens = new Set(
      [...options, ...extraEntries].map((entry) => entry.token),
    );
    const selectionExtras = this.selectedOptions.flatMap((selection) => {
      if (knownTokens.has(selection.token)) return [];
      return [
        {
          token: selection.token,
          value: selection.value,
          disabled: selection.disabled,
          answerType: selection.answerType,
        } as AnswerOption<T> | AnswerOption<"string">,
      ];
    });
    const entries: Array<AnswerOption<T> | AnswerOption<"string">> = [
      ...options,
      ...extraEntries,
      ...selectionExtras,
    ];
    if (!this.isMultiSelect) {
      return entries;
    }
    return entries.map((entry) => {
      const disabled =
        entry.disabled ||
        (!this.selectedOptionTokens.has(entry.token) &&
          !this.canAddSelection) ||
        (this.selectedOptionTokens.has(entry.token) &&
          !this.canRemoveSelection);
      if (disabled === entry.disabled) {
        return entry;
      }
      return { ...entry, disabled };
    });
  }

  private takeAvailableAnswer() {
    return this.availableAnswers[0];
  }

  private get dataType() {
    return ANSWER_TYPE_TO_DATA_TYPE[this.node.type];
  }

  private get customAnswerType() {
    return this.node.answerOptions.constraint === "optionsOrString"
      ? "string"
      : this.node.type;
  }

  private get customDataType() {
    return this.node.answerOptions.constraint === "optionsOrString"
      ? "string"
      : this.dataType;
  }

  private addOptionValue(
    token: OptionToken,
    value: DataTypeToType<AnswerTypeToDataType<T>>,
  ) {
    if (!this.canAddSelection || this.isLoading) return;
    if (this.selectedOptionTokens.has(token)) return;
    const nextValue = structuredClone(value) as DataTypeToType<
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
