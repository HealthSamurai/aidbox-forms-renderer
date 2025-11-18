import {
  IPresentableNode,
  IDisplayNode,
  IForm,
  INode,
  IScope,
  SnapshotKind,
  AnswerType,
} from "../../../types.ts";
import { QuestionnaireItem, QuestionnaireResponseItem } from "fhir/r5";
import { AbstractActualNodeStore } from "../base/abstract-actual-node-store.ts";
import { computed } from "mobx";
import { NodeExpressionRegistry } from "../../expressions/node-expression-registry.ts";
import { withQuestionnaireResponseItemMeta } from "../../../utils.ts";

export class DisplayStore
  extends AbstractActualNodeStore
  implements IDisplayNode
{
  readonly expressionRegistry: NodeExpressionRegistry;

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    scope: IScope,
    key: string,
  ) {
    super(form, template, parentStore, scope, key);

    this.expressionRegistry = new NodeExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      template,
      this.template.type as AnswerType,
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

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    if (kind === "response" && !this.isEnabled) {
      return [];
    }

    return [
      withQuestionnaireResponseItemMeta({
        linkId: this.linkId,
        text: kind === "expression" ? this.template.text : this.text,
      }),
    ];
  }

  dispose(): void {}
}

export function isDisplayNode(
  it: IPresentableNode | undefined,
): it is IDisplayNode {
  return it instanceof DisplayStore;
}
