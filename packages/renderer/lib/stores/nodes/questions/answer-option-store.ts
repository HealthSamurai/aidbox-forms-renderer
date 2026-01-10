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
  IAnswerInstance,
  IAnswerOptions,
  IQuestionNode,
  OptionToken,
  SelectedAnswerOption,
} from "../../../types.ts";
import type {
  Coding,
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  answerHasContent,
  answerify,
  areValuesEqual,
  booleanify,
  buildId,
  getValue,
  OPTIONS_ISSUE_EXPRESSION,
  tokenify,
} from "../../../utils.ts";
import type { IPromiseBasedObservable } from "mobx-utils";
import { fromPromise } from "mobx-utils";
import { strings } from "../../../strings.ts";

function getOptionsErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error == null) {
    return strings.errors.unknown;
  }
  return String(error);
}

function toOptionsIssue(error: unknown): OperationOutcomeIssue {
  const message = getOptionsErrorMessage(error);
  return {
    severity: "error",
    code: "invalid",
    diagnostics: message,
    details: { text: message },
    expression: [OPTIONS_ISSUE_EXPRESSION],
  };
}

export class AnswerOptionStore<
  T extends AnswerType,
> implements IAnswerOptions<T> {
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

  constructor(private readonly question: IQuestionNode<T>) {
    makeObservable(this);
  }

  @computed
  private get answerOptions(): QuestionnaireItemAnswerOption[] {
    const slot = this.question.expressionRegistry.answer;
    if (slot) {
      return answerify(this.question.type, slot.value);
    }

    if (this.expandedValueSetOptions) {
      return this.expandedValueSetOptions;
    }

    return this.question.template.answerOption ?? [];
  }

  @computed.struct
  private get expandedValueSetOptions():
    | QuestionnaireItemAnswerOption[]
    | null {
    return (
      this.expansion?.case({
        fulfilled: (value) =>
          value.map((coding: Coding) => ({
            valueCoding: coding,
          })),
      }) ?? null
    );
  }

  @computed({ keepAlive: true })
  private get expansion(): IPromiseBasedObservable<Coding[]> | null {
    return this.question.template.answerValueSet
      ? fromPromise(
          this.question.form.valueSetExpander.expand(
            this.question.template.answerValueSet,
            this.question.preferredTerminologyServers,
          ),
        )
      : null;
  }

  @computed
  get error(): OperationOutcomeIssue | null {
    return (
      this.expansion?.case({
        rejected: (error) => toOptionsIssue(error),
      }) ?? null
    );
  }

  @computed
  get inherentOptions(): AnswerOption<T>[] {
    if (this.question.type === "boolean" && this.answerOptions.length === 0) {
      return [
        {
          token: buildId(this.question.token, "true"),
          value: true,
          disabled: false,
          answerType: "boolean",
        },
        {
          token: buildId(this.question.token, "false"),
          value: false,
          disabled: false,
          answerType: "boolean",
        },
        ...(this.question.repeats
          ? []
          : [
              {
                token: buildId(this.question.token, "null"),
                value: null,
                disabled: false,
                answerType: "boolean",
              },
            ]),
      ] as AnswerOption<T>[];
    }

    const seen = new Set<OptionToken>();
    return this.answerOptions.flatMap((option) => {
      const value = getValue(this.dataType, option);
      if (value == null) {
        return [];
      }

      const token = tokenify(this.dataType, value) as OptionToken;
      if (seen.has(token)) {
        return [];
      }
      seen.add(token);

      const disabled = !this.isOptionEnabled(option);

      return [
        {
          token,
          value,
          disabled,
          answerType: this.question.type,
        } satisfies AnswerOption<T>,
      ];
    });
  }

  @computed
  get constraint(): QuestionnaireItem["answerConstraint"] {
    return this.question.template.answerConstraint ?? "optionsOnly";
  }

  private isOptionEnabled(option: QuestionnaireItemAnswerOption): boolean {
    const toggles = this.question.expressionRegistry.answerOptionToggles;
    if (toggles.length === 0) {
      return true;
    }

    const optionValue = getValue(this.dataType, option);
    if (optionValue === undefined) {
      return true;
    }

    let matched = false;
    for (const toggle of toggles) {
      const toggleMatches = toggle.options.some((candidate) => {
        const candidateValue = getValue(this.dataType, candidate);
        return candidateValue === undefined
          ? false
          : areValuesEqual(this.dataType, candidateValue, optionValue);
      });

      if (toggleMatches) {
        matched = true;
        if (booleanify(toggle.slot.value)) {
          return true;
        }
      }
    }

    return !matched;
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
      keysByType[this.dataType] ?? ["value"],
      {
        caseSensitive: false,
        sort: true,
      },
    );
  }

  @computed
  get isLoading(): boolean {
    return this.expansion?.state === "pending";
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
      !this.searchQuery
        ? this.inherentOptions
        : this.searchIndex.search(this.searchQuery),
    );
  }

  @computed
  private get matchedOptionsByAnswerToken() {
    return this.inherentOptions.reduce((matches, option) => {
      const match = this.question.answers.find((answer) => {
        if (
          answer.token === this.pendingCustomOptionForm?.answer.token ||
          this.customAnswerTokens.has(answer.token)
        )
          return false;
        return areValuesEqual(this.dataType, answer.value, option.value);
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
        answerType: this.allowCustom
          ? this.customAnswerType
          : this.question.type,
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
    if (!entry || entry.disabled || entry.value == null) return;
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

    const entry = this.findOptionByToken(token);
    if (!entry || entry.disabled) return;

    if (entry.value == null) {
      if (isCustomActive) {
        this.cancelCustomOptionForm();
      }
      this.rememberAnswerValue(answer);
      this.customAnswerTokens.delete(answer.token);
      answer.setValueByUser(null);
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

  private isInherentToken(token: OptionToken) {
    return this.inherentOptions.some((option) => option.token === token);
  }

  private getCustomTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | string | null,
  ): OptionToken {
    if (value == null) return "";
    const baseToken = tokenify(this.customDataType, value);
    return baseToken ? buildId(this.question.token, "custom", baseToken) : "";
  }

  private getLegacyTokenForValue(
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): OptionToken {
    if (value == null) return "";
    const baseToken = tokenify(this.dataType, value);
    return baseToken ? buildId(this.question.token, "legacy", baseToken) : "";
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
      answerType: this.question.type,
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
  private openCustomOptionForm(answer?: IAnswerInstance<T>) {
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
      const created = this.question.addAnswer(null);
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
        answer.value == null &&
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

  private get dataType() {
    return ANSWER_TYPE_TO_DATA_TYPE[this.question.type];
  }

  private get customAnswerType() {
    return this.constraint === "optionsOrString"
      ? "string"
      : this.question.type;
  }

  private get customDataType() {
    return this.constraint === "optionsOrString" ? "string" : this.dataType;
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
}
