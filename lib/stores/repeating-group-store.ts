import { action, computed, makeObservable, observable } from "mobx";
import {
  ICoreNode,
  IRepeatingGroupNode,
  IRepeatingGroupWrapper,
  SnapshotKind,
} from "./types.ts";
import type { QuestionnaireResponseItem } from "fhir/r5";
import { AbstractNodeStore } from "./abstract-node-store.ts";
import { shouldCreateStore } from "../utils.ts";

export class RepeatingGroupStore
  extends AbstractNodeStore
  implements IRepeatingGroupNode
{
  readonly index: number;

  private readonly group: IRepeatingGroupWrapper;

  @observable.shallow
  readonly nodes = observable.array<ICoreNode>([], {
    deep: false,
    name: "RepeatingGroupStore.nodes",
  });

  constructor(
    group: IRepeatingGroupWrapper,
    index: number,
    responseItem?: QuestionnaireResponseItem,
  ) {
    super(group.form, group.template, group, group.scope, group.key);
    makeObservable(this);

    this.group = group;
    this.index = index;

    this._scope = group.scope.extend(true);
    this._key = `${group.key}_/_${index}`;

    this.initializeExpressionRegistry(this, group.template.extension);

    this.nodes.replace(
      (this.template.item ?? []).filter(shouldCreateStore).map((item) =>
        this.form.createNodeStore(
          item,
          this,
          this.scope,
          this.key,
          responseItem?.item?.filter(({ linkId }) => linkId === item.linkId),
        ),
      ),
    );
  }

  @computed.struct
  override get responseItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("response");
  }

  @computed.struct
  override get expressionItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("expression");
  }

  private buildItemSnapshot(mode: SnapshotKind): QuestionnaireResponseItem[] {
    const childItems = this.collectChildItems(mode);

    if (mode === "response") {
      if (!this.isEnabled || childItems.length === 0) {
        return [];
      }
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.group.linkId,
      text: this.group.text,
    };

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

  @computed
  get expressionIssues() {
    return this.expressionRegistry?.issues ?? [];
  }

  @action.bound
  remove(): void {
    if (this.group.canRemove) {
      this.group.removeInstance(this.index);
    }
  }

  dispose(): void {
    const children = this.nodes.slice();
    this.nodes.clear();
    children.forEach((child) => child.dispose());
  }
}

export function isRepeatingGroupNode(
  it: ICoreNode | undefined,
): it is IRepeatingGroupNode {
  return it instanceof RepeatingGroupStore;
}
