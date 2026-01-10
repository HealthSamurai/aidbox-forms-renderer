import { action, computed, observable, override } from "mobx";
import {
  GROUP_ITEM_CONTROLS,
  GroupRendererProperties,
  type GroupItemControl,
  IForm,
  IGroupNode,
  IGroupList,
  INode,
  IPresentableNode,
  IScope,
  SnapshotKind,
} from "../../../types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { AbstractPresentableNode } from "../base/abstract-presentable-node.ts";
import { GroupListValidator } from "../../validation/group-list-validator.ts";
import {
  buildId,
  EXT,
  findExtension,
  getItemControlCode,
  makeIssue,
  withQuestionnaireResponseItemMeta,
} from "../../../utilities.ts";
import { isQuestionNode } from "../questions/question-store.ts";
import { GroupStore } from "./group-store.ts";
import { GridTableStore } from "./grid-table-store.ts";
import type { ComponentType } from "react";

export class GroupListStore
  extends AbstractPresentableNode
  implements IGroupList
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

  private readonly validator: GroupListValidator;

  private lastIndex = 0;

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | undefined,
    scope: IScope,
    token: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore);

    this.scope = scope;
    this.token = token;

    this.validator = new GroupListValidator(this);

    responseItems?.forEach((responseItem) => this.pushNode(responseItem));
    this.ensureMinOccurs();
    this.enforceControlRules();
  }

  @computed
  get renderer(): ComponentType<GroupRendererProperties> | undefined {
    return this.form.groupRendererRegistry.resolve(this)?.renderer;
  }

  @computed({ keepAlive: true })
  get gridTableStore(): GridTableStore {
    return new GridTableStore(this);
  }

  @computed
  get minOccurs() {
    return (
      findExtension(this.template, EXT.MIN_OCCURS)?.valueInteger ??
      (this.template.required ? 1 : 0)
    );
  }

  @computed
  get maxOccurs() {
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
      }
    }
  }

  @action
  private pushNode(responseItem?: QuestionnaireResponseItem) {
    const node = new GroupStore(
      this.form,
      this.template,
      this,
      this.scope.extend(true),
      buildId(this.token, this.lastIndex++),
      responseItem,
    );
    this.nodes.push(node);
  }

  @action
  private ensureMinOccurs() {
    while (this.nodes.length < this.minOccurs && this.canAdd) {
      this.pushNode();
    }
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
                `Group table "${this.linkId}" expects only question items, but child "${childNode.linkId}" is type '${childNode.template.type}'.`,
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
        withQuestionnaireResponseItemMeta({
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
    return this.nodes.some((node) => node.hasErrors);
  }

  get issues(): OperationOutcomeIssue[] {
    return this.validator.issues;
  }

  override clearDirty(): void {}

  @action
  dispose(): void {
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
