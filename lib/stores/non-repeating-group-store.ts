import {
  ICoreNode,
  IForm,
  INode,
  INonRepeatingGroupNode,
  IScope,
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
  implements INonRepeatingGroupNode
{
  @observable.shallow
  nodes = observable.array<ICoreNode>([], {
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

    this.nodes.replace(
      this.template.item?.map((item) =>
        this.form.createNodeStore(
          item,
          this,
          this.scope,
          this.key,
          responseItem?.item,
        ),
      ) || [],
    );
  }

  protected override computeIssues(): OperationOutcomeIssue[] {
    if (!this.readOnly && this.minOccurs > 0) {
      const occur = this.nodes.some((child) => child.responseItems.length > 0);

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
  override get responseItems(): QuestionnaireResponseItem[] {
    if (!this.isEnabled) {
      return [];
    }

    const childItems = this.nodes.flatMap((child) => child.responseItems);

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
    const childItems = this.nodes.flatMap((child) => child.expressionItems);
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

export function isNonRepeatingGroupNode(
  it: ICoreNode | undefined,
): it is INonRepeatingGroupNode {
  return it instanceof NonRepeatingGroupStore;
}
