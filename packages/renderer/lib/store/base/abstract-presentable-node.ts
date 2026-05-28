import { action, computed, makeObservable, observable } from "mobx";
import {
  HasNodePath,
  IForm,
  INode,
  IPresentableNode,
  IScope,
} from "../../types.ts";
import type { Hyperlink, NodePath } from "@formbox/theme";
import type {
  Attachment,
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "@formbox/fhir";
import {
  dedupe,
  EXT,
  extractCustomExtensions,
  extractExtensionsValues,
  extractExtensionValue,
  findDisplayItemByControl,
  findExtension,
  findExtensions,
  getTranslated,
  withNodePathSegment,
} from "../../utilities.ts";

export abstract class AbstractPresentableNode implements IPresentableNode {
  readonly form: IForm;
  readonly template: QuestionnaireItem;
  readonly parentStore: INode | undefined;
  private readonly pathParent: HasNodePath | undefined;
  @observable
  private expanded: boolean | undefined = undefined;

  protected constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | undefined,
    pathParent: HasNodePath | undefined,
  ) {
    this.form = form;
    this.template = template;
    this.parentStore = parentStore;
    this.pathParent = pathParent;

    makeObservable(this);
  }

  @computed({ keepAlive: true })
  get path(): NodePath {
    return withNodePathSegment(this.pathParent?.path ?? [], this.linkId);
  }

  @computed({ keepAlive: true })
  get customExtensions(): Readonly<Record<string, unknown>> {
    return extractCustomExtensions(
      this.template,
      this.form.customExtensionDefinitions,
      "item",
    );
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
  get adapter() {
    return this.form.adapter;
  }

  @computed
  get type() {
    return this.adapter.questionnaireItem.getType(this.template);
  }

  @computed
  get text() {
    return getTranslated(this.template, "text", this.form.language);
  }

  @computed
  get shortText() {
    return getTranslated(
      findExtension(this.template, EXT.SDC_SHORT_TEXT),
      "valueString",
      this.form.language,
    );
  }

  @computed
  get supportHyperlinks(): Hyperlink[] {
    return [
      ...findExtensions(this.template, EXT.SUPPORT_HYPERLINK).flatMap(
        (extension) => {
          const link = findExtension(extension, "link")?.valueUri;
          const label = getTranslated(
            findExtension(extension, "label"),
            "valueString",
            this.form.language,
          );

          return link ? [{ href: link, label: label }] : [];
        },
      ),
      ...findExtensions(this.template, EXT.SUPPORT_LINK).flatMap((extension) =>
        extension.valueUri
          ? [{ href: extension.valueUri, label: undefined }]
          : [],
      ),
    ];
  }

  @computed
  get isExpandable(): boolean {
    return (
      findExtension(this.template, EXT.SDC_COLLAPSIBLE)?.valueCode !== undefined
    );
  }

  @computed
  get isExpanded(): boolean {
    if (!this.isExpandable) {
      return true;
    }

    return (
      this.expanded ??
      findExtension(this.template, EXT.SDC_COLLAPSIBLE)?.valueCode !==
        "default-closed"
    );
  }

  @action.bound
  toggleExpanded(): void {
    if (!this.isExpandable) {
      return;
    }

    this.expanded = !this.isExpanded;
  }

  @computed
  get itemMedia(): Attachment | undefined {
    return findExtension(this.template, EXT.SDC_ITEM_MEDIA)?.valueAttachment;
  }

  @computed
  get prefix() {
    return getTranslated(this.template, "prefix", this.form.language);
  }

  @computed
  get help() {
    return getTranslated(
      findDisplayItemByControl(this.template, "help", this.adapter),
      "text",
      this.form.language,
    );
  }

  @computed
  get legal() {
    return getTranslated(
      findDisplayItemByControl(this.template, "legal", this.adapter),
      "text",
      this.form.language,
    );
  }

  @computed
  get placeholder() {
    return (
      getTranslated(
        findExtension(this.template, EXT.ENTRY_FORMAT),
        "valueString",
        this.form.language,
      ) ??
      getTranslated(
        findDisplayItemByControl(this.template, "prompt", this.adapter),
        "text",
        this.form.language,
      )
    );
  }

  @computed
  get flyover() {
    return getTranslated(
      findDisplayItemByControl(this.template, "flyover", this.adapter),
      "text",
      this.form.language,
    );
  }

  @computed
  get upper() {
    return getTranslated(
      findDisplayItemByControl(this.template, "upper", this.adapter),
      "text",
      this.form.language,
    );
  }

  @computed
  get lower() {
    return getTranslated(
      findDisplayItemByControl(this.template, "lower", this.adapter),
      "text",
      this.form.language,
    );
  }

  @computed
  get required() {
    return !!this.template.required;
  }

  @computed
  private get usageMode(): string | undefined {
    return extractExtensionValue("code", this.template, EXT.USAGE_MODE);
  }

  @computed
  private get isEnabledByUsageMode(): boolean {
    // prettier-ignore
    return this.usageMode === "capture-display"           ? true :
           this.usageMode === "capture"                   ? this.form.mode === "capture" :
           this.usageMode === "display"                   ? this.form.mode === "display" :
           this.usageMode === "display-non-empty"         ? this.form.mode === "display" && this.hasResponseContent :
           this.usageMode === "capture-display-non-empty" ? this.form.mode === "capture" || this.hasResponseContent : true;
  }

  @computed
  get isEnabled(): boolean {
    if (!this.isEnabledByUsageMode) {
      return false;
    }

    if (this.parentStore && !this.parentStore.isEnabled) {
      return false;
    }

    return this._isEnabled;
  }

  @computed
  get readOnly() {
    // Group-level readOnly cascades; individual questions only affect themselves.
    const parent = this.parentStore;
    if (parent && parent.type === "group" && parent.readOnly) {
      return true;
    }

    return (
      this._readOnly ||
      (!this.isEnabled &&
        this.adapter.questionnaireItem.getDisabledDisplay(this.template) ===
          "protected")
    );
  }

  @computed
  get hidden() {
    // Explicit questionnaire-hidden wins; otherwise disabled items vanish unless protected.
    if (findExtension(this.template, EXT.HIDDEN)?.valueBoolean === true) {
      return true;
    }

    if (!this.isEnabled) {
      return (
        this.adapter.questionnaireItem.getDisabledDisplay(this.template) !==
        "protected"
      );
    }

    return false;
  }

  @computed
  get hasResponseContent(): boolean {
    return false;
  }

  @computed
  get unitDisplay(): string | undefined {
    if (this.type !== "integer" && this.type !== "decimal") {
      return undefined;
    }

    return (
      getTranslated(
        findDisplayItemByControl(this.template, "unit", this.adapter),
        "text",
        this.form.language,
      ) ??
      getTranslated(
        findExtension(this.template, EXT.QUESTIONNAIRE_UNIT)?.valueCoding,
        "display",
        this.form.language,
      )
    );
  }

  @computed
  get preferredTerminologyServers(): readonly string[] {
    const ownPreferences = dedupe([
      ...extractExtensionsValues(
        "url",
        this.template,
        EXT.PREFERRED_TERMINOLOGY_SERVER,
      ),
      ...extractExtensionsValues(
        "url",
        this.template,
        EXT.DEPRECATED_SDC_PREFERRED_TERMINOLOGY_SERVER,
      ),
    ]);

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
