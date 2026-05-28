import {
  action,
  comparer,
  computed,
  observable,
  override,
  reaction,
  type IReactionDisposer,
} from "mobx";
import {
  ExpressionEnvironment,
  GROUP_ITEM_CONTROLS,
  GroupListRendererProperties,
  type GroupItemControl,
  HasNodePath,
  IExpressionEnvironmentProvider,
  IExpressionSlot,
  IForm,
  IGroupNode,
  IGroupList,
  INode,
  IPresentableNode,
  IScope,
  SnapshotKind,
  IGrid,
} from "../../types.ts";
import type {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "@formbox/fhir";
import { AbstractPresentableNode } from "../base/abstract-presentable-node.ts";
import { GroupListValidator } from "./group-list-validator.ts";
import {
  buildId,
  EXT,
  extractExtensionValue,
  extractExtensionValueElement,
  findExtension,
  getIssueMessage,
  getItemControlCode,
  makeIssue,
  normalizeExpressionValues,
} from "../../utilities.ts";
import { isQuestionNode } from "../question/question-store.ts";
import { GroupStore } from "./group-store.ts";
import { GridStore } from "./view-model/grid-store.ts";
import { BaseExpressionRegistry } from "../expression/registry/base-expression-registry.ts";
import { ExpressionSlot } from "../expression/slot/expression-slot.ts";
import type { ComponentType } from "react";

export class GroupListStore
  extends AbstractPresentableNode
  implements IGroupList, IExpressionEnvironmentProvider
{
  readonly scope: IScope;
  readonly token: string;

  readonly nodes = observable.array<IGroupNode>([], {
    deep: false,
    name: "GroupListStore.nodes",
  });

  @computed
  get visibleNodes(): IGroupNode[] {
    return this.nodes.filter((node) => !node.hidden);
  }

  @override
  override get hasResponseContent(): boolean {
    return this.nodes.some((node) => node.hasResponseContent);
  }

  private readonly validator: GroupListValidator;

  private readonly expressionRegistry: BaseExpressionRegistry;
  private readonly minOccursSlot: IExpressionSlot | undefined;
  private readonly maxOccursSlot: IExpressionSlot | undefined;
  private readonly disposers: IReactionDisposer[] = [];

  private lastIndex = 0;

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | undefined,
    pathParent: HasNodePath | undefined,
    scope: IScope,
    token: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore, pathParent);

    this.scope = scope;
    this.token = token;

    this.validator = new GroupListValidator(this);
    this.expressionRegistry = new BaseExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      this.template,
    );
    this.minOccursSlot = this.createOccurrenceSlot(
      EXT.MIN_OCCURS,
      "min-occurs",
    );
    this.maxOccursSlot = this.createOccurrenceSlot(
      EXT.MAX_OCCURS,
      "max-occurs",
    );

    responseItems?.forEach((responseItem) => this.pushNode(responseItem));
    this.setupOccurrenceReaction();
    this.enforceControlRules();
  }

  @computed
  get expressionEnvironment(): ExpressionEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.form.questionnaire,
      resource: this.form.expressionResponse,
      qitem: this.template,
      context: this.expressionItems.at(0),
    });
  }

  @computed
  get renderer(): ComponentType<GroupListRendererProperties> | undefined {
    return this.form.groupListRendererRegistry.resolve(this)?.renderer;
  }

  @computed({ keepAlive: true })
  get grid(): IGrid {
    return new GridStore(() => this.visibleNodes);
  }

  @computed
  get minOccurs() {
    const expressionValue = this.getOccurrenceSlotValue(this.minOccursSlot);
    if (expressionValue !== undefined) {
      return expressionValue;
    }

    return (
      findExtension(this.template, EXT.MIN_OCCURS)?.valueInteger ??
      (this.template.required ? 1 : 0)
    );
  }

  @computed
  get maxOccurs() {
    const expressionValue = this.getOccurrenceSlotValue(this.maxOccursSlot);
    if (expressionValue !== undefined) {
      return expressionValue;
    }

    return (
      findExtension(this.template, EXT.MAX_OCCURS)?.valueInteger ??
      Number.POSITIVE_INFINITY
    );
  }

  @computed
  get control(): GroupItemControl | undefined {
    const control = getItemControlCode(this.template);
    return control && GROUP_ITEM_CONTROLS.includes(control as GroupItemControl)
      ? (control as GroupItemControl)
      : undefined;
  }

  @computed
  get canAdd() {
    return !this.readOnly && this.nodes.length < this.maxOccurs;
  }

  @computed
  get canRemove() {
    return !this.readOnly && this.nodes.length > this.minOccurs;
  }

  @override
  override get hidden() {
    return super.hidden
      ? true
      : this.nodes.some((node) => !node.hidden)
        ? false
        : !this.canAdd;
  }

  @computed
  protected get _isEnabled() {
    return true;
  }

  @computed
  protected get _readOnly(): boolean {
    return !!this.template.readOnly;
  }

  @action
  addNode() {
    if (this.canAdd) {
      this.pushNode();
    }
  }

  @action
  removeNode(node: IGroupNode) {
    if (this.canRemove) {
      const index = this.nodes.indexOf(node);
      if (index !== -1) {
        const [removed] = this.nodes.splice(index, 1);
        removed?.dispose();
        this.reindexNodePaths();
      }
    }
  }

  @action
  private pushNode(responseItem?: QuestionnaireResponseItem) {
    const node = new GroupStore(
      this.form,
      this.template,
      this,
      this,
      this.nodes.length,
      this.scope.extend(true),
      buildId(this.token, this.lastIndex++),
      responseItem,
    );
    this.nodes.push(node);
  }

  @action
  private ensureMinOccurs() {
    const target = Math.min(this.minOccurs, this.maxOccurs);
    while (this.nodes.length < target && this.canAdd) {
      this.pushNode();
    }
  }

  private setupOccurrenceReaction() {
    this.disposers.push(
      reaction(
        () => [this.canAdd, this.minOccurs, this.maxOccurs, this.nodes.length],
        () => this.ensureMinOccurs(),
        {
          name: `${this.token}:ensure-group-list-min-occurs`,
          equals: comparer.structural,
          fireImmediately: true,
        },
      ),
    );
  }

  private createOccurrenceSlot(
    extensionUrl: string,
    kind: "min-occurs" | "max-occurs",
  ): IExpressionSlot | undefined {
    const expression = extractExtensionValue(
      "Expression",
      extractExtensionValueElement("integer", this.template, extensionUrl),
      EXT.CQF_EXPRESSION,
    );

    return expression
      ? new ExpressionSlot(this.form.coordinator, this, kind, expression)
      : undefined;
  }

  private getOccurrenceSlotValue(
    slot: IExpressionSlot | undefined,
  ): number | undefined {
    if (!slot) {
      return undefined;
    }

    const values = normalizeExpressionValues("integer", slot.value);
    const candidate = values[0];
    if (
      candidate != undefined &&
      Number.isFinite(candidate) &&
      candidate >= 0
    ) {
      return Math.floor(candidate);
    }

    return undefined;
  }

  private reindexNodePaths(): void {
    this.nodes.forEach((node, index) => {
      (node as GroupStore).setPathIndex(index);
    });
  }

  private enforceControlRules() {
    const control = this.control;
    if (!control) {
      return;
    }

    if (
      (control === "header" || control === "footer" || control === "page") &&
      this.parentStore
    ) {
      this.form.reportRenderingIssue(
        makeIssue(
          "structure",
          `Repeating group "${this.linkId}" with control '${control}' must be a top-level item.`,
        ),
      );
    }

    if (control === "header" || control === "footer") {
      this.form.reportRenderingIssue(
        makeIssue(
          "structure",
          `Repeating group "${this.linkId}" cannot use control '${control}' because these sections cannot repeat.`,
        ),
      );
    }

    if (control === "gtable") {
      this.nodes.forEach((node) => {
        node.nodes.forEach((childNode) => {
          if (!isQuestionNode(childNode)) {
            this.form.reportRenderingIssue(
              makeIssue(
                "structure",
                `Group table "${this.linkId}" expects only question items, but child "${childNode.linkId}" is type '${this.adapter.questionnaireItem.getType(childNode.template)}'.`,
              ),
            );
            return;
          }

          if (childNode.repeats) {
            this.form.reportRenderingIssue(
              makeIssue(
                "structure",
                `Question "${childNode.linkId}" inside group table group "${this.linkId}" must not allow multiple answers.`,
              ),
            );
          }
        });
      });
    }
  }

  @computed.struct
  get responseItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("response");
  }

  @computed.struct
  get expressionItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("expression");
  }

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    if (kind === "response") {
      return this.nodes.flatMap((node) => node.responseItems);
    }

    if (this.nodes.length === 0) {
      return [
        this.adapter.withQuestionnaireResponseItemMeta({
          linkId: this.linkId,
          text: kind === "expression" ? this.template.text : this.text,
        }),
      ];
    }

    return this.nodes
      .map((node) => node.expressionItems.at(0))
      .filter((item): item is QuestionnaireResponseItem => item !== undefined);
  }

  override markDirty(): void {
    this.parentStore?.markDirty?.();
  }

  override get hasErrors(): boolean {
    return this.issues.length > 0 || this.nodes.some((node) => node.hasErrors);
  }

  get issues(): OperationOutcomeIssue[] {
    const issues: Array<OperationOutcomeIssue | undefined> = [
      ...this.expressionRegistry.registrationIssues,
      ...this.expressionRegistry.slotsIssues,
      this.minOccursSlot?.error,
      this.maxOccursSlot?.error,
    ];

    if (this.form.isSubmitAttempted) {
      issues.push(...this.validator.issues);
    }

    return issues
      .filter((issue): issue is OperationOutcomeIssue => issue !== undefined)
      .filter((issue) => getIssueMessage(issue) !== undefined);
  }

  override clearDirty(): void {}

  @action
  dispose(): void {
    const disposers = this.disposers.splice(0);
    disposers.forEach((dispose) => dispose());

    const nodes = [...this.nodes];
    this.nodes.clear();
    nodes.forEach((node) => node.dispose());
  }
}

export function isGroupListStore(
  it: IPresentableNode | undefined,
): it is IGroupList {
  return it instanceof GroupListStore;
}

export function assertGroupListStore(
  it: IPresentableNode | undefined,
  message?: string,
): asserts it is IGroupList {
  if (!isGroupListStore(it)) {
    throw new Error(message ?? "Expected GroupListStore instance");
  }
}
