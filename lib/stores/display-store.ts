import { ICoreNode, IDisplayNode, IForm, INode, IScope } from "./types.ts";
import { QuestionnaireItem, QuestionnaireResponseItem } from "fhir/r5";
import { AbstractNodeStore } from "./abstract-node-store.ts";
import { computed } from "mobx";

export class DisplayStore extends AbstractNodeStore implements IDisplayNode {
  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
  ) {
    super(form, template, parentStore, parentScope, parentKey);
  }

  @computed
  override get responseItems(): QuestionnaireResponseItem[] {
    if (!this.isEnabled) {
      return [];
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    return [item];
  }

  @computed
  override get expressionItems(): QuestionnaireResponseItem[] {
    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    return [item];
  }
}

export function isDisplayNode(it: ICoreNode | undefined): it is IDisplayNode {
  return it instanceof DisplayStore;
}
