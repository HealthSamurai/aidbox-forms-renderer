import { action, computed, makeObservable, observable } from "mobx";
import {
  ICoreNode,
  IRepeatingGroupNode,
  IRepeatingGroupWrapper,
} from "./types.ts";
import type { QuestionnaireResponseItem } from "fhir/r5";
import { AbstractNodeStore } from "./abstract-node-store.ts";

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

    const extensions = [
      ...(group.template.extension ?? []),
      ...(group.template.modifierExtension ?? []),
    ];
    this.initializeExpressionRegistry(this, extensions);

    const children =
      this.template.item?.map((item) =>
        this.form.createNodeStore(
          item,
          this,
          this.scope,
          this.key,
          responseItem?.item?.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) ?? [];

    this.nodes.replace(children);
  }

  @computed
  override get responseItems(): QuestionnaireResponseItem[] {
    if (!this.isEnabled) {
      return [];
    }

    const childItems = this.nodes.flatMap((child) => child.responseItems);
    if (childItems.length === 0) {
      return [];
    }

    return [
      {
        linkId: this.group.linkId,
        item: childItems,
        text: this.group.text,
      },
    ];
  }

  @computed
  override get expressionItems(): QuestionnaireResponseItem[] {
    const childItems = this.nodes.flatMap((child) => child.expressionItems);

    const item: QuestionnaireResponseItem = {
      linkId: this.group.linkId,
      text: this.group.text,
    };

    if (childItems.length > 0) {
      item.item = childItems;
    }

    return [item];
  }

  @computed
  get responseItem(): QuestionnaireResponseItem | null {
    return this.responseItems.at(0) ?? null;
  }

  @computed
  get expressionItem(): QuestionnaireResponseItem {
    return (
      this.expressionItems.at(0) ?? {
        linkId: this.group.linkId,
        text: this.group.text,
      }
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
}

export function isRepeatingGroupNode(
  it: ICoreNode | undefined,
): it is IRepeatingGroupNode {
  return it instanceof RepeatingGroupStore;
}
