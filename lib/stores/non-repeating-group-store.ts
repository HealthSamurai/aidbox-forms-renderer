import {
  IPresentableNode,
  IForm,
  INode,
  INonRepeatingGroupNode,
  IScope,
  SnapshotKind,
  AnswerType,
} from "./types.ts";
import { action, computed, observable } from "mobx";
import { QuestionnaireItem, QuestionnaireResponseItem } from "fhir/r5";

import { AbstractActualNodeStore } from "./abstract-actual-node-store.ts";
import {
  shouldCreateStore,
  withQuestionnaireResponseItemMeta,
} from "../utils.ts";
import { NonRepeatingGroupValidator } from "./non-repeating-group-validator.ts";
import { NodeExpressionRegistry } from "./node-expression-registry.ts";

export class NonRepeatingGroupStore
  extends AbstractActualNodeStore
  implements INonRepeatingGroupNode
{
  readonly expressionRegistry: NodeExpressionRegistry;

  @observable.shallow
  nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "NonRepeatingGroupStore.children",
  });

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
    responseItem: QuestionnaireResponseItem | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentKey);

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

    this.validator = new NonRepeatingGroupValidator(this);
  }

  @computed.struct
  override get responseItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("response");
  }

  @computed.struct
  override get expressionItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("expression");
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
}

export function isNonRepeatingGroupNode(
  it: IPresentableNode | undefined,
): it is INonRepeatingGroupNode {
  return it instanceof NonRepeatingGroupStore;
}
