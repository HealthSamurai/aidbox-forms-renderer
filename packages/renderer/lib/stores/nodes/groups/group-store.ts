import { action, computed, observable } from "mobx";
import {
  AnswerType,
  IPresentableNode,
  IForm,
  INode,
  IGroupNode,
  IScope,
  SnapshotKind,
  GROUP_ITEM_CONTROLS,
  type GroupItemControl,
  type GroupControlDefinition,
} from "../../../types.ts";
import { QuestionnaireItem, QuestionnaireResponseItem } from "fhir/r5";

import { AbstractActualNodeStore } from "../base/abstract-actual-node-store.ts";
import {
  getItemControlCode,
  makeIssue,
  shouldCreateStore,
  withQuestionnaireResponseItemMeta,
} from "../../../utils.ts";
import { GroupValidator } from "../../validation/group-validator.ts";
import { NodeExpressionRegistry } from "../../expressions/node-expression-registry.ts";
import { isQuestionNode } from "../questions/question-store.ts";
import { isGroupWrapper } from "./group-wrapper.ts";
import { GridStore } from "./grid-store.ts";
import { TableStore } from "./table-store.ts";

export class GroupStore extends AbstractActualNodeStore implements IGroupNode {
  readonly expressionRegistry: NodeExpressionRegistry;

  @observable.shallow
  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "GroupStore.children",
  });

  @computed
  get visibleNodes(): IPresentableNode[] {
    return this.nodes.filter((child) => !child.hidden);
  }

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    scope: IScope,
    key: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, scope, key);

    this.expressionRegistry = new NodeExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      template,
      this.template.type as AnswerType,
    );

    this.nodes.replace(
      (this.template.item ?? [])
        .filter(shouldCreateStore)
        .map((item) =>
          this.form.createNodeStore(
            item,
            this,
            this.scope,
            this.key,
            responseItem?.item,
          ),
        ),
    );

    this.validator = new GroupValidator(this);
    this.enforceControlRules();
  }

  @computed
  get component(): GroupControlDefinition["groupComponent"] | undefined {
    return this.form.groupControlRegistry.resolveGroup(this)?.groupComponent;
  }

  @computed({ keepAlive: true })
  get gridStore(): GridStore {
    return new GridStore(this);
  }

  @computed({ keepAlive: true })
  get tableStore(): TableStore {
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

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    const childItems = this.collectChildItems(kind);

    if (kind === "response") {
      if (!this.isEnabled || childItems.length === 0) {
        return [];
      }
    }

    const item = withQuestionnaireResponseItemMeta({
      linkId: this.linkId,
      text: kind === "expression" ? this.template.text : this.text,
    });

    if (childItems.length > 0) {
      item.item = childItems;
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
    const children = this.nodes.slice();
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
      this.form.reportRenderingIssue(
        makeIssue(
          "structure",
          `Group "${this.linkId}" uses 'gtable' but is not marked as repeating.`,
        ),
      );
      return;
    }

    if (control === "tab-container") {
      this.nodes.forEach((child) => {
        if (!isGroupNode(child) && !isGroupWrapper(child)) {
          this.form.reportRenderingIssue(
            makeIssue(
              "structure",
              `Tab container "${this.linkId}" can only contain group items, but child "${child.linkId}" is type '${child.template.type}'.`,
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
        if (!isGroupNode(child) && !isGroupWrapper(child)) {
          this.form.reportRenderingIssue(
            makeIssue(
              "structure",
              `Grid group "${this.linkId}" expects child rows to be groups, but "${child.linkId}" is type '${child.template.type}'.`,
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
  it: IPresentableNode | undefined | null,
): it is IGroupNode {
  return it instanceof GroupStore;
}

export function assertGroupNode(
  it: IPresentableNode | undefined | null,
  message?: string,
): asserts it is IGroupNode {
  if (!isGroupNode(it)) {
    throw new TypeError(message ?? "Expected GroupNode instance");
  }
}
