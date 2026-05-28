import { action, computed, makeObservable, observable, override } from "mobx";
import {
  AnswerType,
  HasNodePath,
  IPresentableNode,
  IForm,
  INode,
  IGroupNode,
  IScope,
  SnapshotKind,
  GROUP_ITEM_CONTROLS,
  type GroupItemControl,
  GroupRendererProperties,
  IGrid,
  ITable,
} from "../../types.ts";
import type {
  QuestionnaireItem,
  QuestionnaireResponseItem,
  Signature,
} from "@formbox/fhir";
import type { NodePath } from "@formbox/theme";

import { AbstractActualNodeStore } from "../base/abstract-actual-node-store.ts";
import {
  EXT,
  extractExtensionsValues,
  findExtension,
  getItemControlCode,
  makeIssue,
  shouldCreateStore,
  withLastPathIndex,
} from "../../utilities.ts";
import { GroupValidator } from "./group-validator.ts";
import { NodeExpressionRegistry } from "../expression/registry/node-expression-registry.ts";
import { isQuestionNode } from "../question/question-store.ts";
import { isGroupListStore } from "./group-list-store.ts";
import { GridStore } from "./view-model/grid-store.ts";
import { TableStore } from "./view-model/table-store.ts";
import type { ComponentType } from "react";

export class GroupStore extends AbstractActualNodeStore implements IGroupNode {
  readonly expressionRegistry: NodeExpressionRegistry;

  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "GroupStore.children",
  });

  @observable.ref
  private signatureState: Signature | undefined;

  @observable
  private pathIndex = 0;

  @computed
  get visibleNodes(): IPresentableNode[] {
    return this.nodes.filter((child) => !child.hidden);
  }

  @override
  override get hasResponseContent(): boolean {
    return this.nodes.some((child) => child.hasResponseContent);
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
      findExtension(this.template, EXT.SIGNATURE_REQUIRED) != undefined &&
      this.isEnabled &&
      this.nodes.some((child) => child.responseItems.length > 0)
    );
  }

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | undefined,
    pathParent: HasNodePath | undefined,
    pathIndex: number,
    scope: IScope,
    token: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, pathParent, scope, token);
    this.pathIndex = pathIndex;
    this.signatureState = responseItem
      ? extractExtensionsValues(
          "Signature",
          responseItem,
          EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
        )[0]
      : undefined;
    makeObservable(this);

    this.expressionRegistry = new NodeExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      template,
      this.adapter.questionnaireItem.getType(template) as AnswerType,
    );

    this.nodes.replace(
      (this.template.item ?? [])
        .filter((item) => shouldCreateStore(item, this.adapter))
        .map((item) =>
          this.form.createNodeStore(
            item,
            this,
            this,
            this.scope,
            responseItem?.item,
          ),
        ),
    );

    this.validator = new GroupValidator(this);
    this.enforceControlRules();
  }

  @override
  override get path(): NodePath {
    return isGroupListStore(this.parentStore)
      ? withLastPathIndex(this.parentStore.path, this.pathIndex)
      : super.path;
  }

  @action
  setPathIndex(index: number): void {
    this.pathIndex = index;
  }

  @computed
  get renderer(): ComponentType<GroupRendererProperties> | undefined {
    return this.form.groupRendererRegistry.resolve(this)?.renderer;
  }

  @computed({ keepAlive: true })
  get grid(): IGrid {
    return new GridStore(() =>
      this.nodes
        .filter((node) => isGroupNode(node))
        .filter((group) => !group.hidden),
    );
  }

  @computed({ keepAlive: true })
  get table(): ITable {
    return new TableStore(this);
  }

  @computed.struct
  override get responseItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("response");
  }

  @computed.struct
  override get expressionItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("expression");
  }

  @computed
  get control(): GroupItemControl | undefined {
    const control = getItemControlCode(this.template);
    return control && GROUP_ITEM_CONTROLS.includes(control as GroupItemControl)
      ? (control as GroupItemControl)
      : undefined;
  }

  @override
  override get isHeaderless(): boolean {
    return super.isHeaderless || isGroupListStore(this.parentStore);
  }

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    const childItems = this.collectChildItems(kind);

    if (kind === "response" && (!this.isEnabled || childItems.length === 0)) {
      return [];
    }

    const item = this.adapter.withQuestionnaireResponseItemMeta({
      linkId: this.linkId,
      text: kind === "expression" ? this.template.text : this.text,
    });

    if (childItems.length > 0) {
      item.item = childItems;
    }

    if (
      kind === "response" &&
      this.signatureRequired &&
      this.signature != undefined &&
      childItems.length > 0
    ) {
      item.extension = [
        {
          url: EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
          valueSignature: this.signature,
        },
      ];
    }

    return [item];
  }

  private collectChildItems(kind: SnapshotKind): QuestionnaireResponseItem[] {
    return this.nodes.flatMap((child) =>
      kind === "response" ? child.responseItems : child.expressionItems,
    );
  }

  @action
  dispose(): void {
    const children = [...this.nodes];
    this.nodes.clear();
    children.forEach((child) => child.dispose());
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
          `Group "${this.linkId}" with control '${control}' must be a top-level item.`,
        ),
      );
    }

    if (control === "gtable") {
      if (!isGroupListStore(this.parentStore)) {
        this.form.reportRenderingIssue(
          makeIssue(
            "structure",
            `Group "${this.linkId}" uses 'gtable' but is not marked as repeating.`,
          ),
        );
      }
      return;
    }

    if (control === "tab-container") {
      this.nodes.forEach((child) => {
        if (!isGroupNode(child) && !isGroupListStore(child)) {
          this.form.reportRenderingIssue(
            makeIssue(
              "structure",
              `Tab container "${this.linkId}" can only contain group items, but child "${child.linkId}" is type '${this.adapter.questionnaireItem.getType(child.template)}'.`,
            ),
          );
          return;
        }

        if (child.control) {
          this.form.reportRenderingIssue(
            makeIssue(
              "structure",
              `Group "${child.linkId}" inside tab container "${this.linkId}" must not declare its own item control.`,
            ),
          );
        }
      });
    }

    if (control === "grid") {
      this.nodes.forEach((child) => {
        if (!isGroupNode(child) && !isGroupListStore(child)) {
          this.form.reportRenderingIssue(
            makeIssue(
              "structure",
              `Grid group "${this.linkId}" expects child rows to be groups, but "${child.linkId}" is type '${this.adapter.questionnaireItem.getType(child.template)}'.`,
            ),
          );
        }
      });
    }

    if (control === "table" || control === "htable") {
      const questionNodes = this.nodes.filter((child) => isQuestionNode(child));

      if (questionNodes.length === 0) {
        this.form.reportRenderingIssue(
          makeIssue(
            "structure",
            `Group "${this.linkId}" uses '${control}' but has no question items to render.`,
          ),
        );
      }
    }
  }
}

export function isGroupNode(
  it: IPresentableNode | undefined,
): it is IGroupNode {
  return it instanceof GroupStore;
}

export function assertGroupNode(
  it: IPresentableNode | undefined,
  message?: string,
): asserts it is IGroupNode {
  if (!isGroupNode(it)) {
    throw new TypeError(message ?? "Expected GroupNode instance");
  }
}
