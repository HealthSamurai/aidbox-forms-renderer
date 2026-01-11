import { action, computed, makeObservable, observable } from "mobx";
import FuzzySearch from "fuzzy-search";
import type {
  AnswerOption,
  AnswerToken,
  AnswerType,
  AnswerTypeToDataType,
  CustomOptionFormState,
  DataType,
  DataTypeToType,
  IAnswer,
  IOptionSelection,
  IQuestionNode,
  OptionToken,
  SelectedAnswerOption,
} from "../../../types.ts";
import {
  answerHasContent,
  areValuesEqual,
  buildId,
  ANSWER_TYPE_TO_DATA_TYPE,
  tokenify,
} from "../../../utilities.ts";
import type { AnswerOptionStore } from "../answer-option-store.ts";

export class OptionSelection<
  T extends AnswerType,
> implements IOptionSelection<T> {
  private readonly store: AnswerOptionStore<T>;
  private readonly question: IQuestionNode<T>;

  private readonly customAnswerTokens = observable.set<AnswerToken>();

  @observable
  private pendingCustomOptionForm: CustomOptionFormState<T> | undefined =
    undefined;

  private readonly extraOptionsByToken = observable.map<
    OptionToken,
    AnswerOption<T> | AnswerOption<"string">
  >({}, { deep: false, name: "AnswerOptionStore.extraOptionsByToken" });

  @observable
  private searchQuery = "";

  constructor(question: IQuestionNode<T>, store: AnswerOptionStore<T>) {
    makeObservable(this);

    this.question = question;
    this.store = store;
  }

  @computed
  get isLoading(): boolean {
    return this.store.isLoading;
  }

  @computed
  get customType(): AnswerType {
    return this.constraint === "optionsOrString"
      ? "string"
      : this.question.type;
  }

  @computed
  get allowCustom(): boolean {
    return (
      this.constraint === "optionsOrString" ||
      this.constraint === "optionsOrType"
    );
  }

  @computed
  get filteredOptions(): ReadonlyArray<
    AnswerOption<T> | AnswerOption<"string">
  > {
    return this.buildOptions(
      this.searchQuery
        ? this.searchIndex.search(this.searchQuery)
        : this.inherentOptions,
    );
  }

  @computed
  private get matchedOptionsByAnswerToken() {
    return this.inherentOptions.reduce((matches, option) => {
      const match = this.question.answers.find((answer) => {
        if (
          answer.token === this.pendingCustomOptionForm?.answer.token ||
          this.customAnswerTokens.has(answer.token)
        ) {
          return false;
        }
        return areValuesEqual(
          this.question.dataType,
          answer.value,
          option.value,
        );
      });
      return match
        ? matches.set(match.token, {
            token: option.token,
            disabled: option.disabled,
          })
        : matches;
    }, new Map<AnswerToken, { token: OptionToken; disabled: boolean }>());
  }

  @computed
  get selectedOptions(): ReadonlyArray<SelectedAnswerOption<T>> {
    const selectedOptions: SelectedAnswerOption<T>[] = [];

    this.question.answers.forEach((answer) => {
      if (answer.token === this.pendingCustomOptionForm?.answer.token) return;

      const matchedOption = this.matchedOptionsByAnswerToken.get(answer.token);
      if (matchedOption) {
        selectedOptions.push({
          token: matchedOption.token,
          answer,
          value: answer.value,
          answerType: this.question.type,
          disabled:
            (this.question.isRepeatingWithoutChildren
              ? false
              : matchedOption.disabled) ||
            (this.question.isRepeatingWithoutChildren &&
              !this.question.canRemove),
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
        value: answer.value,
        answerType: this.allowCustom ? this.customType : this.question.type,
        disabled:
          !this.allowCustom ||
          (this.question.isRepeatingWithoutChildren &&
            !this.question.canRemove),
      });
    });

    return selectedOptions;
  }

  @computed
  get canAddSelection(): boolean {
    return (
      !this.question.readOnly &&
      (this.question.canAdd || Boolean(this.findAvailableAnswer()))
    );
  }

  @computed
  get specifyOtherToken(): OptionToken {
    return buildId(this.question.token, "specify_other");
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

  getSelectedOption(answer: IAnswer<T>): SelectedAnswerOption<T> | undefined {
    return this.selectedOptions.find(
      (entry) => entry.answer.token === answer.token,
    );
  }

  @action.bound
  setSearchQuery(query: string): void {
    this.searchQuery = query.trim();
  }

  @action.bound
  selectOption(token: OptionToken): void {
    if (!token) return;
    if (token === this.specifyOtherToken) {
      this.openCustomOptionForm();
      return;
    }
    const entry = this.findOptionByToken(token);
    if (!entry || entry.disabled || entry.value == undefined) return;
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
  deselectOption(token: OptionToken): void {
    if (!token) return;
    if (token === this.specifyOtherToken) {
      this.cancelCustomOptionForm();
      return;
    }
    const selection = this.selectedOptions.find(
      (entry) => entry.token === token,
    );
    if (!selection || !this.question.canRemove) return;
    this.rememberAnswerValue(selection.answer);
    this.customAnswerTokens.delete(selection.answer.token);
    this.question.removeAnswer(selection.answer);
  }

  @action.bound
  selectOptionForAnswer(answer: IAnswer<T>, token?: OptionToken): void {
    const isCustomActive =
      this.customOptionFormState?.answer.token === answer.token;

    if (token == undefined) {
      if (isCustomActive) {
        this.cancelCustomOptionForm();
        return;
      }
      this.rememberAnswerValue(answer);
      this.customAnswerTokens.delete(answer.token);
      answer.setValueByUser();
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

    const entry = this.findOptionByToken(token);
    if (!entry || entry.disabled) return;

    if (entry.value == undefined) {
      if (isCustomActive) {
        this.cancelCustomOptionForm();
      }
      this.rememberAnswerValue(answer);
      this.customAnswerTokens.delete(answer.token);
      answer.setValueByUser();
      return;
    }

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
  cancelCustomOptionForm() {
    if (!this.pendingCustomOptionForm) return;
    this.customAnswerTokens.delete(this.pendingCustomOptionForm.answer.token);
    if (this.pendingCustomOptionForm.isNew) {
      this.question.removeAnswer(this.pendingCustomOptionForm.answer);
    } else {
      this.pendingCustomOptionForm.answer.setValueByUser();
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

  private isInherentToken(token: OptionToken) {
    return this.inherentOptions.some((option) => option.token === token);
  }

  private getCustomTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | undefined,
  ): OptionToken {
    if (value == undefined) return "";
    const baseToken = tokenify(
      ANSWER_TYPE_TO_DATA_TYPE[this.customType],
      value,
    );
    return baseToken ? buildId(this.question.token, "custom", baseToken) : "";
  }

  private getLegacyTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | undefined,
  ): OptionToken {
    if (value == undefined) return "";
    const baseToken = tokenify(this.question.dataType, value);
    return baseToken ? buildId(this.question.token, "legacy", baseToken) : "";
  }

  @action.bound
  private rememberCustomValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | undefined,
  ) {
    if (!this.allowCustom) return;
    if (
      value == undefined ||
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
      answerType: this.customType,
      disabled: false,
    } as AnswerOption<T> | AnswerOption<"string">);
  }

  @action.bound
  private rememberLegacyValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | undefined,
  ) {
    if (this.allowCustom) return;
    if (
      value == undefined ||
      (typeof value === "string" && value.trim().length === 0)
    )
      return;
    const token = this.getLegacyTokenForValue(value);
    if (!token || this.extraOptionsByToken.has(token)) return;
    this.extraOptionsByToken.set(token, {
      token,
      value: structuredClone(value) as DataTypeToType<AnswerTypeToDataType<T>>,
      answerType: this.question.type,
      disabled: true,
    });
  }

  @action.bound
  private addCustomValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | undefined,
  ) {
    if (!this.allowCustom) return;
    if (this.isLoading || !this.canAddSelection) return;
    if (
      value == undefined ||
      (typeof value === "string" && value.trim().length === 0)
    )
      return;
    this.rememberCustomValue(value);
    const nextValue = structuredClone(value) as DataTypeToType<
      AnswerTypeToDataType<T>
    >;
    const slot = this.findAvailableAnswer();
    if (slot) {
      this.customAnswerTokens.add(slot.token);
      slot.setValueByUser(nextValue);
      return;
    }
    if (this.question.canAdd) {
      const created = this.question.addAnswer(nextValue);
      if (created) {
        this.customAnswerTokens.add(created.token);
      }
    }
  }

  private rememberAnswerValue(answer: IAnswer<T>) {
    if (answer.value == undefined) return;
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
  private openCustomOptionForm(answer?: IAnswer<T>) {
    if (!this.allowCustom) return;
    if (this.pendingCustomOptionForm) return;
    if (
      answer?.value == undefined &&
      (this.isLoading || !this.canAddSelection)
    ) {
      return;
    }

    if (answer) {
      this.customAnswerTokens.add(answer.token);
      answer.setValueByUser();
      this.pendingCustomOptionForm = {
        answer,
        isNew: false,
        canSubmit: false,
      };
      return;
    }

    const slot = this.findAvailableAnswer();
    if (slot) {
      this.customAnswerTokens.add(slot.token);
      this.pendingCustomOptionForm = {
        answer: slot,
        isNew: false,
        canSubmit: false,
      };
      return;
    }
    if (this.question.canAdd) {
      const created = this.question.addAnswer();
      if (created) {
        this.customAnswerTokens.add(created.token);
        this.pendingCustomOptionForm = {
          answer: created as IAnswer<T>,
          isNew: true,
          canSubmit: false,
        };
      }
    }
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
    if (!this.question.isRepeatingWithoutChildren) {
      return entries;
    }
    const selectedTokens = new Set(
      this.selectedOptions.map((entry) => entry.token),
    );
    return entries.map((entry) => {
      const isSelected = selectedTokens.has(entry.token);
      const disabled =
        entry.disabled ||
        (!isSelected && !this.canAddSelection) ||
        (isSelected && !this.question.canRemove);
      if (disabled === entry.disabled) {
        return entry;
      }
      return { ...entry, disabled };
    });
  }

  private findAvailableAnswer() {
    return this.question.answers.find(
      (answer) =>
        answer.value == undefined &&
        answer.token !== this.pendingCustomOptionForm?.answer.token &&
        !this.customAnswerTokens.has(answer.token),
    );
  }

  private findOptionByToken(
    token: OptionToken,
  ): AnswerOption<T> | AnswerOption<"string"> | undefined {
    return (
      this.inherentOptions.find((option) => option.token === token) ||
      this.extraOptionsByToken.get(token) ||
      this.selectedOptions.find((option) => option.token === token)
    );
  }

  private addOptionValue(
    token: OptionToken,
    value: DataTypeToType<AnswerTypeToDataType<T>>,
  ) {
    if (!this.canAddSelection || this.isLoading) return;
    if (this.selectedOptions.some((entry) => entry.token === token)) return;
    const nextValue = structuredClone(value) as DataTypeToType<
      AnswerTypeToDataType<T>
    >;
    const slot = this.findAvailableAnswer();
    if (slot) {
      slot.setValueByUser(nextValue);
      return;
    }
    this.question.addAnswer(nextValue);
  }

  private get inherentOptions() {
    return this.store.inherentOptions;
  }

  private get constraint() {
    return this.store.constraint;
  }

  @computed
  private get searchIndex() {
    const keysByType: Partial<Record<DataType, readonly string[]>> = {
      Coding: ["value.display", "value.code", "value.system", "value.version"],
      Reference: ["value.display", "value.reference", "value.identifier.value"],
      Quantity: ["value.unit", "value.code", "value.system", "value.value"],
      Attachment: ["value.title", "value.url", "value.contentType"],
    };

    return new FuzzySearch(
      this.inherentOptions,
      keysByType[this.question.dataType] ?? ["value"],
      {
        caseSensitive: false,
        sort: true,
      },
    );
  }
}
