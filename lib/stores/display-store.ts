import {
  IPresentableNode,
  IDisplayNode,
  IForm,
  INode,
  IScope,
  SnapshotKind,
} from "./types.ts";
import { QuestionnaireItem, QuestionnaireResponseItem } from "fhir/r5";
import { AbstractActualNodeStore } from "./abstract-actual-node-store.ts";
import { computed } from "mobx";

export class DisplayStore
  extends AbstractActualNodeStore
  implements IDisplayNode
{
  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
  ) {
    super(form, template, parentStore, parentScope, parentKey);
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
    if (kind === "response" && !this.isEnabled) {
      return [];
    }

    return [
      {
        linkId: this.linkId,
        text: this.text,
      },
    ];
  }

  dispose(): void {}
}

export function isDisplayNode(
  it: IPresentableNode | undefined,
): it is IDisplayNode {
  return it instanceof DisplayStore;
}
