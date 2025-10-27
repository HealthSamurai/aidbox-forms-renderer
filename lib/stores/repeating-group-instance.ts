import { action, computed, makeObservable, observable } from "mobx";
import type {
  INodeStore,
  IRepeatingGroupInstance,
  IRepeatingGroupStore,
} from "./types.ts";
import type { QuestionnaireResponseItem } from "fhir/r5";

export class RepeatingGroupInstance implements IRepeatingGroupInstance {
  readonly path: string;
  private readonly group: IRepeatingGroupStore;

  @observable.shallow
  readonly registry = observable.map<string, INodeStore>({}, { deep: false });

  @observable.shallow
  readonly children = observable.array<INodeStore>([], { deep: false });

  constructor(
    group: IRepeatingGroupStore,
    index: number,
    responseItem?: QuestionnaireResponseItem,
  ) {
    makeObservable(this);

    this.path = `${group.path}/${index}`;
    this.group = group;

    const children =
      group.template.item?.map((item) =>
        group.form.createNodeStore(
          item,
          group,
          this,
          this.path,
          responseItem?.item?.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) ?? [];

    this.children.replace(children);
  }

  @action
  registerStore(node: INodeStore) {
    this.registry.set(node.linkId, node);
  }

  lookupStore(linkId: string) {
    return this.registry.get(linkId) ?? this.group?.lookupStore(linkId);
  }

  @computed
  get responseItem(): QuestionnaireResponseItem | null {
    const childItems = this.children.flatMap((child) => child.responseItems);

    if (childItems.length === 0) {
      return null;
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.group.linkId,
      item: childItems,
      text: this.group.text,
    };

    return item;
  }
}
