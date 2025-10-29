import {
  IFormStore,
  IScope,
  INodeStore,
  INonRepeatingGroupStore,
} from "./types.ts";
import { computed, observable } from "mobx";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";

import { AbstractNodeStore } from "./abstract-node-store.ts";
import { makeIssue } from "../utils.ts";

export class NonRepeatingGroupStore
  extends AbstractNodeStore
  implements INonRepeatingGroupStore
{
  @observable.shallow
  children = observable.array<INodeStore>([], {
    deep: false,
    name: "NonRepeatingGroupStore.children",
  });

  constructor(
    form: IFormStore,
    template: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentKey);

    this.children.replace(
      this.template.item?.map((item) =>
        this.form.createNodeStore(
          item,
          this,
          this.scope,
          this.key,
          responseItems
            ?.at(0)
            ?.item?.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) || [],
    );
  }

  override get type() {
    return super.type as "group";
  }

  override get repeats() {
    return false as const;
  }

  protected override computeIssues(): OperationOutcomeIssue[] {
    if (!this.readOnly && this.minOccurs > 0) {
      const occur = this.children.some(
        (child) => child.responseItems.length > 0,
      );

      if (!occur) {
        return [
          makeIssue(
            "required",
            "At least one answer is required in this group.",
          ),
        ];
      }
    }

    return [];
  }

  @computed
  override get responseItems() {
    if (!this.isEnabled) {
      return [];
    }

    const childItems = this.children.flatMap((child) => child.responseItems);

    if (childItems.length === 0) {
      return [];
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
      item: childItems,
    };

    return [item];
  }

  @computed
  override get expressionItems(): QuestionnaireResponseItem[] {
    const childItems = this.children.flatMap((child) => child.expressionItems);
    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    if (childItems.length > 0) {
      item.item = childItems;
    }

    return [item];
  }
}
