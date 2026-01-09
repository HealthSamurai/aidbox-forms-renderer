import {
  ExpressionEnvironment,
  GroupControlDefinition,
  IExpressionEnvironmentProvider,
  IExpressionRegistry,
  IForm,
  IGroupNode,
  IGroupWrapper,
  INode,
  IPresentableNode,
  IScope,
  IValueSetExpander,
  QuestionControlDefinition,
  SnapshotKind,
} from "../../types.ts";
import {
  defaultQuestionControlDefinitions,
  QuestionControlRegistry,
} from "../registries/question-control-registry.ts";
import {
  defaultGroupControlDefinitions,
  GroupControlRegistry,
} from "../registries/group-control-registry.ts";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import {
  OperationOutcomeIssue,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r5";
import {
  isQuestionNode,
  QuestionStore,
} from "../nodes/questions/question-store.ts";
import { GroupStore, isGroupNode } from "../nodes/groups/group-store.ts";
import { DisplayStore } from "../nodes/display/display-store.ts";
import { GroupWrapper, isGroupWrapper } from "../nodes/groups/group-wrapper.ts";
import { EvaluationCoordinator } from "../expressions/evaluation-coordinator.ts";
import { Scope } from "../expressions/scope.ts";
import { BaseExpressionRegistry } from "../expressions/base-expression-registry.ts";
import {
  clamp,
  EXT,
  extractExtensionsValues,
  getItemControlCode,
  buildId,
  makeIssue,
  shouldCreateStore,
} from "../../utils.ts";
import { ValueSetExpander } from "../services/valueset-expander.ts";
import type { FormPagination } from "@aidbox-forms/theme";

export class FormStore implements IForm, IExpressionEnvironmentProvider {
  private readonly initialResponse: QuestionnaireResponse | undefined;

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
  readonly questionControlRegistry: QuestionControlRegistry;
  readonly groupControlRegistry: GroupControlRegistry;
  readonly expressionRegistry: IExpressionRegistry;
  readonly valueSetExpander: IValueSetExpander;

  constructor(
    readonly questionnaire: Questionnaire,
    response?: QuestionnaireResponse,
    terminologyServerUrl?: string,
    questionControls?: QuestionControlDefinition[],
    groupControls?: GroupControlDefinition[],
  ) {
    this.questionControlRegistry = new QuestionControlRegistry(
      questionControls ?? defaultQuestionControlDefinitions,
    );

    this.groupControlRegistry = new GroupControlRegistry(
      groupControls ?? defaultGroupControlDefinitions,
    );

    makeObservable(this);

    this.questionnaire = questionnaire;
    this.initialResponse = response;
    this.valueSetExpander = new ValueSetExpander(terminologyServerUrl);

    this.expressionRegistry = new BaseExpressionRegistry(
      this.coordinator,
      this.scope,
      this,
      questionnaire,
    );

    runInAction(() => {
      this.nodes.replace(
        (questionnaire.item ?? [])
          .filter(shouldCreateStore)
          .map((item) =>
            this.createNodeStore(
              item,
              null,
              this.scope,
              "",
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
  get preferredTerminologyServers(): readonly string[] {
    return extractExtensionsValues(
      this.questionnaire,
      EXT.PREFERRED_TERMINOLOGY_SERVER,
      "url",
    );
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
      (node): node is IGroupNode | IGroupWrapper =>
        isGroupControlNode(node) && node.control === "page" && !node.hidden,
    );
    return pages.length > 0 ? pages : undefined;
  }

  @action
  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentToken: string,
    parentResponseItems: QuestionnaireResponseItem[] | undefined,
  ): IPresentableNode {
    switch (item.type) {
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
      case "group":
        if (item.repeats) {
          // todo: handle dynamic repeats changes
          const store = new GroupWrapper(
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
    if (this.isSubmitAttempted) {
      issues.push(...this.expressionRegistry.constraintsIssues);
    }
    return issues;
  }

  @action
  validateAll() {
    this.submitAttempted = true;
    // TODO: surface a form-level summary when validation fails.
    const blockingFormIssues = this.expressionRegistry.constraintsIssues.some(
      (issue) => issue.severity === "error",
    );

    const isValid =
      !blockingFormIssues &&
      !this.nodes.some((node) => this.nodeHasErrors(node));

    if (isValid) {
      this.submitAttempted = false;
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
    const nodes = this.nodes.slice();
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

    return this.getChildNodes(node).some((child) => this.nodeHasErrors(child));
  }

  private getChildNodes(node: IPresentableNode): IPresentableNode[] {
    if (isGroupWrapper(node)) {
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
    const groupNodes = this.nodes.filter(isGroupControlNode);
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

    const isPageGroupItem = (item: QuestionnaireItem) =>
      item.type === "group" && getItemControlCode(item) === "page";

    const isAllowedPageSibling = (item: QuestionnaireItem) => {
      if (item.type !== "group") {
        return false;
      }

      const control = getItemControlCode(item);
      return control === "page" || control === "header" || control === "footer";
    };

    const visit = (
      items: QuestionnaireItem[] | undefined,
      depth: number,
      parent: string,
    ) => {
      if (!items || items.length === 0) {
        return;
      }

      const hasPage = items.some(isPageGroupItem);
      if (hasPage) {
        const invalidLinkIds: string[] = [];
        items.forEach((item) => {
          if (!isAllowedPageSibling(item)) {
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
        if (depth > 0 && isPageGroupItem(item)) {
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
        `[Aidbox Forms] Page groups should be top-level items and must not be nested. Invalid linkIds: ${nestedPageLinkIds.join(", ")}.`,
      );
    }

    siblingViolations.forEach((violation) => {
      console.warn(
        `[Aidbox Forms] Items that are siblings of a page group must be groups with item-control 'page', 'header', or 'footer'. Parent: ${violation.parent}. Invalid linkIds: ${violation.linkIds.join(", ")}.`,
      );
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
      questionnaire:
        this.questionnaire.url || `Questionnaire/${this.questionnaire.id}`,
    };

    if (items.length > 0) {
      response.item = items;
    }

    return response;
  }
}

function isGroupControlNode(
  node: IPresentableNode,
): node is IGroupNode | IGroupWrapper {
  return isGroupNode(node) || isGroupWrapper(node);
}
