import { action, computed, makeObservable, observable } from "mobx";
import type {
  IScope,
  INodeStore,
  IRepeatingGroupInstance,
  IRepeatingGroupStore,
} from "./types.ts";
import type { QuestionnaireResponseItem } from "fhir/r5";

export class RepeatingGroupInstance implements IRepeatingGroupInstance {
  readonly key: string;
  readonly scope: IScope;

  private readonly group: IRepeatingGroupStore;
  private readonly index: number;

  @observable.shallow
  readonly children = observable.array<INodeStore>([], {
    deep: false,
    name: "RepeatingGroupInstance.children",
  });

  constructor(
    group: IRepeatingGroupStore,
    scope: IScope,
    index: number,
    responseItem?: QuestionnaireResponseItem,
  ) {
    makeObservable(this);

    this.key = `${group.key}_/_${index}`;
    this.group = group;

    this.index = index;
    this.scope = scope.extend(true);

    const children =
      group.template.item?.map((item) =>
        group.form.createNodeStore(
          item,
          group,
          this.scope,
          this.key,
          responseItem?.item?.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) ?? [];

    this.children.replace(children);
  }

  @computed
  get responseItem(): QuestionnaireResponseItem | null {
    const childItems = this.children.flatMap((child) => child.responseItems);

    if (childItems.length === 0) {
      return null;
    }

    return {
      linkId: this.group.linkId,
      item: childItems,
      text: this.group.text,
    };
  }

  @computed
  get expressionItem(): QuestionnaireResponseItem {
    const childItems = this.children.flatMap((child) => child.expressionItems);

    const item: QuestionnaireResponseItem = {
      linkId: this.group.linkId,
      text: this.group.text,
    };

    if (childItems.length > 0) {
      item.item = childItems;
    }

    return item;
  }

  @action.bound
  remove(): void {
    if (this.group.canRemove) {
      this.group.removeInstance(this.index);
    }
  }
}
