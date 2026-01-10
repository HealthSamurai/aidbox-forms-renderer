import { computed, makeObservable } from "mobx";
import { IForm, INode, IPresentableNode, IScope } from "../../../types.ts";
import type {
  Coding,
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";
import {
  dedupe,
  EXT,
  extractExtensionsValues,
  findDisplayItemByControl,
  findExtension,
} from "../../../utils.ts";

export abstract class AbstractPresentableNode implements IPresentableNode {
  readonly form: IForm;
  readonly template: QuestionnaireItem;
  readonly parentStore: INode | null;

  protected constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
  ) {
    makeObservable(this);

    this.form = form;
    this.template = template;
    this.parentStore = parentStore;
  }

  @computed
  get linkId() {
    const { linkId } = this.template;
    if (!linkId) {
      throw new Error("Questionnaire item linkId is missing.");
    }
    return linkId;
  }

  @computed
  get text() {
    return this.template.text;
  }

  @computed
  get prefix() {
    return this.template.prefix;
  }

  @computed
  get help() {
    return findDisplayItemByControl(this.template, "help")?.text;
  }

  @computed
  get legal() {
    return findDisplayItemByControl(this.template, "legal")?.text;
  }

  @computed
  get placeholder() {
    return (
      findExtension(this.template, EXT.ENTRY_FORMAT)?.valueString ??
      findDisplayItemByControl(this.template, "prompt")?.text
    );
  }

  @computed
  get flyover() {
    return findDisplayItemByControl(this.template, "flyover")?.text;
  }

  @computed
  get upper() {
    return findDisplayItemByControl(this.template, "upper")?.text;
  }

  @computed
  get lower() {
    return findDisplayItemByControl(this.template, "lower")?.text;
  }

  @computed
  get required() {
    return !!this.template.required;
  }

  @computed
  get isEnabled(): boolean {
    if (this.parentStore && !this.parentStore.isEnabled) {
      return false;
    }

    return this._isEnabled;
  }

  @computed
  get readOnly() {
    // Group-level readOnly cascades; individual questions only affect themselves.
    const parent = this.parentStore;
    if (parent && parent.template.type === "group" && parent.readOnly) {
      return true;
    }

    return (
      this._readOnly ||
      (!this.isEnabled && this.template.disabledDisplay === "protected")
    );
  }

  @computed
  get hidden() {
    // Explicit questionnaire-hidden wins; otherwise disabled items vanish unless protected.
    if (findExtension(this.template, EXT.HIDDEN)?.valueBoolean === true) {
      return true;
    }

    if (!this.isEnabled) {
      return this.template.disabledDisplay !== "protected";
    }

    return false;
  }

  @computed
  get unitDisplay(): string | undefined {
    if (this.template.type !== "integer" && this.template.type !== "decimal") {
      return undefined;
    }

    return (
      findDisplayItemByControl(this.template, "unit")?.text ??
      findExtension(this.template, EXT.QUESTIONNAIRE_UNIT)?.valueCoding?.display
    );
  }

  @computed
  get unitOptions(): readonly Coding[] {
    return this.template.type !== "quantity"
      ? []
      : (this.template.extension ?? [])
          .filter(({ url }) => url === EXT.QUESTIONNAIRE_UNIT_OPTION)
          .map((extension) => extension.valueCoding)
          .filter((coding): coding is Coding => coding != null);
  }

  @computed
  get preferredTerminologyServers(): readonly string[] {
    const ownPreferences = extractExtensionsValues(
      "url",
      this.template,
      EXT.PREFERRED_TERMINOLOGY_SERVER,
    );

    const inheritedPreferences =
      this.parentStore?.preferredTerminologyServers ??
      this.form.preferredTerminologyServers;

    if (ownPreferences.length === 0) {
      return inheritedPreferences;
    }

    return dedupe([...ownPreferences, ...inheritedPreferences]);
  }

  abstract get scope(): IScope;

  abstract get token(): string;

  protected abstract get _isEnabled(): boolean;

  protected abstract get _readOnly(): boolean;

  abstract get hasErrors(): boolean;

  abstract markDirty(): void;

  abstract clearDirty(): void;

  abstract get responseItems(): QuestionnaireResponseItem[];

  abstract get expressionItems(): QuestionnaireResponseItem[];

  abstract get issues(): Array<OperationOutcomeIssue>;

  abstract dispose(): void;
}
