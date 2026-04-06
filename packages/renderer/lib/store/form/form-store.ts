import {
  ExpressionEnvironment,
  GroupListRendererDefinition,
  GroupRendererDefinition,
  IExpressionEnvironmentProvider,
  IExpressionRegistry,
  IFhirAdapter,
  IForm,
  IGroupList,
  IGroupNode,
  INode,
  IPresentableNode,
  IQuestionNode,
  IScope,
  IValueSetExpander,
  LaunchContext,
  QuestionRendererDefinition,
  RenderMode,
  SnapshotKind,
} from "../../types.ts";
import { RendererRegistry } from "../../renderer-registry.ts";
import {
  groupLists as defaultGroupListRenderers,
  groups as defaultGroupRenderers,
  questions as defaultQuestionRenderers,
} from "../../renderer-definitions.ts";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import {
  type FhirVersion,
  type OperationOutcomeIssue,
  type Questionnaire,
  type QuestionnaireItem,
  type QuestionnaireOf,
  type QuestionnaireResponse,
  type QuestionnaireResponseItem,
  type QuestionnaireResponseOf,
  type Signature,
} from "@formbox/fhir";
import { isQuestionNode, QuestionStore } from "../question/question-store.ts";
import { GroupStore, isGroupNode } from "../group/group-store.ts";
import { DisplayStore } from "../display/display-store.ts";
import { GroupListStore, isGroupListStore } from "../group/group-list-store.ts";
import { EvaluationCoordinator } from "../expression/runtime/evaluation-coordinator.ts";
import {
  DuplicateVariableNameError,
  ReservedVariableNameError,
  Scope,
} from "../expression/runtime/scope.ts";
import { BaseExpressionRegistry } from "../expression/registry/base-expression-registry.ts";
import {
  buildId,
  clamp,
  dedupe,
  EXT,
  extractCustomExtensions,
  extractExtensionsValues,
  extractExtensionValue,
  findExtension,
  findExtensions,
  getIssueMessage,
  getItemControlCode,
  getTranslated,
  getTranslationLanguages,
  makeIssue,
  randomToken,
  shouldCreateStore,
} from "../../utilities.ts";
import { ValueSetExpander } from "../option/valueset-expander.ts";
import type {
  CustomExtensionDefinitions,
  FormPagination,
  Strings,
} from "@formbox/theme";
import { R4Adapter } from "../../fhir/r4-adapter.ts";
import { R5Adapter } from "../../fhir/r5-adapter.ts";

const SDC_LAUNCH_CONTEXT_CODE_SYSTEM =
  "http://hl7.org/fhir/uv/sdc/CodeSystem/launchContext";

const SDC_LAUNCH_CONTEXT_TYPES_BY_CODE: Record<string, readonly string[]> = {
  patient: ["Patient"],
  user: ["Patient", "Practitioner", "PractitionerRole", "RelatedPerson"],
  encounter: ["Encounter"],
  location: ["Location"],
  study: ["ResearchStudy"],
};

export class FormStore<V extends FhirVersion = FhirVersion>
  implements IForm, IExpressionEnvironmentProvider
{
  private readonly initialResponse: QuestionnaireResponse | undefined;
  readonly token = buildId("form", randomToken());
  readonly questionnaire: Questionnaire;

  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "FormStore.children",
  });

  private readonly renderingIssues = observable.array<OperationOutcomeIssue>(
    [],
    {
      deep: false,
      name: "FormStore.renderingIssues",
    },
  );

  readonly scope = new Scope(true);

  @observable
  private submitAttempted = false;

  @observable
  private pageIndex = 0;

  readonly coordinator = new EvaluationCoordinator();
  readonly questionRendererRegistry: RendererRegistry<
    IQuestionNode,
    QuestionRendererDefinition
  >;
  readonly groupRendererRegistry: RendererRegistry<
    IGroupNode,
    GroupRendererDefinition
  >;
  readonly groupListRendererRegistry: RendererRegistry<
    IGroupList,
    GroupListRendererDefinition
  >;
  readonly expressionRegistry: IExpressionRegistry;
  readonly valueSetExpander: IValueSetExpander;
  readonly adapter: IFhirAdapter;

  @observable.ref
  private stringsState: Strings;

  @observable.ref
  private languageState: string | undefined;

  @observable.ref
  private launchContextState: LaunchContext;

  @observable.ref
  private modeState: RenderMode | undefined;

  @observable.ref
  private signatureState: Signature | undefined;

  @observable.ref
  public readonly customExtensionDefinitions: CustomExtensionDefinitions;

  readonly availableLanguages: readonly string[];

  constructor(
    strings: Strings,
    readonly fhirVersion: V,
    questionnaire: QuestionnaireOf<V>,
    response?: QuestionnaireResponseOf<V>,
    terminologyServerUrl?: string,
    language?: string | undefined,
    launchContext?: LaunchContext | undefined,
    mode?: RenderMode | undefined,
    customExtensions?: CustomExtensionDefinitions | undefined,
  ) {
    this.questionRendererRegistry = new RendererRegistry(
      defaultQuestionRenderers,
    );

    this.groupRendererRegistry = new RendererRegistry(defaultGroupRenderers);
    this.groupListRendererRegistry = new RendererRegistry(
      defaultGroupListRenderers,
    );

    this.questionnaire = questionnaire as Questionnaire;
    this.customExtensionDefinitions = customExtensions || {};
    this.initialResponse = response as QuestionnaireResponse | undefined;
    this.stringsState = strings;
    this.signatureState = this.initialResponse
      ? extractExtensionsValues(
          "Signature",
          this.initialResponse,
          EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
        )[0]
      : undefined;
    this.availableLanguages = getTranslationLanguages(this.questionnaire);
    this.languageState = language ?? this.questionnaire.language;
    this.launchContextState = launchContext ? { ...launchContext } : {};
    this.modeState = mode;
    makeObservable(this);

    this.adapter =
      this.fhirVersion === "r4" ? new R4Adapter() : new R5Adapter();
    this.valueSetExpander = new ValueSetExpander(
      terminologyServerUrl ?? this.adapter.getDefaultTerminologyServer(),
    );

    this.expressionRegistry = new BaseExpressionRegistry(
      this.coordinator,
      this.scope,
      this,
      this.questionnaire,
    );
    this.registerLaunchContextSlots();

    runInAction(() => {
      this.nodes.replace(
        (this.questionnaire.item ?? [])
          .filter((item) => shouldCreateStore(item, this.adapter))
          .map((item) =>
            this.createNodeStore(
              item,
              undefined,
              this.scope,
              this.token,
              this.initialResponse?.item,
            ),
          ),
      );
    });

    this.validateTopLevelStructure();
  }

  @computed
  get expressionEnvironment(): ExpressionEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.questionnaire,
      context: this.expressionResponse,
    });
  }

  @computed
  get strings(): Strings {
    return this.stringsState;
  }

  @computed
  get language(): string | undefined {
    return this.languageState;
  }

  @computed
  get title(): string | undefined {
    return getTranslated(this.questionnaire, "title", this.language);
  }

  @computed
  get description(): string | undefined {
    return getTranslated(this.questionnaire, "description", this.language);
  }

  @computed
  get mode(): RenderMode {
    return (
      this.modeState ??
      (this.initialResponse?.status === "completed" ? "display" : "capture")
    );
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
      findExtension(this.questionnaire, EXT.SIGNATURE_REQUIRED) != undefined &&
      this.nodes.some((node) => node.responseItems.length > 0)
    );
  }

  @action
  setStrings(strings: Strings): void {
    this.stringsState = strings;
  }

  @action
  setLanguage(language: string | undefined): void {
    this.languageState = language;
  }

  @action
  setMode(mode: RenderMode | undefined): void {
    this.modeState = mode;
  }

  @action
  setLaunchContext(launchContext: LaunchContext | undefined): void {
    this.launchContextState = launchContext ? { ...launchContext } : {};
  }

  @computed
  get preferredTerminologyServers(): readonly string[] {
    return dedupe([
      ...extractExtensionsValues(
        "url",
        this.questionnaire,
        EXT.PREFERRED_TERMINOLOGY_SERVER,
      ),
      ...extractExtensionsValues(
        "url",
        this.questionnaire,
        EXT.DEPRECATED_SDC_PREFERRED_TERMINOLOGY_SERVER,
      ),
    ]);
  }

  @computed
  get headerNodes(): IGroupNode[] {
    return this.nodes.filter(
      (node): node is IGroupNode =>
        isGroupNode(node) && node.control === "header" && !node.hidden,
    );
  }

  @computed
  get footerNodes(): IGroupNode[] {
    return this.nodes.filter(
      (node): node is IGroupNode =>
        isGroupNode(node) && node.control === "footer" && !node.hidden,
    );
  }

  @computed
  get contentNodes(): IPresentableNode[] {
    const pages = this.pages;
    if (pages) {
      const maxPageIndex = Math.max(pages.length - 1, 0);
      return pages.length > 0
        ? [pages[clamp(this.pageIndex, 0, maxPageIndex)]]
        : [];
    }

    return this.nodes.filter((node) => {
      if (!isGroupControlNode(node)) {
        return true;
      }
      return node.control !== "header" && node.control !== "footer";
    });
  }

  @computed
  get pagination(): FormPagination | undefined {
    const pages = this.pages;
    if (!pages?.length) {
      return undefined;
    }

    const pageIndex = clamp(this.pageIndex, 0, pages.length - 1);

    return {
      current: pageIndex + 1,
      total: pages.length,
      disabledPrev: pageIndex === 0,
      onPrev: action(() => {
        this.pageIndex = clamp(this.pageIndex - 1, 0, pages.length - 1);
      }),
      disabledNext: pageIndex >= pages.length - 1,
      onNext: action(() => {
        this.pageIndex = clamp(this.pageIndex + 1, 0, pages.length - 1);
      }),
    };
  }

  @computed
  private get pages(): IPresentableNode[] | undefined {
    const pages = this.nodes.filter(
      (node): node is IGroupNode | IGroupList =>
        isGroupControlNode(node) && node.control === "page" && !node.hidden,
    );
    return pages.length > 0 ? pages : undefined;
  }

  @action
  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INode | undefined,
    parentScope: IScope,
    parentToken: string,
    parentResponseItems: QuestionnaireResponseItem[] | undefined,
  ): IPresentableNode {
    const itemType = this.adapter.questionnaireItem.getType(item);

    switch (itemType) {
      case "display": {
        const store = new DisplayStore(
          this,
          item,
          parentStore,
          parentScope.extend(false),
          buildId(parentToken, item.linkId),
        );
        parentScope.registerNode(store);
        return store;
      }
      case "group": {
        if (item.repeats) {
          // todo: handle dynamic repeats changes
          const store = new GroupListStore(
            this,
            item,
            parentStore,
            parentScope.extend(false),
            buildId(parentToken, item.linkId),
            parentResponseItems?.filter(({ linkId }) => linkId === item.linkId),
          );
          parentScope.registerNode(store);
          return store;
        } else {
          const store = new GroupStore(
            this,
            item,
            parentStore,
            parentScope.extend(false),
            buildId(parentToken, item.linkId),
            parentResponseItems?.find(({ linkId }) => linkId === item.linkId),
          );
          parentScope.registerNode(store);
          return store;
        }
      }

      case "string":
      case "boolean":
      case "question":
      case "decimal":
      case "integer":
      case "date":
      case "dateTime":
      case "time":
      case "text":
      case "url":
      case "coding":
      case "attachment":
      case "reference":
      case "quantity": {
        const store = new QuestionStore(
          this,
          item,
          parentStore,
          parentScope.extend(false),
          buildId(parentToken, item.linkId),
          parentResponseItems?.find(({ linkId }) => linkId === item.linkId),
        );
        parentScope.registerNode(store);
        return store;
      }
      default: {
        throw new Error(`Unsupported QuestionnaireItem type: ${itemType}`);
      }
    }
  }

  @computed
  get isSubmitAttempted() {
    return this.submitAttempted;
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    const issues = [
      ...this.renderingIssues,
      ...this.expressionRegistry.registrationIssues,
      ...this.expressionRegistry.slotsIssues,
    ];

    if (
      this.isSubmitAttempted &&
      this.signatureRequired &&
      this.signature == undefined
    ) {
      issues.push(
        makeIssue("required", this.strings.validation.signature.required),
      );
    }

    if (this.isSubmitAttempted) {
      issues.push(...this.expressionRegistry.constraintsIssues);
    }
    return issues.filter((issue) => getIssueMessage(issue) !== undefined);
  }

  @action
  validateAll() {
    this.submitAttempted = true;
    const blockingFormIssues = this.issues.some(
      (issue) => issue.severity === "error" || issue.severity === "fatal",
    );

    const isValid =
      !blockingFormIssues &&
      !this.nodes.some((node) => this.nodeHasErrors(node));

    if (isValid) {
      const hasNonBlockingFormIssues = this.issues.some(
        (issue) =>
          issue.severity === "warning" || issue.severity === "information",
      );
      const hasNonBlockingNodeIssues = this.nodes.some((node) =>
        this.nodeHasNonBlockingIssues(node),
      );

      if (!hasNonBlockingFormIssues && !hasNonBlockingNodeIssues) {
        this.submitAttempted = false;
      }
    }

    return isValid;
  }

  @computed.struct
  get response(): QuestionnaireResponse {
    return this.buildResponseSnapshot("response");
  }

  @computed.struct
  get expressionResponse(): QuestionnaireResponse {
    return this.buildResponseSnapshot("expression");
  }

  @action
  reset() {
    this.submitAttempted = false;
    this.nodes.forEach((node) => this.clearNodeDirty(node));
  }

  @action
  reportRenderingIssue(issue: OperationOutcomeIssue): void {
    this.renderingIssues.push(issue);
  }

  @action
  dispose(): void {
    const nodes = [...this.nodes];
    this.nodes.clear();
    nodes.forEach((node) => node.dispose());
  }

  private nodeHasErrors(node: IPresentableNode): boolean {
    const hasBlockingIssue = node.issues.some(
      (issue) => issue.severity === "error" || issue.severity === "fatal",
    );

    if (hasBlockingIssue) {
      return true;
    }

    if (isQuestionNode(node)) {
      const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
      const hasAnswerIssues = answers.some((answer) =>
        answer.issues.some(
          (issue) => issue.severity === "error" || issue.severity === "fatal",
        ),
      );

      if (hasAnswerIssues) {
        return true;
      }
    }

    return this.getChildNodes(node).some((child) => this.nodeHasErrors(child));
  }

  private nodeHasNonBlockingIssues(node: IPresentableNode): boolean {
    const hasNonBlockingIssue = node.issues.some(
      (issue) =>
        issue.severity === "warning" || issue.severity === "information",
    );

    if (hasNonBlockingIssue) {
      return true;
    }

    if (isQuestionNode(node)) {
      const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
      const hasAnswerIssues = answers.some((answer) =>
        answer.issues.some(
          (issue) =>
            issue.severity === "warning" || issue.severity === "information",
        ),
      );

      if (hasAnswerIssues) {
        return true;
      }
    }

    return this.getChildNodes(node).some((child) =>
      this.nodeHasNonBlockingIssues(child),
    );
  }

  private getChildNodes(node: IPresentableNode): IPresentableNode[] {
    if (isGroupListStore(node)) {
      return node.nodes.flatMap((node) => node.nodes);
    }
    if (isGroupNode(node)) {
      return node.nodes;
    }
    if (isQuestionNode(node)) {
      const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
      return answers.flatMap((answer) => answer.nodes);
    }
    return [];
  }

  private clearNodeDirty(node: IPresentableNode) {
    node.clearDirty();
    this.getChildNodes(node).forEach((child) => this.clearNodeDirty(child));
  }

  private validateTopLevelStructure() {
    const groupNodes = this.nodes.filter((node) => isGroupControlNode(node));
    const headerNodes = groupNodes.filter(
      (node): node is IGroupNode =>
        isGroupNode(node) && node.control === "header",
    );
    if (headerNodes.length > 1) {
      headerNodes
        .slice(1)
        .forEach((node) =>
          this.reportRenderingIssue(
            makeIssue(
              "structure",
              `Only one header group is permitted, but multiple were found (linkId=${node.linkId}).`,
            ),
          ),
        );
    }

    const footerNodes = groupNodes.filter(
      (node): node is IGroupNode =>
        isGroupNode(node) && node.control === "footer",
    );
    if (footerNodes.length > 1) {
      footerNodes
        .slice(1)
        .forEach((node) =>
          this.reportRenderingIssue(
            makeIssue(
              "structure",
              `Only one footer group is permitted, but multiple were found (linkId=${node.linkId}).`,
            ),
          ),
        );
    }

    const nestedPageLinkIds: string[] = [];
    const siblingViolations: Array<{
      parent: string;
      linkIds: string[];
    }> = [];

    const visit = (
      items: QuestionnaireItem[] | undefined,
      depth: number,
      parent: string,
    ) => {
      if (!items || items.length === 0) {
        return;
      }

      const hasPage = items.some((item) => isPageGroupItem(this.adapter, item));
      if (hasPage) {
        const invalidLinkIds: string[] = [];
        items.forEach((item) => {
          if (!isAllowedPageSibling(this.adapter, item)) {
            invalidLinkIds.push(item.linkId);
            this.reportRenderingIssue(
              makeIssue(
                "structure",
                `Items that are siblings of a page group must be groups with item-control 'page', 'header', or 'footer' (parent=${parent}, linkId=${item.linkId}).`,
              ),
            );
          }
        });

        if (invalidLinkIds.length > 0) {
          siblingViolations.push({ parent, linkIds: invalidLinkIds });
        }
      }

      items.forEach((item) => {
        if (depth > 0 && isPageGroupItem(this.adapter, item)) {
          nestedPageLinkIds.push(item.linkId);
          this.reportRenderingIssue(
            makeIssue(
              "structure",
              `Page groups should be top-level items and must not be nested (linkId=${item.linkId}).`,
            ),
          );
        }

        if (item.item && item.item.length > 0) {
          visit(item.item, depth + 1, item.linkId);
        }
      });
    };

    visit(this.questionnaire.item, 0, "Questionnaire");

    if (nestedPageLinkIds.length > 0) {
      console.warn(
        `[Formbox] Page groups should be top-level items and must not be nested. Invalid linkIds: ${nestedPageLinkIds.join(", ")}.`,
      );
    }

    siblingViolations.forEach((violation) => {
      console.warn(
        `[Formbox] Items that are siblings of a page group must be groups with item-control 'page', 'header', or 'footer'. Parent: ${violation.parent}. Invalid linkIds: ${violation.linkIds.join(", ")}.`,
      );
    });
  }

  private registerLaunchContextSlots(): void {
    const extensions = findExtensions(
      this.questionnaire,
      EXT.SDC_LAUNCH_CONTEXT,
    );

    extensions.forEach((extension, index) => {
      const name = extractExtensionValue("Coding", extension, "name");
      const contextName = name?.code?.trim();
      if (!contextName) {
        this.reportRenderingIssue(
          makeIssue(
            "invalid",
            `LaunchContext extension #${index + 1} is missing name.code.`,
          ),
        );
        return;
      }

      const types = extractExtensionsValues("code", extension, "type");
      if (types.length === 0) {
        this.reportRenderingIssue(
          makeIssue(
            "invalid",
            `LaunchContext "${contextName}" is missing at least one type.`,
          ),
        );
        return;
      }

      if (name?.system === SDC_LAUNCH_CONTEXT_CODE_SYSTEM) {
        const allowedTypes = SDC_LAUNCH_CONTEXT_TYPES_BY_CODE[contextName];
        if (allowedTypes) {
          const invalidTypes = types.filter(
            (type) => !allowedTypes.includes(type),
          );
          if (invalidTypes.length > 0) {
            this.reportRenderingIssue(
              makeIssue(
                "invalid",
                `LaunchContext "${contextName}" has invalid type(s): ${invalidTypes.join(", ")}. Allowed type(s): ${allowedTypes.join(", ")}.`,
              ),
            );
            return;
          }
        }
      }

      try {
        const getValue = () => this.launchContextState[contextName];
        this.scope.registerVariable({
          name: contextName,
          get value() {
            return getValue();
          },
        });
      } catch (error) {
        if (
          error instanceof DuplicateVariableNameError ||
          error instanceof ReservedVariableNameError
        ) {
          this.reportRenderingIssue(makeIssue("invalid", error.message));
          return;
        }
        throw error;
      }
    });
  }

  private buildResponseSnapshot(kind: SnapshotKind): QuestionnaireResponse {
    const items =
      kind === "response"
        ? this.nodes.flatMap((node) => node.responseItems)
        : this.nodes.flatMap((node) => node.expressionItems);

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
    };

    this.adapter.questionnaireResponse.setQuestionnaire(
      response,
      this.questionnaire.url || `Questionnaire/${this.questionnaire.id}`,
    );

    if (items.length > 0) {
      response.item = items;
    }

    if (
      kind === "response" &&
      this.signatureRequired &&
      this.signature &&
      items.length > 0
    ) {
      response.extension = [
        {
          url: EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
          valueSignature: this.signature,
        },
      ];
    }

    return response;
  }

  @computed({ keepAlive: true })
  get customExtensions(): Readonly<Record<string, unknown>> {
    return extractCustomExtensions(
      this.questionnaire,
      this.customExtensionDefinitions,
      "questionnaire",
    );
  }
}

function isGroupControlNode(
  node: IPresentableNode,
): node is IGroupNode | IGroupList {
  return isGroupNode(node) || isGroupListStore(node);
}

function isPageGroupItem(adapter: IFhirAdapter, item: QuestionnaireItem) {
  return (
    adapter.questionnaireItem.getType(item) === "group" &&
    getItemControlCode(item) === "page"
  );
}

function isAllowedPageSibling(adapter: IFhirAdapter, item: QuestionnaireItem) {
  if (adapter.questionnaireItem.getType(item) !== "group") {
    return false;
  }

  const control = getItemControlCode(item);
  return control === "page" || control === "header" || control === "footer";
}
